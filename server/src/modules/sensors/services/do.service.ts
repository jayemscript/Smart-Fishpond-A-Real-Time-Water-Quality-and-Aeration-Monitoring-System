import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';
import { SensorLoggerService } from './sensor-logger.service';

export interface DoData {
  oxygenLevel: number;
  unit: string;
  timestamp: Date;
  sensorId: string;
}

@Injectable()
export class DissolvedOxygenSensorService {
  private readonly logger = new Logger(DissolvedOxygenSensorService.name);

  private latestESP32Data: DoData | null = null;
  private broadcastingEnabled = false;

  constructor(
    private readonly socketService: SocketService,
    private readonly sensorLogger: SensorLoggerService, // 👈 injected
  ) {}

  startDoBroadcasting() {
    if (this.broadcastingEnabled) {
      this.logger.warn('Dissolved Oxygen broadcasting is already running');
      return { message: 'Broadcasting already running' };
    }

    this.broadcastingEnabled = true;
    this.logger.log('Started Dissolved Oxygen broadcasting from ESP32');
    return { message: 'Dissolved Oxygen broadcasting started' };
  }

  stopDoBroadcasting() {
    if (!this.broadcastingEnabled) {
      this.logger.warn('Dissolved Oxygen broadcasting is already stopped');
      return { message: 'No Broadcasting running' };
    }

    this.broadcastingEnabled = false;
    this.logger.log('Stopped Dissolved Oxygen broadcasting');
    return { message: 'Dissolved Oxygen broadcasting stopped' };
  }

  handleDissolvedOxygenESP32(payload: any) {
    const data: DoData = {
      oxygenLevel: payload.data.oxygenLevel,
      timestamp: new Date(),
      sensorId: payload.data.sensorId,
      unit: payload.data.unit,
    };

    this.latestESP32Data = data;

    if (!this.broadcastingEnabled) {
      this.logger.debug('Received ESP32 data but broadcasting stopped');
      return { status: 'broadcasting stopped' };
    }

    this.logger.log(
      `ESP32 dissolved: ${data.oxygenLevel}mg/L from ${data.sensorId}`,
    );

    // Broadcast to WebSocket clients
    this.socketService.broadcast('sensor:dissolvedOxygen', data);

    // 👇 Log to DB (buffered — saves every 10 readings or 30s)
    this.sensorLogger.logDo(data);

    return { status: 'received' };
  }

  onModuleDestroy() {
    this.stopDoBroadcasting();
  }
}
