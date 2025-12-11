'use client';

import axios from '@/configs/axios-instance-client';
import { handleRequest } from '@/configs/api.helper';
import { PhWaterData } from './ph-water-sensor.interface';

export async function startPhWaterSimulation(): Promise<any> {
  return handleRequest(axios.post('/sensors/ph-water/start'));
}

export async function stopPhWaterSimulation(): Promise<any> {
  return handleRequest(axios.post('/sensors/ph-water/stop'));
}
