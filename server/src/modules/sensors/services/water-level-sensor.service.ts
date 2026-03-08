import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';
import { SensorLoggerService } from './sensor-logger.service';
import { SensorAlertService } from './sensor-alert.service';

export interface WaterLevelData {
  level: number;
  timestamp: Date;
  sensorId: string;
  status: 'low' | 'stable';
}

@Injectable()
export class WaterLevelSensorService {
  private readonly logger = new Logger(WaterLevelSensorService.name);

  private latestESP32Data: WaterLevelData | null = null;
  private broadcastingEnabled = false;

  constructor(
    private readonly socketService: SocketService,
    private readonly sensorLogger: SensorLoggerService,
    private readonly sensorAlert: SensorAlertService,
  ) {}

  startWaterlevelBroadcasting() {
    if (this.broadcastingEnabled) {
      return { message: 'Broadcasting already running' };
    }

    this.broadcastingEnabled = true;
    this.logger.log('Started water level broadcasting');
    return { message: 'Water level monitoring started' };
  }

  stopWaterlevelBroadcastng() {
    if (!this.broadcastingEnabled) {
      return { message: 'No broadcasting running' };
    }

    this.broadcastingEnabled = false;
    this.logger.log('Stopped water level broadcasting');
    return { message: 'Water level monitoring stopped' };
  }

  handleWaterLevelESP32(payload: any) {
    const level = Number(payload.data.level);

    const data: WaterLevelData = {
      level,
      timestamp: new Date(),
      sensorId: payload.data.sensorId,
      status: level === 1 ? 'stable' : 'low',
    };

    this.latestESP32Data = data;
    this.sensorAlert.evaluateWaterLevel(data);

    if (!this.broadcastingEnabled) {
      return { status: 'broadcasting stopped' };
    }

    this.logger.log(
      `Water Level: ${data.status.toUpperCase()} (${data.level})`,
    );

    // Broadcast to WebSocket clients
    this.socketService.broadcast('sensor:water-level', data);

    this.sensorLogger.logWaterLevel(data);

    return { status: 'received' };
  }

  onModuleDestroy() {
    this.stopWaterlevelBroadcastng();
  }
}
