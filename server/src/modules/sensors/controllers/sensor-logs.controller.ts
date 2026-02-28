import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SessionGuard } from 'src/guards/session.guard';
import { SensorLogsService } from '../services/sensor-logs.service';
import {
  SensorAnalyticsService,
  TimeRange,
} from '../services/sensor-analytics.service';

const VALID_RANGES: TimeRange[] = ['1h', '6h', '24h', '7d', '30d'];

function parseRange(raw?: string): TimeRange {
  return VALID_RANGES.includes(raw as TimeRange) ? (raw as TimeRange) : '24h';
}

@UseGuards(JwtAuthGuard, SessionGuard)
@Controller('sensor-logs')
export class SensorLogsController {
  constructor(
    private readonly sensorLogsService: SensorLogsService,
    private readonly sensorAnalyticsService: SensorAnalyticsService,
  ) {}

  // ─────────────────────────────────────────────
  // EXISTING PAGINATED LOG ROUTES
  // ─────────────────────────────────────────────

  @Get('get-all-paginated-do')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedDo(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.sensorLogsService.getAllPaginatedDo(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );
    return {
      status: 'success',
      message: 'Data fetched successfully',
      ...result,
    };
  }

  @Get('get-all-paginated-ph')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedPh(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.sensorLogsService.getAllPaginatedPh(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );
    return {
      status: 'success',
      message: 'Data fetched successfully',
      ...result,
    };
  }

  @Get('get-all-paginated-temp')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedTemp(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.sensorLogsService.getAllPaginatedTemp(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );
    return {
      status: 'success',
      message: 'Data fetched successfully',
      ...result,
    };
  }

  @Get('get-all-paginated-water')
  @HttpCode(HttpStatus.OK)
  async getAllPaginatedWaterLevel(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ) {
    const result = await this.sensorLogsService.getAllPaginatedWaterLevel(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
      keyword,
      sortBy,
      sortOrder,
      filters,
    );
    return {
      status: 'success',
      message: 'Data fetched successfully',
      ...result,
    };
  }

  // ─────────────────────────────────────────────
  // ANALYTICS ROUTES
  // ─────────────────────────────────────────────

  /**
   * GET /sensor-logs/analytics/overview
   *
   * Dashboard overview — latest readings + 24-hour stat summary for all sensors.
   * Powers the top-row stat cards (current value, min, max, mean).
   */
  @Get('analytics/overview')
  @HttpCode(HttpStatus.OK)
  async getDashboardOverview() {
    const data = await this.sensorAnalyticsService.getDashboardOverview();
    return {
      status: 'success',
      message: 'Dashboard overview fetched successfully',
      data,
    };
  }

  /**
   * GET /sensor-logs/analytics/time-series/all?range=24h
   *
   * Multi-sensor bucketed time series in one call.
   * Ideal for a shadcn multi-line overlay chart.
   *
   * Query params:
   *   range  — 1h | 6h | 24h | 7d | 30d  (default: 24h)
   */
  @Get('analytics/time-series/all')
  @HttpCode(HttpStatus.OK)
  async getAllSensorsTimeSeries(@Query('range') range?: string) {
    const data = await this.sensorAnalyticsService.getAllSensorsTimeSeries(
      parseRange(range),
    );
    return {
      status: 'success',
      message: 'Multi-sensor time series fetched successfully',
      data,
    };
  }

  /**
   * GET /sensor-logs/analytics/time-series/do?range=24h&sensorId=do-01
   *
   * Dissolved oxygen trend line data.
   * Each point: { time: ISO string, value: number, count: number }
   *
   * Query params:
   *   range     — 1h | 6h | 24h | 7d | 30d  (default: 24h)
   *   sensorId  — filter to a single sensor (optional)
   */
  @Get('analytics/time-series/do')
  @HttpCode(HttpStatus.OK)
  async getDoTimeSeries(
    @Query('range') range?: string,
    @Query('sensorId') sensorId?: string,
  ) {
    const data = await this.sensorAnalyticsService.getDoTimeSeries(
      parseRange(range),
      sensorId,
    );
    return {
      status: 'success',
      message: 'DO time series fetched successfully',
      data,
    };
  }

