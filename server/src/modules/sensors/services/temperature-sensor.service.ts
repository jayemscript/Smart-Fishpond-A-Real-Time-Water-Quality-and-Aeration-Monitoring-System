import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';
import { SensorLoggerService } from './sensor-logger.service';

export interface TemperatureData {
  temperature: number;
  timestamp: Date;
  sensorId: string;
  unit: string;
}

@Injectable()
export class TemperatureSensorService {
  private readonly logger = new Logger(TemperatureSensorService.name);

  private latestESP32Data: TemperatureData | null = null;
  private broadcastingEnabled = false;

  constructor(
    private readonly socketService: SocketService,
    private readonly sensorLogger: SensorLoggerService, // 👈 injected
  ) {}

  startTemperatureBroadcasting() {
    if (this.broadcastingEnabled) {
      this.logger.warn('Temperature broadcasting is already running');
      return { message: 'Broadcasting already running' };
    }

    this.broadcastingEnabled = true;
    this.logger.log('Started temperature broadcasting from ESP32');
    return { message: 'Temperature broadcasting started' };
  }

  stopTemperatureBroadcasting() {
    if (!this.broadcastingEnabled) {
      this.logger.warn('Temperature broadcasting is already stopped');
      return { message: 'No broadcasting running' };
    }

    this.broadcastingEnabled = false;
    this.logger.log('Stopped temperature broadcasting');
    return { message: 'Temperature broadcasting stopped' };
  }

  handleTemperatureESP32(payload: any) {
    const data: TemperatureData = {
      temperature: payload.data.temperature,
      timestamp: new Date(),
      sensorId: payload.data.sensorId,
      unit: payload.data.unit,
    };

    this.latestESP32Data = data;

    if (!this.broadcastingEnabled) {
      this.logger.debug('Received ESP32 data but broadcasting is stopped');
      return { status: 'broadcasting stopped' };
    }

    this.logger.log(
      `ESP32 temperature: ${data.temperature}°C from ${data.sensorId}`,
    );

    // Broadcast to WebSocket clients
    this.socketService.broadcast('sensor:temperature', data);

    // 👇 Log to DB (buffered — saves every 10 readings or 30s)
    this.sensorLogger.logTemperature(data);

    return { status: 'received' };
  }

  onModuleDestroy() {
    this.stopTemperatureBroadcasting();
  }
}
