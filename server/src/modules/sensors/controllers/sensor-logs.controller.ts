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

@UseGuards(JwtAuthGuard, SessionGuard)
@Controller('sensor-logs')
export class SensorLogsController {
  constructor(private readonly sensorLogsService: SensorLogsService) {}

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
      message: 'Data Fetch fetched successfully',
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
      message: 'Data Fetch fetched successfully',
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
      message: 'Data Fetch fetched successfully',
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
      message: 'Data Fetch fetched successfully',
      ...result,
    };
  }
}
