'use client';
import axios from '@/configs/axios-instance-client';
import { handleRequest } from '@/configs/api.helper';
import { GetAllPaginatedParams } from '@/interfaces/shared-api.interface';
import {
  DoData,
  PhData,
  TempData,
  WaterLevelData,
  TimeRange,
  TimeSeriesResponse,
  AllSensorsTimeSeriesResponse,
  StatusDistributionResponse,
  AlertSummaryResponse,
  DashboardOverviewResponse,
} from './sensor-interface.api';

// ─────────────────────────────────────────────
// PAGINATED RESPONSE INTERFACES
// ─────────────────────────────────────────────

export interface PaginatedMeta {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface getAllPaginatedDo extends PaginatedMeta {
  do_data: DoData[];
}

export interface getAllPaginatedPh extends PaginatedMeta {
  ph_data: PhData[];
}

export interface getAllPaginatedTemp extends PaginatedMeta {
  temp_data: TempData[];
}

export interface getAllPaginatedWaterLevel extends PaginatedMeta {
  water_level_data: WaterLevelData[];
}

// ─────────────────────────────────────────────
// PAGINATED LOG ENDPOINTS
// ─────────────────────────────────────────────

export async function GetAllPaginatedDo(
  params: GetAllPaginatedParams,
): Promise<getAllPaginatedDo> {
  return handleRequest(
    axios.get('/sensor-logs/get-all-paginated-do', {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      },
    }),
  );
}

export async function GetAllPaginatedPh(
  params: GetAllPaginatedParams,
): Promise<getAllPaginatedPh> {
  return handleRequest(
    axios.get('/sensor-logs/get-all-paginated-ph', {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      },
    }),
  );
}

export async function GetAllPaginatedTemp(
  params: GetAllPaginatedParams,
): Promise<getAllPaginatedTemp> {
  return handleRequest(
    axios.get('/sensor-logs/get-all-paginated-temp', {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      },
    }),
  );
}

export async function GetAllPaginatedWaterLevel(
  params: GetAllPaginatedParams,
): Promise<getAllPaginatedWaterLevel> {
  return handleRequest(
    axios.get('/sensor-logs/get-all-paginated-water', {
      params: {
        page: params.page,
        limit: params.limit,
        keyword: params.keyword,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      },
    }),
  );
}

// ─────────────────────────────────────────────
// ANALYTICS ENDPOINTS
// ─────────────────────────────────────────────

/**
 * Fetches the latest reading + 24h stat summary for all sensors.
 * Use to populate dashboard stat cards.
 */
export async function GetDashboardOverview(): Promise<DashboardOverviewResponse> {
  return handleRequest(axios.get('/sensor-logs/analytics/overview'));
}

/**
 * Fetches time-bucketed trends for ALL sensors in a single request.
 * Use for a multi-line overlay chart.
 *
 * @param range  - 1h | 6h | 24h | 7d | 30d  (default: 24h)
 */
export async function GetAllSensorsTimeSeries(
  range: TimeRange = '24h',
): Promise<AllSensorsTimeSeriesResponse> {
  return handleRequest(
    axios.get('/sensor-logs/analytics/time-series/all', { params: { range } }),
  );
}

/**
 * Fetches dissolved oxygen trend data for a line chart.
 *
 * @param range     - 1h | 6h | 24h | 7d | 30d  (default: 24h)
 * @param sensorId  - Filter to a specific sensor (optional)
 */
export async function GetDoTimeSeries(
  range: TimeRange = '24h',
  sensorId?: string,
): Promise<TimeSeriesResponse> {
  return handleRequest(
    axios.get('/sensor-logs/analytics/time-series/do', {
      params: { range, sensorId },
    }),
  );
}

/**
 * Fetches pH trend data for a line chart.
 *
 * @param range     - 1h | 6h | 24h | 7d | 30d  (default: 24h)
 * @param sensorId  - Filter to a specific sensor (optional)
 */
export async function GetPhTimeSeries(
  range: TimeRange = '24h',
  sensorId?: string,
): Promise<TimeSeriesResponse> {
  return handleRequest(
    axios.get('/sensor-logs/analytics/time-series/ph', {
      params: { range, sensorId },
    }),
  );
}

/**
 * Fetches temperature trend data for a line chart.
 *
 * @param range     - 1h | 6h | 24h | 7d | 30d  (default: 24h)
 * @param sensorId  - Filter to a specific sensor (optional)
 */
export async function GetTemperatureTimeSeries(
  range: TimeRange = '24h',
  sensorId?: string,
): Promise<TimeSeriesResponse> {
  return handleRequest(
    axios.get('/sensor-logs/analytics/time-series/temperature', {
      params: { range, sensorId },
    }),
  );
}

/**
 * Fetches dissolved oxygen status breakdown (critical / low / normal / high).
 * Use for a pie or donut chart.
 *
 * @param range - 1h | 6h | 24h | 7d | 30d  (default: 24h)
 */
export async function GetDoStatusDistribution(
  range: TimeRange = '24h',
): Promise<StatusDistributionResponse> {
  return handleRequest(
    axios.get('/sensor-logs/analytics/status-distribution/do', {
      params: { range },
    }),
  );
}

/**
 * Fetches pH status breakdown for a pie or donut chart.
 *
 * @param range - 1h | 6h | 24h | 7d | 30d  (default: 24h)
 */
export async function GetPhStatusDistribution(
  range: TimeRange = '24h',
): Promise<StatusDistributionResponse> {
  return handleRequest(
    axios.get('/sensor-logs/analytics/status-distribution/ph', {
      params: { range },
    }),
  );
}

/**
 * Fetches water level status breakdown for a pie or donut chart.
 *
 * @param range - 1h | 6h | 24h | 7d | 30d  (default: 24h)
 */
export async function GetWaterLevelStatusDistribution(
  range: TimeRange = '24h',
): Promise<StatusDistributionResponse> {
  return handleRequest(
    axios.get('/sensor-logs/analytics/status-distribution/water-level', {
      params: { range },
    }),
  );
}

/**
 * Fetches all out-of-range readings across every sensor for the given window.
 * Use for an alerts panel or a daily alert frequency bar chart.
 *
 * @param range - 1h | 6h | 24h | 7d | 30d  (default: 24h)
 */
export async function GetAlertSummary(
  range: TimeRange = '24h',
): Promise<AlertSummaryResponse> {
  return handleRequest(
    axios.get('/sensor-logs/analytics/alerts', { params: { range } }),
  );
}
