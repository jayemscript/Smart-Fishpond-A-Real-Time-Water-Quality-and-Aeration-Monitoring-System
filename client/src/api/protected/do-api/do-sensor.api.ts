'use client';

import axios from '@/configs/axios-instance-client';
import { handleRequest } from '@/configs/api.helper';
import { DoData } from './do-sensor.interface';

export async function startPhWaterSimulation(): Promise<any> {
  return handleRequest(axios.post('/sensors/do/start'));
}

export async function stopPhWaterSimulation(): Promise<any> {
  return handleRequest(axios.post('/sensors/do/stop'));
}
