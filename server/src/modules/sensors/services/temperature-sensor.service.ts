// src/modules/sensors/services/temperature-sensor.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';

export interface TemperatureData {
  temperature: number;
  timestamp: Date;
  sensorId: string;
  unit: string;
}

@Injectable()
export class TemperatureSensorService {
  private readonly logger = new Logger(TemperatureSensorService.name);
  private simulationInterval: NodeJS.Timeout | null = null;
  private isSimulating = false;

  // Store latest ESP32 data
  private latestESP32Data: TemperatureData | null = null;

  constructor(private readonly socketService: SocketService) {}

  /**
   * Generate realistic temperature data for fishpond (25-32°C optimal range)
   * FOR SIMULATION MODE ONLY
   */
  private generateTemperatureData(): TemperatureData {
    const baseTemp = 28;
    const variation = (Math.random() - 0.5) * 4;
    const temperature = parseFloat((baseTemp + variation).toFixed(2));

    return {
      temperature,
      timestamp: new Date(),
      sensorId: 'TEMP_SENSOR_01',
      unit: '°C',
    };
  }

  /**
   * Start broadcasting temperature data
   * SIMULATION: Generates fake data every interval
   * ESP32 MODE: Just broadcasts the latest ESP32 data every interval
   */
  startTemperatureSimulation(intervalMs = 3000) {
    if (this.isSimulating) {
      this.logger.warn('Temperature broadcasting is already running');
      return { message: 'Broadcasting already running' };
    }

    this.isSimulating = true;
    this.logger.log(
      `Starting temperature broadcasting (interval: ${intervalMs}ms)`,
    );

    this.sendTemperatureData();

    this.simulationInterval = setInterval(() => {
      this.sendTemperatureData();
    }, intervalMs);

    return {
      message: 'Temperature broadcasting started',
      interval: intervalMs,
    };
  }

  /**
   * Stop broadcasting temperature data
   */
  stopTemperatureSimulation() {
    if (!this.isSimulating) {
      this.logger.warn('No broadcasting is currently running');
      return { message: 'No broadcasting running' };
    }

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }

    this.isSimulating = false;
    this.logger.log('Temperature broadcasting stopped');

    return { message: 'Temperature broadcasting stopped' };
  }

  /**
   * Send temperature data via WebSocket
   * SIMULATION MODE: Uses generateTemperatureData()
   * ESP32 MODE: Uses latest ESP32 data (comment out generateTemperatureData line)
   */
  sendTemperatureData() {
    // SIMULATION MODE: Generate fake data
    const data = this.generateTemperatureData();

    // ESP32 MODE: Use real data from ESP32
    // Uncomment these lines and comment out the line above when using ESP32:
    // if (!this.latestESP32Data) return;
    // const data = this.latestESP32Data;

    this.logger.log(
      `Broadcasting temperature: ${data.temperature}°C at ${data.timestamp.toISOString()}`,
    );

    this.socketService.broadcast('sensor:temperature', data);

    return data;
  }

  /**
   * Handle temperature data from ESP32
   * Stores the latest data and broadcasts it immediately
   * FOR ESP32 MODE
   */
  handleTemperatureESP32(payload: any) {
    const data: TemperatureData = {
      temperature: payload.data.temperature,
      timestamp: new Date(),
      sensorId: payload.data.sensorId,
      unit: payload.data.unit,
    };

    // Store latest ESP32 data
    this.latestESP32Data = data;

    this.logger.log(
      `ESP32 temperature: ${data.temperature}°C from ${data.sensorId}`,
    );

    // Broadcast immediately when received from ESP32
    this.socketService.broadcast('sensor:temperature', data);

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
    this.stopTemperatureSimulation();
  }
}
