// import { Injectable, Logger, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { TemperatureRecord } from '../entities/temperature.entity';
// import { WaterLevelRecords } from '../entities/water-level.entity';
// import { PhLevelRecords } from '../entities/ph-level.entity';
// import { DissolvedOxygenRecords } from '../entities/do.entity';
// import { TemperatureData } from './temperature-sensor.service';
// import { WaterLevelData } from './water-level-sensor.service';
// import { PhWaterData } from './ph-water-sensor.service';
// import { DoData } from './do.service';

// // ─── Report Types ────────────────────────────────────────────────────────────

// export type SensorType = 'temperature' | 'ph-level' | 'water-level' | 'do';

// export interface ReportMeta {
//   sensor: SensorType;
//   label: string;
//   unit: string;
//   description: string;
//   generatedAt: string;
//   sampleSize: number;
// }

// export interface SensorReportResult<T> {
//   meta: ReportMeta;
//   summary: {
//     average: number | string;
//     min: number | string;
//     max: number | string;
//     latestTimestamp: Date | null;
//   };
//   records: T[];
// }

// // ─── Sensor Metadata Config ───────────────────────────────────────────────────

// const SENSOR_META: Record<
//   SensorType,
//   { label: string; unit: string; description: string }
// > = {
//   temperature: {
//     label: 'Water Temperature Sensor',
//     unit: '°C',
//     description:
//       'Monitors the water temperature to ensure it stays within the optimal range for aquatic life. ' +
//       'Extreme temperatures can stress fish and affect dissolved oxygen levels.',
//   },
//   'ph-level': {
//     label: 'pH Level Sensor',
//     unit: 'pH',
//     description:
//       'Tracks the acidity or alkalinity of the water. A pH between 6.5 and 8.5 is considered normal. ' +
//       'Values below 6.5 indicate acidic conditions while values above 8.5 indicate alkaline conditions.',
//   },
//   'water-level': {
//     label: 'Water Level Sensor',
//     unit: 'level',
//     description:
//       'Detects the current water level status in the tank or pond. ' +
//       'Ensures the system maintains a safe operating water level at all times.',
//   },
//   do: {
//     label: 'Dissolved Oxygen (DO) Sensor',
//     unit: 'mg/L',
//     description:
//       'Measures the concentration of dissolved oxygen in the water, which is critical for aquatic life. ' +
//       'Low DO levels can lead to fish stress or mortality.',
//   },
// };

// // ─── Service ─────────────────────────────────────────────────────────────────

// @Injectable()
// export class SensorRecordsService {
//   private readonly logger = new Logger(SensorRecordsService.name);

//   constructor(
//     @InjectRepository(TemperatureRecord)
//     private readonly temperatureRepo: Repository<TemperatureRecord>,

//     @InjectRepository(WaterLevelRecords)
//     private readonly waterLevelRepo: Repository<WaterLevelRecords>,

//     @InjectRepository(PhLevelRecords)
//     private readonly phLevelRepo: Repository<PhLevelRecords>,

//     @InjectRepository(DissolvedOxygenRecords)
//     private readonly doRepo: Repository<DissolvedOxygenRecords>,
//   ) {}

//   // ─── Save Methods ───────────────────────────────────────────────────────────

//   /**
//    * Save a temperature record to the database.
//    * Called automatically when broadcasting is active and ESP32 data arrives.
//    */
//   async saveTemperatureRecord(
//     data: TemperatureData,
//   ): Promise<TemperatureRecord> {
//     const record = this.temperatureRepo.create({
//       sensorId: data.sensorId,
//       temperature: data.temperature,
//       timestamp: data.timestamp,
//       unit: data.unit,
//     });
//     const saved = await this.temperatureRepo.save(record);
//     this.logger.log(
//       `Saved temperature record: ${saved.temperature}${saved.unit} from ${saved.sensorId}`,
//     );
//     return saved;
//   }

