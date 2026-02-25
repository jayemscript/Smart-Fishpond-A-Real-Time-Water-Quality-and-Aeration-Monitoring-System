import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DissolvedOxygenRecords } from '../entities/do.entity';
import { PhLevelRecords } from '../entities/ph-level.entity';
import { TemperatureRecord } from '../entities/temperature.entity';
import { WaterLevelRecords } from '../entities/water-level.entity';
import { DoData } from './do.service';
import { PhWaterData } from './ph-water-sensor.service';
import { TemperatureData } from './temperature-sensor.service';
import { WaterLevelData } from './water-level-sensor.service';

// How many readings to buffer before flushing to DB
const BUFFER_LIMIT = 10;

// Fallback: flush every N milliseconds even if buffer isn't full
const FLUSH_INTERVAL_MS = 30_000; // 30 seconds

@Injectable()
export class SensorLoggerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SensorLoggerService.name);

  // In-memory buffers for each sensor type
  private doBuffer: DoData[] = [];
  private phBuffer: PhWaterData[] = [];
  private temperatureBuffer: TemperatureData[] = [];
  private waterLevelBuffer: WaterLevelData[] = [];

  // Timer handle for periodic flushing
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(
    @InjectRepository(DissolvedOxygenRecords)
    private readonly doRepo: Repository<DissolvedOxygenRecords>,

    @InjectRepository(PhLevelRecords)
    private readonly phRepo: Repository<PhLevelRecords>,

    @InjectRepository(TemperatureRecord)
    private readonly temperatureRepo: Repository<TemperatureRecord>,

    @InjectRepository(WaterLevelRecords)
    private readonly waterLevelRepo: Repository<WaterLevelRecords>,
  ) {}

  onModuleInit() {
    // Start the periodic flush timer as a safety net
    this.flushTimer = setInterval(() => {
      this.flushAll();
    }, FLUSH_INTERVAL_MS);

    this.logger.log(
      `SensorLoggerService initialized. Buffer limit: ${BUFFER_LIMIT}, Flush interval: ${FLUSH_INTERVAL_MS / 1000}s`,
    );
  }

  onModuleDestroy() {
    // Clear the timer
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // Flush any remaining buffered data before shutdown
    this.logger.log('Module destroying — flushing remaining sensor buffers...');
    this.flushAll();
  }

  // ─────────────────────────────────────────────
  // PUBLIC: Call these from your sensor services
  // ─────────────────────────────────────────────

  logDo(data: DoData) {
    this.doBuffer.push(data);
    this.logger.debug(`DO buffer: ${this.doBuffer.length}/${BUFFER_LIMIT}`);

    if (this.doBuffer.length >= BUFFER_LIMIT) {
      this.flushDo();
    }
  }

  logPh(data: PhWaterData) {
    this.phBuffer.push(data);
    this.logger.debug(`pH buffer: ${this.phBuffer.length}/${BUFFER_LIMIT}`);

    if (this.phBuffer.length >= BUFFER_LIMIT) {
      this.flushPh();
    }
  }

  logTemperature(data: TemperatureData) {
    this.temperatureBuffer.push(data);
    this.logger.debug(
      `Temperature buffer: ${this.temperatureBuffer.length}/${BUFFER_LIMIT}`,
    );

    if (this.temperatureBuffer.length >= BUFFER_LIMIT) {
      this.flushTemperature();
    }
  }

  logWaterLevel(data: WaterLevelData) {
    this.waterLevelBuffer.push(data);
    this.logger.debug(
      `Water level buffer: ${this.waterLevelBuffer.length}/${BUFFER_LIMIT}`,
    );

    if (this.waterLevelBuffer.length >= BUFFER_LIMIT) {
      this.flushWaterLevel();
    }
  }

  // ─────────────────────────────────────────────
  // PRIVATE: Flush each buffer to the database
  // ─────────────────────────────────────────────

  private async flushDo() {
    if (this.doBuffer.length === 0) return;

    const toSave = [...this.doBuffer];
    this.doBuffer = [];

    try {
      const records = toSave.map((d) => {
        const record = new DissolvedOxygenRecords();
        record.sensorId = d.sensorId;
        record.oxygenLevel = d.oxygenLevel;
        record.timestamp = d.timestamp;
        record.status = this.getDoStatus(d.oxygenLevel);
        return record;
      });

      await this.doRepo.save(records);
      this.logger.log(
        `Flushed ${records.length} dissolved oxygen records to DB`,
      );
    } catch (error) {
      this.logger.error('Failed to flush DO records', error);
      // Re-queue failed records so they aren't lost
      this.doBuffer = [...toSave, ...this.doBuffer];
    }
  }

  private async flushPh() {
    if (this.phBuffer.length === 0) return;

    const toSave = [...this.phBuffer];
    this.phBuffer = [];

    try {
      const records = toSave.map((d) => {
        const record = new PhLevelRecords();
        record.sensorId = d.sensorId;
        record.phLevel = d.phLevel;
        record.timestamp = d.timestamp;
        record.status = d.status;
        return record;
      });

      await this.phRepo.save(records);
      this.logger.log(`Flushed ${records.length} pH records to DB`);
    } catch (error) {
      this.logger.error('Failed to flush pH records', error);
      this.phBuffer = [...toSave, ...this.phBuffer];
    }
  }

  private async flushTemperature() {
    if (this.temperatureBuffer.length === 0) return;

    const toSave = [...this.temperatureBuffer];
    this.temperatureBuffer = [];

    try {
      const records = toSave.map((d) => {
        const record = new TemperatureRecord();
        record.sensorId = d.sensorId;
        record.temperature = d.temperature;
        record.timestamp = d.timestamp;
        record.unit = d.unit ?? '°C'; // fallback if ESP32 doesn't send unit
        return record;
      });

      await this.temperatureRepo.save(records);
      this.logger.log(`Flushed ${records.length} temperature records to DB`);
    } catch (error) {
      this.logger.error('Failed to flush temperature records', error);
      // Only re-queue on transient errors (connection issues), NOT validation errors
      // Validation errors (like null constraint) will never succeed on retry — drop them
      const isTransient = !(error as any)?.message?.includes(
        'null value in column',
      );
      if (isTransient) {
        this.temperatureBuffer = [...toSave, ...this.temperatureBuffer];
      } else {
        this.logger.error(
          `Dropping ${toSave.length} records due to validation error — fix your ESP32 payload`,
        );
      }
    }
  }

  private async flushWaterLevel() {
    if (this.waterLevelBuffer.length === 0) return;

    const toSave = [...this.waterLevelBuffer];
    this.waterLevelBuffer = [];

    try {
      const records = toSave.map((d) => {
        const record = new WaterLevelRecords();
        record.sensorId = d.sensorId;
        record.level = String(d.level);
        record.timestamp = d.timestamp;
        record.status = d.status;
        return record;
      });

      await this.waterLevelRepo.save(records);
      this.logger.log(`Flushed ${records.length} water level records to DB`);
    } catch (error) {
      this.logger.error('Failed to flush water level records', error);
      this.waterLevelBuffer = [...toSave, ...this.waterLevelBuffer];
    }
  }

  /** Flush all buffers — called on interval and module destroy */
  private flushAll() {
    this.flushDo();
    this.flushPh();
    this.flushTemperature();
    this.flushWaterLevel();
  }

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────

  /** Determine DO status based on typical aquaculture thresholds */
  private getDoStatus(oxygenLevel: number): string {
    if (oxygenLevel < 4) return 'critical';
    if (oxygenLevel < 6) return 'low';
    if (oxygenLevel <= 10) return 'normal';
    return 'high';
  }
}
