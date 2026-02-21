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

  // Store latest ESP32 data
  private latestESP32Data: TemperatureData | null = null;

  // Control broadcasting
  private broadcastingEnabled = false;

  constructor(private readonly socketService: SocketService) {}

  /**
   * Start broadcasting temperature data from ESP32
   */
  startTemperatureBroadcasting() {
    if (this.broadcastingEnabled) {
      this.logger.warn('Temperature broadcasting is already running');
      return { message: 'Broadcasting already running' };
    }

    this.broadcastingEnabled = true;
    this.logger.log('Started temperature broadcasting from ESP32');
    return { message: 'Temperature broadcasting started' };
  }

  /**
   * Stop broadcasting temperature data
   */
  stopTemperatureBroadcasting() {
    if (!this.broadcastingEnabled) {
      this.logger.warn('Temperature broadcasting is already stopped');
      return { message: 'No broadcasting running' };
    }

    this.broadcastingEnabled = false;
    this.logger.log('Stopped temperature broadcasting');
    return { message: 'Temperature broadcasting stopped' };
  }

  /**
   * Handle temperature data from ESP32
   * Stores the latest data and broadcasts immediately
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

    if (!this.broadcastingEnabled) {
      this.logger.debug('Received ESP32 data but broadcasting is stopped');
      return { status: 'broadcasting stopped' };
    }

    this.logger.log(`ESP32 temperature: ${data.temperature}°C from ${data.sensorId}`);

    // Broadcast immediately
    this.socketService.broadcast('sensor:temperature', data);

    return { status: 'received' };
  }

  /**
   * Cleanup on service destroy
   */
  onModuleDestroy() {
    this.stopTemperatureBroadcasting();
  }
}
