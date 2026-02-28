'use client';
import axios from '@/configs/axios-instance-client';
import { handleRequest } from '@/configs/api.helper';
import { GetAllPaginatedParams } from '@/interfaces/shared-api.interface';
import {
  DoData,
  PhData,
  TempData,
  WaterLevelData,
} from './sensor-interface.api';

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