//   /**
//    * Save a water level record to the database.
//    * Called automatically when broadcasting is active and ESP32 data arrives.
//    */
//   async saveWaterLevelRecord(data: WaterLevelData): Promise<WaterLevelRecords> {
//     const record = this.waterLevelRepo.create({
//       sensorId: data.sensorId,
//       level: data.level,
//       timestamp: data.timestamp,
//       status: data.status,
//     });
//     const saved = await this.waterLevelRepo.save(record);
//     this.logger.log(
//       `Saved water level record: ${saved.level} (${saved.status}) from ${saved.sensorId}`,
//     );
//     return saved;
//   }

//   /**
//    * Save a pH level record to the database.
//    * Called automatically when broadcasting is active and ESP32 data arrives.
//    */
//   async savePhLevelRecord(data: PhWaterData): Promise<PhLevelRecords> {
//     const record = this.phLevelRepo.create({
//       sensorId: data.sensorId,
//       phLevel: data.phLevel,
//       timestamp: data.timestamp,
//       status: data.status,
//     });
//     const saved = await this.phLevelRepo.save(record);
//     this.logger.log(
//       `Saved pH level record: ${saved.phLevel} (${saved.status}) from ${saved.sensorId}`,
//     );
//     return saved;
//   }

//   /**
//    * Save a dissolved oxygen record to the database.
//    * Called automatically when broadcasting is active and ESP32 data arrives.
//    */
//   async saveDoRecord(data: DoData): Promise<DissolvedOxygenRecords> {
//     const record = this.doRepo.create({
//       sensorId: data.sensorId,
//       value: data.value,
//       timestamp: data.timestamp,
//       // DO entity has a status column; derive it from value thresholds
//       status: data.value < 4 ? 'low' : data.value > 10 ? 'high' : 'normal',
//     });
//     const saved = await this.doRepo.save(record);
//     this.logger.log(
//       `Saved DO record: ${saved.value} mg/L from ${saved.sensorId}`,
//     );
//     return saved;
//   }

//   // ─── Unified saveRecord dispatcher ─────────────────────────────────────────

//   /**
//    * Generic dispatcher — call this from any sensor service instead of
//    * the individual methods above when you only have the sensor type and payload.
//    */
//   async saveRecord(
//     sensor: SensorType,
//     data: TemperatureData | WaterLevelData | PhWaterData | DoData,
//   ) {
//     switch (sensor) {
//       case 'temperature':
//         return this.saveTemperatureRecord(data as TemperatureData);
//       case 'water-level':
//         return this.saveWaterLevelRecord(data as WaterLevelData);
//       case 'ph-level':
//         return this.savePhLevelRecord(data as PhWaterData);
//       case 'do':
//         return this.saveDoRecord(data as DoData);
//       default:
//         throw new BadRequestException(`Unknown sensor type: ${sensor}`);
//     }
//   }

//   // ─── Report Methods ─────────────────────────────────────────────────────────

//   /**
//    * Fetch the last N records for a given sensor type, compute average/min/max,
//    * and return a structured report object ready for PDF generation.
//    *
//    * @param sensor  - One of: 'temperature' | 'ph-level' | 'water-level' | 'do'
//    * @param limit   - Number of latest records to include (default: 10)
//    * @param sensorId - Optional: filter by a specific sensor ID
//    */
//   async getReports(
//     sensor: SensorType,
//     limit = 10,
//     sensorId?: string,
//   ): Promise<SensorReportResult<any>> {
//     const meta: ReportMeta = {
//       sensor,
//       ...SENSOR_META[sensor],
//       generatedAt: new Date().toISOString(),
//       sampleSize: limit,
//     };

//     switch (sensor) {
//       case 'temperature':
//         return this.buildTemperatureReport(meta, limit, sensorId);
//       case 'ph-level':
//         return this.buildPhLevelReport(meta, limit, sensorId);
//       case 'water-level':
//         return this.buildWaterLevelReport(meta, limit, sensorId);
//       case 'do':
//         return this.buildDoReport(meta, limit, sensorId);
//       default:
//         throw new BadRequestException(
//           `Invalid sensor type "${sensor}". Valid options: temperature, ph-level, water-level, do`,
//         );
//     }
//   }

//   // ─── Private Report Builders ────────────────────────────────────────────────

