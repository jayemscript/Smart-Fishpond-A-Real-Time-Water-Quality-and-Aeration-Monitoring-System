import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DissolvedOxygenRecords } from '../entities/do.entity';
import { PhLevelRecords } from '../entities/ph-level.entity';
import { TemperatureRecord } from '../entities/temperature.entity';
import { WaterLevelRecords } from '../entities/water-level.entity';

import { PaginationService } from 'src/utils/services/pagination.service';

@Injectable()
export class SensorLogsService {
  constructor(
    @InjectRepository(DissolvedOxygenRecords)
    private readonly doRepository: Repository<DissolvedOxygenRecords>,
    @InjectRepository(PhLevelRecords)
    private readonly phlevelRepository: Repository<PhLevelRecords>,
    @InjectRepository(TemperatureRecord)
    private readonly tempRepository: Repository<TemperatureRecord>,
    @InjectRepository(WaterLevelRecords)
    private readonly waterLevelRepository: Repository<WaterLevelRecords>,

    private readonly DoPagination: PaginationService<DissolvedOxygenRecords>,
    private readonly PhLevelPagination: PaginationService<PhLevelRecords>,
    private readonly TempPagination: PaginationService<TemperatureRecord>,
    private readonly WaterLevelPagination: PaginationService<WaterLevelRecords>,
  ) {}

  async getAllPaginatedDo(
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: string | Record<string, any> | Record<string, any>[],
  ) {
    let parsedFilters: Record<string, any> | Record<string, any>[] = {};

    if (filters) {
      if (typeof filters === 'string') {
        try {
          parsedFilters = JSON.parse(filters);
        } catch (err) {
          throw new BadRequestException(
            `Invalid JSON or Invalid variable type in 'filters': ${err.message}`,
          );
        }
      } else {
        parsedFilters = filters;
      }
    }

    return this.DoPagination.paginate(
      this.doRepository,
      'dissolved_oxygen_records',
      {
        page: page || 1,
        limit: limit || 10,
        keyword: keyword || '',
        searchableFields: ['createdAt'],
        sortableFields: ['createdAt'],
        sortBy: (sortBy?.trim() as keyof DissolvedOxygenRecords) || 'createdAt',
        sortOrder: sortOrder || 'desc',
        dataKey: 'do_data',
        relations: [],
        filters: parsedFilters,
        withDeleted: true,
      },
    );
  }

  async getAllPaginatedPh(
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: string | Record<string, any> | Record<string, any>[],
  ) {
    let parsedFilters: Record<string, any> | Record<string, any>[] = {};

    if (filters) {
      if (typeof filters === 'string') {
        try {
          parsedFilters = JSON.parse(filters);
        } catch (err) {
          throw new BadRequestException(
            `Invalid JSON or Invalid variable type in 'filters': ${err.message}`,
          );
        }
      } else {
        parsedFilters = filters;
      }
    }

    return this.PhLevelPagination.paginate(
      this.phlevelRepository,
      'ph_level_records',
      {
        page: page || 1,
        limit: limit || 10,
        keyword: keyword || '',
        searchableFields: ['createdAt'],
        sortableFields: ['createdAt'],
        sortBy: (sortBy?.trim() as keyof PhLevelRecords) || 'createdAt',
        sortOrder: sortOrder || 'desc',
        dataKey: 'ph_data',
        relations: [],
        filters: parsedFilters,
        withDeleted: true,
      },
    );
  }

  async getAllPaginatedTemp(
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: string | Record<string, any> | Record<string, any>[],
  ) {
    let parsedFilters: Record<string, any> | Record<string, any>[] = {};

    if (filters) {
      if (typeof filters === 'string') {
        try {
          parsedFilters = JSON.parse(filters);
        } catch (err) {
          throw new BadRequestException(
            `Invalid JSON or Invalid variable type in 'filters': ${err.message}`,
          );
        }
      } else {
        parsedFilters = filters;
      }
    }

    return this.TempPagination.paginate(
      this.tempRepository,
      'temperature_records',
      {
        page: page || 1,
        limit: limit || 10,
        keyword: keyword || '',
        searchableFields: ['createdAt'],
        sortableFields: ['createdAt'],
        sortBy: (sortBy?.trim() as keyof TemperatureRecord) || 'createdAt',
        sortOrder: sortOrder || 'desc',
        dataKey: 'temp_data',
        relations: [],
        filters: parsedFilters,
        withDeleted: true,
      },
    );
  }

  async getAllPaginatedWaterLevel(
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: string | Record<string, any> | Record<string, any>[],
  ) {
    let parsedFilters: Record<string, any> | Record<string, any>[] = {};

    if (filters) {
      if (typeof filters === 'string') {
        try {
          parsedFilters = JSON.parse(filters);
        } catch (err) {
          throw new BadRequestException(
            `Invalid JSON or Invalid variable type in 'filters': ${err.message}`,
          );
        }
      } else {
        parsedFilters = filters;
      }
    }

    return this.WaterLevelPagination.paginate(
      this.waterLevelRepository,
      'water_level_records',
      {
        page: page || 1,
        limit: limit || 10,
        keyword: keyword || '',
        searchableFields: ['createdAt'],
        sortableFields: ['createdAt'],
        sortBy: (sortBy?.trim() as keyof WaterLevelRecords) || 'createdAt',
        sortOrder: sortOrder || 'desc',
        dataKey: 'water_level_data',
        relations: [],
        filters: parsedFilters,
        withDeleted: true,
      },
    );
  }
}
