// src/modules/sensors/services/turbidity-sensor.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';

export interface TurbidityData {
  turbidity: number;
  timestamp: Date;
  sensorId: string;
  unit: string;
}

@Injectable()
export class TurbiditySensorService {
  private readonly logger = new Logger(TurbiditySensorService.name);
  private simulationInterval: NodeJS.Timeout | null = null;
  private isSimulating = false;

  // Store latest ESP32 data
  private latestESP32Data: TurbidityData | null = null;

  constructor(private readonly socketService: SocketService) {}

  /**
   * Generate realistic turbidity data for fishpond (0-50 NTU optimal range)
   * FOR SIMULATION MODE ONLY
   */
  private generateTurbidityData(): TurbidityData {
    const baseNTU = 20;
    const variation = (Math.random() - 0.5) * 15;
    const turbidity = parseFloat(Math.max(0, baseNTU + variation).toFixed(2));

    return {
      turbidity,
      timestamp: new Date(),
      sensorId: 'TURBIDITY_SENSOR_01',
      unit: 'NTU',
    };
  }

  /**
   * Start broadcasting turbidity data
   * SIMULATION: Generates fake data every interval
   * ESP32 MODE: Just broadcasts the latest ESP32 data every interval
   */
  startTurbiditySimulation(intervalMs = 3000) {
    if (this.isSimulating) {
      this.logger.warn('Turbidity broadcasting is already running');
      return { message: 'Broadcasting already running' };
    }

    this.isSimulating = true;
    this.logger.log(
      `Starting turbidity broadcasting (interval: ${intervalMs}ms)`,
    );

    this.sendTurbidityData();

    this.simulationInterval = setInterval(() => {
      this.sendTurbidityData();
    }, intervalMs);

    return {
      message: 'Turbidity broadcasting started',
      interval: intervalMs,
    };
  }

  /**
   * Stop broadcasting turbidity data
   */
  stopTurbiditySimulation() {
    if (!this.isSimulating) {
      this.logger.warn('No broadcasting is currently running');
      return { message: 'No broadcasting running' };
    }

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }

    this.isSimulating = false;
    this.logger.log('Turbidity broadcasting stopped');

    return { message: 'Turbidity broadcasting stopped' };
  }

  /**
   * Send turbidity data via WebSocket
   * SIMULATION MODE: Uses generateTurbidityData()
   * ESP32 MODE: Uses latest ESP32 data (comment out generateTurbidityData line)
   */
  sendTurbidityData() {
    // SIMULATION MODE: Generate fake data
    const data = this.generateTurbidityData();

    // ESP32 MODE: Use real data from ESP32
    // Uncomment these lines and comment out the line above when using ESP32:
    // if (!this.latestESP32Data) return;
    // const data = this.latestESP32Data;

    this.logger.log(
      `Broadcasting turbidity: ${data.turbidity} NTU at ${data.timestamp.toISOString()}`,
    );

    this.socketService.broadcast('sensor:turbidity', data);

    return data;
  }

  /**
   * Handle turbidity data from ESP32
   * Stores the latest data and broadcasts it immediately
   * FOR ESP32 MODE
   */
  handleTurbidityESP32(payload: any) {
    const data: TurbidityData = {
      turbidity: payload.data.turbidity,
      timestamp: new Date(),
      sensorId: payload.data.sensorId,
      unit: payload.data.unit,
    };

    // Store latest ESP32 data
    this.latestESP32Data = data;

    this.logger.log(
      `ESP32 turbidity: ${data.turbidity} NTU from ${data.sensorId}`,
    );

    // Broadcast immediately when received from ESP32
    this.socketService.broadcast('sensor:turbidity', data);

    return { status: 'received' };
  }

  /**
   * Get current status
   */
  getSimulationStatus() {
    return {
      isRunning: this.isSimulating,
      connectedClients: this.socketService.getConnectedClients().length,
      mode: this.latestESP32Data ? 'ESP32' : 'Simulation',
    };
  }

  /**
   * Cleanup on service destroy
   */
  onModuleDestroy() {
    this.stopTurbiditySimulation();
  }
}
