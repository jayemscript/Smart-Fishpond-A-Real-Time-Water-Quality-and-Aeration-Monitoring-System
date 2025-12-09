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

  constructor(private readonly socketService: SocketService) {}

  /**
   * Generate realistic temperature data for fishpond (25-32°C optimal range)
   */
  private generateTemperatureData(): TemperatureData {
    // Generate temperature between 24°C and 33°C
    // Simulate natural fluctuations
    const baseTemp = 28; // Optimal fishpond temperature
    const variation = (Math.random() - 0.5) * 4; // ±2°C variation
    const temperature = parseFloat((baseTemp + variation).toFixed(2));

    return {
      temperature,
      timestamp: new Date(),
      sensorId: 'TEMP_SENSOR_01',
      unit: '°C',
    };
  }

  /**
   * Start sending mock temperature data in real-time
   * @param intervalMs - Interval in milliseconds (default: 3000ms = 3 seconds)
   */
  startTemperatureSimulation(intervalMs = 3000) {
    if (this.isSimulating) {
      this.logger.warn('Temperature simulation is already running');
      return { message: 'Simulation already running' };
    }

    this.isSimulating = true;
    this.logger.log(
      `Starting temperature simulation (interval: ${intervalMs}ms)`,
    );

    // Send initial data immediately
    this.sendTemperatureData();

    // Then send at intervals
    this.simulationInterval = setInterval(() => {
      this.sendTemperatureData();
    }, intervalMs);

    return {
      message: 'Temperature simulation started',
      interval: intervalMs,
    };
  }

  /**
   * Stop the temperature simulation
   */
  stopTemperatureSimulation() {
    if (!this.isSimulating) {
      this.logger.warn('No simulation is currently running');
      return { message: 'No simulation running' };
    }

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }

    this.isSimulating = false;
    this.logger.log('Temperature simulation stopped');

    return { message: 'Temperature simulation stopped' };
  }

  /**
   * Send a single temperature reading via WebSocket
   */
  sendTemperatureData() {
    const data = this.generateTemperatureData();

    this.logger.log(
      `Broadcasting temperature: ${data.temperature}°C at ${data.timestamp.toISOString()}`,
    );

    // Broadcast to all connected WebSocket clients
    this.socketService.broadcast('sensor:temperature', data);

    return data;
  }

  /**
   * Get current simulation status
   */
  getSimulationStatus() {
    return {
      isRunning: this.isSimulating,
      connectedClients: this.socketService.getConnectedClients().length,
    };
  }

  /**
   * Cleanup on service destroy
   */
  onModuleDestroy() {
    this.stopTemperatureSimulation();
  }
}
