import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { DissolvedOxygenRecords } from '../entities/do.entity';
import { PhLevelRecords } from '../entities/ph-level.entity';
import { TemperatureRecord } from '../entities/temperature.entity';
import { WaterLevelRecords } from '../entities/water-level.entity';

export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';

/** Maps a TimeRange string to milliseconds */
function msFromRange(range: TimeRange): number {
  const map: Record<TimeRange, number> = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  };
  return map[range] ?? map['24h'];
}

/** Bucket size (in minutes) per time range */
function bucketMinutes(range: TimeRange): number {
  const map: Record<TimeRange, number> = {
    '1h': 5,
    '6h': 15,
    '24h': 60,
    '7d': 360,
    '30d': 1440,
  };
  return map[range] ?? 60;
}

/** Floor a Date to the nearest bucket boundary */
function floorToBucket(date: Date, bucketMin: number): Date {
  const ms = bucketMin * 60 * 1000;
  return new Date(Math.floor(date.getTime() / ms) * ms);
}

/** Compute basic descriptive statistics from an array of numbers */
function stats(values: number[]) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / sorted.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];
  const variance =
    sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / sorted.length;
  const stdDev = Math.sqrt(variance);

  return {
    count: sorted.length,
    min: +min.toFixed(3),
    max: +max.toFixed(3),
    mean: +mean.toFixed(3),
    median: +median.toFixed(3),
    stdDev: +stdDev.toFixed(3),
  };
}

