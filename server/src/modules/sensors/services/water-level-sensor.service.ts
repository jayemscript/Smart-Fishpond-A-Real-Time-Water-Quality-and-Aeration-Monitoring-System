import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';
import { SensorLoggerService } from './sensor-logger.service';

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
    private readonly sensorLogger: SensorLoggerService, // 👈 injected
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

    if (!this.broadcastingEnabled) {
      return { status: 'broadcasting stopped' };
    }

    this.logger.log(
      `Water Level: ${data.status.toUpperCase()} (${data.level})`,
    );

    // Broadcast to WebSocket clients
    this.socketService.broadcast('sensor:water-level', data);

    // 👇 Log to DB (buffered — saves every 10 readings or 30s)
    this.sensorLogger.logWaterLevel(data);

    return { status: 'received' };
  }

  onModuleDestroy() {
    this.stopWaterlevelBroadcastng();
  }
}