//   private async buildTemperatureReport(
//     meta: ReportMeta,
//     limit: number,
//     sensorId?: string,
//   ): Promise<SensorReportResult<TemperatureRecord>> {
//     const qb = this.temperatureRepo
//       .createQueryBuilder('r')
//       .orderBy('r.timestamp', 'DESC')
//       .take(limit);

//     if (sensorId) qb.where('r.sensor_id = :sensorId', { sensorId });

//     const records = await qb.getMany();

//     const values = records.map((r) => r.temperature);
//     const average = this.avg(values);

//     return {
//       meta: { ...meta, sampleSize: records.length },
//       summary: {
//         average: average !== null ? +average.toFixed(2) : 'N/A',
//         min: values.length ? Math.min(...values) : 'N/A',
//         max: values.length ? Math.max(...values) : 'N/A',
//         latestTimestamp: records[0]?.timestamp ?? null,
//       },
//       records,
//     };
//   }

//   private async buildPhLevelReport(
//     meta: ReportMeta,
//     limit: number,
//     sensorId?: string,
//   ): Promise<SensorReportResult<PhLevelRecords>> {
//     const qb = this.phLevelRepo
//       .createQueryBuilder('r')
//       .orderBy('r.timestamp', 'DESC')
//       .take(limit);

//     if (sensorId) qb.where('r.sensor_id = :sensorId', { sensorId });

//     const records = await qb.getMany();

//     const values = records.map((r) => r.phLevel);
//     const average = this.avg(values);

//     return {
//       meta: { ...meta, sampleSize: records.length },
//       summary: {
//         average: average !== null ? +average.toFixed(2) : 'N/A',
//         min: values.length ? +Math.min(...values).toFixed(2) : 'N/A',
//         max: values.length ? +Math.max(...values).toFixed(2) : 'N/A',
//         latestTimestamp: records[0]?.timestamp ?? null,
//       },
//       records,
//     };
//   }

//   private async buildWaterLevelReport(
//     meta: ReportMeta,
//     limit: number,
//     sensorId?: string,
//   ): Promise<SensorReportResult<WaterLevelRecords>> {
//     const qb = this.waterLevelRepo
//       .createQueryBuilder('r')
//       .orderBy('r.timestamp', 'DESC')
//       .take(limit);

//     if (sensorId) qb.where('r.sensor_id = :sensorId', { sensorId });

//     const records = await qb.getMany();

//     // water-level is a varchar (e.g. "low", "normal", "high") — no numeric average
//     const statusCounts = records.reduce<Record<string, number>>((acc, r) => {
//       acc[r.status] = (acc[r.status] ?? 0) + 1;
//       return acc;
//     }, {});

//     const mostCommonStatus =
//       Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

//     return {
//       meta: { ...meta, sampleSize: records.length },
//       summary: {
//         average: mostCommonStatus, // most frequent status used as "average" for categorical data
//         min: 'N/A',
//         max: 'N/A',
//         latestTimestamp: records[0]?.timestamp ?? null,
//       },
//       records,
//     };
//   }

//   private async buildDoReport(
//     meta: ReportMeta,
//     limit: number,
//     sensorId?: string,
//   ): Promise<SensorReportResult<DissolvedOxygenRecords>> {
//     const qb = this.doRepo
//       .createQueryBuilder('r')
//       .orderBy('r.timestamp', 'DESC')
//       .take(limit);

//     if (sensorId) qb.where('r.sensor_id = :sensorId', { sensorId });

//     const records = await qb.getMany();

//     const values = records.map((r) => r.value);
//     const average = this.avg(values);

//     return {
//       meta: { ...meta, sampleSize: records.length },
//       summary: {
//         average: average !== null ? +average.toFixed(2) : 'N/A',
//         min: values.length ? +Math.min(...values).toFixed(2) : 'N/A',
//         max: values.length ? +Math.max(...values).toFixed(2) : 'N/A',
//         latestTimestamp: records[0]?.timestamp ?? null,
//       },
//       records,
//     };
//   }

//   // ─── Helpers ─────────────────────────────────────────────────────────────────

//   private avg(values: number[]): number | null {
//     if (!values.length) return null;
//     return values.reduce((sum, v) => sum + v, 0) / values.length;
//   }
// }
