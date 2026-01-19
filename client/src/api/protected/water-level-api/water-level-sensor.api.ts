'use client';

import axios from '@/configs/axios-instance-client';
import { WaterLevelData } from './water-level-sensor.interface';
import { handleRequest } from '@/configs/api.helper';

export async function startWaterLevel(): Promise<any> {
  return handleRequest(axios.post('/sensors/water-level/start'));
}

export async function stopWaterLevel(): Promise<any> {
  return handleRequest(axios.post('/sensors/water-level/stop'));
}