  /**
   * GET /sensor-logs/analytics/time-series/ph?range=24h&sensorId=ph-01
   *
   * pH trend line data.
   *
   * Query params:
   *   range     — 1h | 6h | 24h | 7d | 30d  (default: 24h)
   *   sensorId  — filter to a single sensor (optional)
   */
  @Get('analytics/time-series/ph')
  @HttpCode(HttpStatus.OK)
  async getPhTimeSeries(
    @Query('range') range?: string,
    @Query('sensorId') sensorId?: string,
  ) {
    const data = await this.sensorAnalyticsService.getPhTimeSeries(
      parseRange(range),
      sensorId,
    );
    return {
      status: 'success',
      message: 'pH time series fetched successfully',
      data,
    };
  }

  /**
   * GET /sensor-logs/analytics/time-series/temperature?range=24h&sensorId=temp-01
   *
   * Temperature trend line data.
   *
   * Query params:
   *   range     — 1h | 6h | 24h | 7d | 30d  (default: 24h)
   *   sensorId  — filter to a single sensor (optional)
   */
  @Get('analytics/time-series/temperature')
  @HttpCode(HttpStatus.OK)
  async getTemperatureTimeSeries(
    @Query('range') range?: string,
    @Query('sensorId') sensorId?: string,
  ) {
    const data = await this.sensorAnalyticsService.getTemperatureTimeSeries(
      parseRange(range),
      sensorId,
    );
    return {
      status: 'success',
      message: 'Temperature time series fetched successfully',
      data,
    };
  }

  /**
   * GET /sensor-logs/analytics/status-distribution/do?range=24h
   *
   * Dissolved oxygen status breakdown — critical / low / normal / high counts.
   * Use for a shadcn Pie or Donut chart.
   *
   * Query params:
   *   range — 1h | 6h | 24h | 7d | 30d  (default: 24h)
   */
  @Get('analytics/status-distribution/do')
  @HttpCode(HttpStatus.OK)
  async getDoStatusDistribution(@Query('range') range?: string) {
    const data = await this.sensorAnalyticsService.getDoStatusDistribution(
      parseRange(range),
    );
    return {
      status: 'success',
      message: 'DO status distribution fetched successfully',
      data,
    };
  }

  /**
   * GET /sensor-logs/analytics/status-distribution/ph?range=24h
   *
   * pH status breakdown counts for a Pie / Donut chart.
   *
   * Query params:
   *   range — 1h | 6h | 24h | 7d | 30d  (default: 24h)
   */
  @Get('analytics/status-distribution/ph')
  @HttpCode(HttpStatus.OK)
  async getPhStatusDistribution(@Query('range') range?: string) {
    const data = await this.sensorAnalyticsService.getPhStatusDistribution(
      parseRange(range),
    );
    return {
      status: 'success',
      message: 'pH status distribution fetched successfully',
      data,
    };
  }

  /**
   * GET /sensor-logs/analytics/status-distribution/water-level?range=24h
   *
   * Water level status breakdown counts for a Pie / Donut chart.
   *
   * Query params:
   *   range — 1h | 6h | 24h | 7d | 30d  (default: 24h)
   */
  @Get('analytics/status-distribution/water-level')
  @HttpCode(HttpStatus.OK)
  async getWaterLevelStatusDistribution(@Query('range') range?: string) {
    const data =
      await this.sensorAnalyticsService.getWaterLevelStatusDistribution(
        parseRange(range),
      );
    return {
      status: 'success',
      message: 'Water level status distribution fetched successfully',
      data,
    };
  }

  /**
   * GET /sensor-logs/analytics/alerts?range=24h
   *
   * All out-of-range readings across every sensor for the given window.
   * Use for an alerts panel or a bar chart of alert frequency.
   *
   * Query params:
   *   range — 1h | 6h | 24h | 7d | 30d  (default: 24h)
   */
  @Get('analytics/alerts')
  @HttpCode(HttpStatus.OK)
  async getAlertSummary(@Query('range') range?: string) {
    const data = await this.sensorAnalyticsService.getAlertSummary(
      parseRange(range),
    );
    return {
      status: 'success',
      message: 'Alert summary fetched successfully',
      data,
    };
  }
}
