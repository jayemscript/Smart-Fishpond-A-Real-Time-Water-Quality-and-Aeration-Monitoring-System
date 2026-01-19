import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';

export interface WaterLevelData {
  level: string;
  timestamp: Date;
  sensorId: string;
  status: string;
}

@Injectable()
export class WaterLevelSensorService {
  private readonly logger = new Logger(WaterLevelSensorService.name);

  //Store latest ESP32 data
  private latestESP32Data: WaterLevelData | null = null;

  //Control broadcasting
  private broadcastingEnabled = false;

  constructor(private readonly socketService: SocketService) {}

  /**
   * Start broadcasting water level data from ESP32
   */

  startWaterlevelBroadcasting() {
    if (this.broadcastingEnabled) {
      this.logger.warn('Water broadcasting is already running');
      return { message: 'Broadcasting already running' };
    }

    this.broadcastingEnabled = true;
    this.logger.log('Started water level broadcasting from ESP32');
    return { message: 'Water level broadcasting started' };
  }

  /**
   * Stop broadcasting water level data
   */
  stopWaterlevelBroadcastng() {
    if (!this.broadcastingEnabled) {
      this.logger.warn('Water broadcasting is already stopped');
      return { message: 'No broadcasting running' };
    }

    this.broadcastingEnabled = false;
    this.logger.log('Stopped water level broadcasting');
    return { message: 'Water level broadcasting stopped' };
  }

  /**
   * Handle water level data from ESP32
   * Stores the latest data and broadcasts immediately
   */
  handleWaterLevelESP32(payload: any) {
    const data: WaterLevelData = {
      level: payload.data.level,
      timestamp: new Date(),
      sensorId: payload.data.sensorId,
      status: payload.data.status,
    };

    // Store latest ESP32 data
    this.latestESP32Data = data;
    if (!this.broadcastingEnabled) {
      this.logger.debug('Received ESP32 data but broadcasting is stopped');
      return { status: 'broadcasting stopped' };
    }

    this.logger.log(`ESP32 water level: ${data.level} from ${data.sensorId}`);

    // Broadcast immediately
    this.socketService.broadcast('sensor:level', data);
    return { status: 'received' };
  }

  /**
   * Cleanup on service destroy
   */
  onModuleDestroy() {
    this.stopWaterlevelBroadcastng();
  }
}
