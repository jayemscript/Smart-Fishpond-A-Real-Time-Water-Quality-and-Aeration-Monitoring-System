'use client';

import axios from '@/configs/axios-instance-client';
import { handleRequest } from '@/configs/api.helper';
import { TurbidityData } from './turbidity-sensor.interface';

export async function startTurbiditySimulation(): Promise<any> {
  return handleRequest(axios.post('/sensors/turbidity/start'));
}

export async function stopTurbiditySimulation(): Promise<any> {
  return handleRequest(axios.post('/sensors/turbidity/stop'));
}


