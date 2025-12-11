// src/modules/sensors/services/ph-water-sensor.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';

export interface PhWaterData {
  phLevel: number;
  timestamp: Date;
  sensorId: string;
  status: string;
}

@Injectable()
export class PhWaterSensorService {
  private readonly logger = new Logger(PhWaterSensorService.name);
  private simulationInterval: NodeJS.Timeout | null = null;
  private isSimulating = false;

  // Store latest ESP32 data
  private latestESP32Data: PhWaterData | null = null;

  constructor(private readonly socketService: SocketService) {}

  /**
   * Generate realistic pH water data for fishpond (6.5-8.5 optimal range)
   * FOR SIMULATION MODE ONLY
   */
  private generatePhWaterData(): PhWaterData {
    const basePh = 7.5;
    const variation = (Math.random() - 0.5) * 2;
    const phLevel = parseFloat((basePh + variation).toFixed(2));

    let status = 'normal';
    if (phLevel < 6.5) {
      status = 'acidic';
    } else if (phLevel > 8.5) {
      status = 'alkaline';
    }

    return {
      phLevel,
      timestamp: new Date(),
      sensorId: 'PH_SENSOR_01',
      status,
    };
  }

  /**
   * Start broadcasting pH water data
   * SIMULATION: Generates fake data every interval
   * ESP32 MODE: Just broadcasts the latest ESP32 data every interval
   */
  startPhWaterSimulation(intervalMs = 3000) {
    if (this.isSimulating) {
      this.logger.warn('pH water broadcasting is already running');
      return { message: 'Broadcasting already running' };
    }

    this.isSimulating = true;
    this.logger.log(
      `Starting pH water broadcasting (interval: ${intervalMs}ms)`,
    );

    this.sendPhWaterData();

    this.simulationInterval = setInterval(() => {
      this.sendPhWaterData();
    }, intervalMs);

    return {
      message: 'pH water broadcasting started',
      interval: intervalMs,
    };
  }

  /**
   * Stop broadcasting pH water data
   */
  stopPhWaterSimulation() {
    if (!this.isSimulating) {
      this.logger.warn('No broadcasting is currently running');
      return { message: 'No broadcasting running' };
    }

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }

    this.isSimulating = false;
    this.logger.log('pH water broadcasting stopped');

    return { message: 'pH water broadcasting stopped' };
  }

  /**
   * Send pH water data via WebSocket
   * SIMULATION MODE: Uses generatePhWaterData()
   * ESP32 MODE: Uses latest ESP32 data (comment out generatePhWaterData line)
   */
  sendPhWaterData() {
    // SIMULATION MODE: Generate fake data
    const data = this.generatePhWaterData();

    // ESP32 MODE: Use real data from ESP32
    // Uncomment these lines and comment out the line above when using ESP32:
    // if (!this.latestESP32Data) return;
    // const data = this.latestESP32Data;

    this.logger.log(
      `Broadcasting pH level: ${data.phLevel} (${data.status}) at ${data.timestamp.toISOString()}`,
    );

    this.socketService.broadcast('sensor:phWater', data);

    return data;
  }

  /**
   * Handle pH water data from ESP32
   * Stores the latest data and broadcasts it immediately
   * FOR ESP32 MODE
   */
  handlePhWaterESP32(payload: any) {
    let status = 'normal';
    const phLevel = payload.data.phLevel;
    
    if (phLevel < 6.5) {
      status = 'acidic';
    } else if (phLevel > 8.5) {
      status = 'alkaline';
    }

    const data: PhWaterData = {
      phLevel: payload.data.phLevel,
      timestamp: new Date(),
      sensorId: payload.data.sensorId,
      status,
    };

    // Store latest ESP32 data
    this.latestESP32Data = data;

    this.logger.log(
      `ESP32 pH level: ${data.phLevel} (${data.status}) from ${data.sensorId}`,
    );

    // Broadcast immediately when received from ESP32
    this.socketService.broadcast('sensor:phWater', data);

    return { status: 'received' };
  }

  /**
   * Cleanup on service destroy
   */
  onModuleDestroy() {
    this.stopPhWaterSimulation();
  }
}