@Injectable()
export class SensorAnalyticsService {
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. OVERVIEW DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Returns the most recent reading and a 24-hour stat summary for all four
   * sensor types in a single request. Use to populate the dashboard stat cards.
   *
   * NOTE: Uses find({ take: 1 }) instead of findOne() to stay compatible with
   * TypeORM v0.3+ which requires a where clause on findOne.
   */
  async getDashboardOverview() {
    const since = new Date(Date.now() - msFromRange('24h'));

    // Use find + take: 1 — TypeORM v0.3 findOne() requires a where clause
    const [[latestDo], [latestPh], [latestTemp], [latestWater]] =
      await Promise.all([
        this.doRepo.find({ order: { timestamp: 'DESC' }, take: 1 }),
        this.phRepo.find({ order: { timestamp: 'DESC' }, take: 1 }),
        this.temperatureRepo.find({ order: { timestamp: 'DESC' }, take: 1 }),
        this.waterLevelRepo.find({ order: { timestamp: 'DESC' }, take: 1 }),
      ]);

    const [doRecords, phRecords, tempRecords] = await Promise.all([
      this.doRepo.find({ where: { timestamp: MoreThanOrEqual(since) } }),
      this.phRepo.find({ where: { timestamp: MoreThanOrEqual(since) } }),
      this.temperatureRepo.find({
        where: { timestamp: MoreThanOrEqual(since) },
      }),
    ]);

    return {
      description:
        'Snapshot of the current fishpond conditions across all sensors. ' +
        'Latest readings reflect real-time state; stats cover the last 24 hours.',
      generatedAt: new Date(),
      sensors: {
        dissolvedOxygen: {
          latest: latestDo
            ? {
                value: latestDo.oxygenLevel,
                unit: 'mg/L',
                status: latestDo.status,
                timestamp: latestDo.timestamp,
              }
            : null,
          stats24h: stats(doRecords.map((r) => r.oxygenLevel)),
          thresholds: { critical: 4, low: 6, normal: 10 },
        },
        ph: {
          latest: latestPh
            ? {
                value: latestPh.phLevel,
                unit: 'pH',
                status: latestPh.status,
                timestamp: latestPh.timestamp,
              }
            : null,
          stats24h: stats(phRecords.map((r) => r.phLevel)),
          thresholds: {
            acidic: 6.5,
            optimal: { min: 6.5, max: 8.5 },
            alkaline: 8.5,
          },
        },
        temperature: {
          latest: latestTemp
            ? {
                value: latestTemp.temperature,
                unit: latestTemp.unit,
                status: null,
                timestamp: latestTemp.timestamp,
              }
            : null,
          stats24h: stats(tempRecords.map((r) => r.temperature)),
          thresholds: { cold: 25, optimal: { min: 25, max: 32 }, hot: 32 },
        },
        waterLevel: {
          latest: latestWater
            ? {
                value: latestWater.level,
                status: latestWater.status,
                timestamp: latestWater.timestamp,
              }
            : null,
        },
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. TIME-SERIES CHART DATA
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Returns time-bucketed dissolved oxygen averages suitable for a line chart.
   */
  async getDoTimeSeries(range: TimeRange = '24h', sensorId?: string) {
    return this._buildTimeSeries(
      this.doRepo,
      'oxygenLevel',
      range,
      sensorId,
      'Dissolved Oxygen over time. Values below 4 mg/L are critical for fish survival.',
    );
  }

  /** Returns time-bucketed pH averages suitable for a line chart. */
  async getPhTimeSeries(range: TimeRange = '24h', sensorId?: string) {
    return this._buildTimeSeries(
      this.phRepo,
      'phLevel',
      range,
      sensorId,
      'pH level trend. Optimal range for aquaculture is 6.5–8.5.',
    );
  }

  /** Returns time-bucketed temperature averages suitable for a line chart. */
  async getTemperatureTimeSeries(range: TimeRange = '24h', sensorId?: string) {
    return this._buildTimeSeries(
      this.temperatureRepo,
      'temperature',
      range,
      sensorId,
      'Water temperature trend. Fish are stressed outside the 25–32 °C range.',
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. STATUS DISTRIBUTION (Pie / Donut chart)
  // ─────────────────────────────────────────────────────────────────────────────

  /** Returns dissolved oxygen status counts for a pie / donut chart. */
  async getDoStatusDistribution(range: TimeRange = '24h') {
    return this._buildStatusDistribution(
      this.doRepo,
      range,
      'Distribution of dissolved oxygen readings by status level. ' +
        'Highlights how often the pond reaches dangerous oxygen levels.',
    );
  }

  /** Returns pH status distribution counts. */
  async getPhStatusDistribution(range: TimeRange = '24h') {
    return this._buildStatusDistribution(
      this.phRepo,
      range,
      'Distribution of pH readings by status.',
    );
  }

  /** Returns water level status distribution counts. */
  async getWaterLevelStatusDistribution(range: TimeRange = '24h') {
    return this._buildStatusDistribution(
      this.waterLevelRepo,
      range,
      'Distribution of water level status readings.',
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. ALERTS / ANOMALY SUMMARY
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Returns all out-of-range readings across every sensor for the given time
   * window. Useful for an alerts panel or anomaly frequency bar chart.
   */
  async getAlertSummary(range: TimeRange = '24h') {
    const since = new Date(Date.now() - msFromRange(range));

    const [doAlerts, phAlerts, waterAlerts] = await Promise.all([
      this.doRepo
        .createQueryBuilder('r')
        .where('r.timestamp >= :since', { since })
        .andWhere("r.status != 'normal'")
        .orderBy('r.timestamp', 'DESC')
        .getMany(),

      this.phRepo
        .createQueryBuilder('r')
        .where('r.timestamp >= :since', { since })
        .andWhere("r.status != 'normal'")
        .orderBy('r.timestamp', 'DESC')
        .getMany(),

      this.waterLevelRepo
        .createQueryBuilder('r')
        .where('r.timestamp >= :since', { since })
        .andWhere("r.status != 'normal'")
        .orderBy('r.timestamp', 'DESC')
        .getMany(),
    ]);

    return {
      description:
        'All out-of-range sensor readings within the selected window.',
      range,
      since,
      totals: {
        dissolvedOxygen: doAlerts.length,
        ph: phAlerts.length,
        waterLevel: waterAlerts.length,
        all: doAlerts.length + phAlerts.length + waterAlerts.length,
      },
      alerts: {
        dissolvedOxygen: doAlerts.map((r) => ({
          sensorId: r.sensorId,
          value: r.oxygenLevel,
          status: r.status,
          timestamp: r.timestamp,
        })),
        ph: phAlerts.map((r) => ({
          sensorId: r.sensorId,
          value: r.phLevel,
          status: r.status,
          timestamp: r.timestamp,
        })),
        waterLevel: waterAlerts.map((r) => ({
          sensorId: r.sensorId,
          level: r.level,
          status: r.status,
          timestamp: r.timestamp,
        })),
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. COMBINED MULTI-SENSOR TIME SERIES
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Returns bucketed time-series data for all sensors at once.
   * Ideal for a multi-line overlay chart.
   */
  async getAllSensorsTimeSeries(range: TimeRange = '24h') {
    const [doSeries, phSeries, tempSeries] = await Promise.all([
      this._buildTimeSeries(this.doRepo, 'oxygenLevel', range),
      this._buildTimeSeries(this.phRepo, 'phLevel', range),
      this._buildTimeSeries(this.temperatureRepo, 'temperature', range),
    ]);

    return {
      description:
        'Multi-sensor time-series data for overlay charting. ' +
        'Correlate dissolved oxygen, pH, and temperature trends side by side.',
      range,
      series: {
        dissolvedOxygen: doSeries.data,
        ph: phSeries.data,
        temperature: tempSeries.data,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  private async _buildTimeSeries(
    repo: Repository<any>,
    valueField: string,
    range: TimeRange,
    sensorId?: string,
    description?: string,
  ) {
    const since = new Date(Date.now() - msFromRange(range));
    const bucketMin = bucketMinutes(range);

    const qb = repo
      .createQueryBuilder('r')
      .where('r.timestamp >= :since', { since })
      .orderBy('r.timestamp', 'ASC');

    if (sensorId) {
      qb.andWhere('r.sensorId = :sensorId', { sensorId });
    }

    const records: any[] = await qb.getMany();

    const bucketMap = new Map<string, number[]>();
    for (const r of records) {
      if (!r.timestamp) continue;
      const bucket = floorToBucket(new Date(r.timestamp), bucketMin);
      const key = bucket.toISOString();
      if (!bucketMap.has(key)) bucketMap.set(key, []);
      bucketMap.get(key)!.push(r[valueField]);
    }

    const data = Array.from(bucketMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, values]) => ({
        time,
        value: +(values.reduce((s, v) => s + v, 0) / values.length).toFixed(3),
        count: values.length,
      }));

    return {
      description,
      range,
      bucketMinutes: bucketMin,
      totalRecords: records.length,
      data,
    };
  }

  private async _buildStatusDistribution(
    repo: Repository<any>,
    range: TimeRange,
    description: string,
  ) {
    const since = new Date(Date.now() - msFromRange(range));

    const records: any[] = await repo
      .createQueryBuilder('r')
      .select('r.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('r.timestamp >= :since', { since })
      .groupBy('r.status')
      .getRawMany();

    const distribution = records.map((r) => ({
      status: r.status,
      count: parseInt(r.count, 10),
    }));

    const total = distribution.reduce((s, r) => s + r.count, 0);

    return {
      description,
      range,
      since,
      total,
      distribution: distribution.map((r) => ({
        ...r,
        percentage: total > 0 ? +((r.count / total) * 100).toFixed(1) : 0,
      })),
    };
  }
}
