import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';
import { SensorLoggerService } from './sensor-logger.service';

export interface PhWaterData {
  phLevel: number;
  timestamp: Date;
  sensorId: string;
  status: string;
}

@Injectable()
export class PhWaterSensorService {
  private readonly logger = new Logger(PhWaterSensorService.name);

  private latestESP32Data: PhWaterData | null = null;
  private broadcastingEnabled = false;

  constructor(
    private readonly socketService: SocketService,
    private readonly sensorLogger: SensorLoggerService, // 👈 injected
  ) {}

  startPhBroadcasting() {
    if (this.broadcastingEnabled) {
      this.logger.warn('pH water broadcasting already running');
      return { message: 'Broadcasting already running' };
    }

    this.broadcastingEnabled = true;
    this.logger.log('Started pH water broadcasting from ESP32');
    return { message: 'pH water broadcasting started' };
  }

  stopPhBroadcasting() {
    if (!this.broadcastingEnabled) {
      this.logger.warn('Broadcasting is already stopped');
      return { message: 'No broadcasting running' };
    }

    this.broadcastingEnabled = false;
    this.logger.log('Stopped pH water broadcasting');
    return { message: 'pH water broadcasting stopped' };
  }

  handlePhWaterESP32(payload: any) {
    const phLevel = payload.data.phLevel;
    let status = 'normal';

    if (phLevel < 6.5) status = 'acidic';
    else if (phLevel > 8.5) status = 'alkaline';

    const data: PhWaterData = {
      phLevel,
      timestamp: new Date(),
      sensorId: payload.data.sensorId,
      status,
    };

    this.latestESP32Data = data;

    if (!this.broadcastingEnabled) {
      this.logger.debug('Received ESP32 pH data but broadcasting stopped');
      return { status: 'broadcasting stopped' };
    }

    this.logger.log(
      `ESP32 pH level: ${data.phLevel} (${data.status}) from ${data.sensorId}`,
    );

    // Broadcast to WebSocket clients
    this.socketService.broadcast('sensor:phWater', data);

    // 👇 Log to DB (buffered — saves every 10 readings or 30s)
    this.sensorLogger.logPh(data);

    return { status: 'received' };
  }

  onModuleDestroy() {
    this.stopPhBroadcasting();
  }
}
