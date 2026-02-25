import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';

export interface WaterLevelData {
  level: number; // 0 or 1 from ESP32
  timestamp: Date;
  sensorId: string;
  status: 'low' | 'stable';
}

@Injectable()
export class WaterLevelSensorService {
  private readonly logger = new Logger(WaterLevelSensorService.name);

  private latestESP32Data: WaterLevelData | null = null;
  private broadcastingEnabled = false;

  constructor(private readonly socketService: SocketService) {}

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

    this.socketService.broadcast('sensor:water-level', data);

    return { status: 'received' };
  }

  onModuleDestroy() {
    this.stopWaterlevelBroadcastng();
  }
}
