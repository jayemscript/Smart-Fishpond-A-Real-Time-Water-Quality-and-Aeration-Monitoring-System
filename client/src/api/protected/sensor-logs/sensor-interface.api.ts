// ─────────────────────────────────────────────
// RAW SENSOR DATA INTERFACES
// ─────────────────────────────────────────────

export interface DoData {
  sensorId: string;
  oxygenLevel: number;
  timestamp: string;
  status: string;
}

export interface PhData {
  sensorId: string;
  phLevel: number;
  timestamp: string;
  status: string;
}

export interface TempData {
  sensorId: string;
  temperature: number;
  timestamp: string;
  unit: string;
}

export interface WaterLevelData {
  sensorId: string;
  level: number;
  timestamp: string;
  status: string;
}

// ─────────────────────────────────────────────
// SHARED ANALYTICS TYPES
// ─────────────────────────────────────────────

/** Accepted time range values for all analytics endpoints */
export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';

/** A single time-bucketed data point for line charts */
export interface TimeSeriesPoint {
  time: string; // ISO timestamp of the bucket start
  value: number; // Average sensor value within the bucket
  count: number; // Number of raw readings in that bucket
}

/** A single slice in a status distribution (pie / donut chart) */
export interface StatusDistributionSlice {
  status: string;
  count: number;
  percentage: number;
}

/** Descriptive stats returned for a sensor over a time window */
export interface SensorStats {
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
}

// ─────────────────────────────────────────────
// OVERVIEW / DASHBOARD
// ─────────────────────────────────────────────

export interface SensorLatestReading {
  value: number | string;
  unit?: string;
  status: string | null;
  timestamp: string;
}

export interface SensorOverviewBlock {
  latest: SensorLatestReading | null;
  stats24h: SensorStats | null;
  thresholds?: Record<string, number | { min: number; max: number }>;
}

export interface DashboardOverviewData {
  description: string;
  generatedAt: string;
  sensors: {
    dissolvedOxygen: SensorOverviewBlock;
    ph: SensorOverviewBlock;
    temperature: SensorOverviewBlock;
    waterLevel: {
      latest: SensorLatestReading | null;
    };
  };
}

export interface DashboardOverviewResponse {
  status: string;
  message: string;
  data: DashboardOverviewData;
}

// ─────────────────────────────────────────────
// TIME SERIES
// ─────────────────────────────────────────────

export interface TimeSeriesData {
  description?: string;
  range: TimeRange;
  bucketMinutes: number;
  totalRecords: number;
  data: TimeSeriesPoint[];
}

export interface TimeSeriesResponse {
  status: string;
  message: string;
  data: TimeSeriesData;
}

export interface AllSensorsTimeSeriesData {
  description: string;
  range: TimeRange;
  series: {
    dissolvedOxygen: TimeSeriesPoint[];
    ph: TimeSeriesPoint[];
    temperature: TimeSeriesPoint[];
  };
}

export interface AllSensorsTimeSeriesResponse {
  status: string;
  message: string;
  data: AllSensorsTimeSeriesData;
}

// ─────────────────────────────────────────────
// STATUS DISTRIBUTION
// ─────────────────────────────────────────────

export interface StatusDistributionData {
  description: string;
  range: TimeRange;
  since: string;
  total: number;
  distribution: StatusDistributionSlice[];
}

export interface StatusDistributionResponse {
  status: string;
  message: string;
  data: StatusDistributionData;
}

// ─────────────────────────────────────────────
// ALERTS
// ─────────────────────────────────────────────

export interface DoAlert {
  sensorId: string;
  value: number;
  status: string;
  timestamp: string;
}

export interface PhAlert {
  sensorId: string;
  value: number;
  status: string;
  timestamp: string;
}

export interface WaterLevelAlert {
  sensorId: string;
  level: string;
  status: string;
  timestamp: string;
}

export interface AlertSummaryData {
  description: string;
  range: TimeRange;
  since: string;
  totals: {
    dissolvedOxygen: number;
    ph: number;
    waterLevel: number;
    all: number;
  };
  alerts: {
    dissolvedOxygen: DoAlert[];
    ph: PhAlert[];
    waterLevel: WaterLevelAlert[];
  };
}

export interface AlertSummaryResponse {
  status: string;
  message: string;
  data: AlertSummaryData;
}
