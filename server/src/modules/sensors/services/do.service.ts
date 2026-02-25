import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';

export interface DoData {
  oxygenLevel: number;
  unit: string;
  timestamp: Date;
  sensorId: string;
}

@Injectable()
export class DissolvedOxygenSensorService {
  private readonly logger = new Logger(DissolvedOxygenSensorService.name);

  //Store latest ESP32 data
  private latestESP32Data: DoData | null = null;

  //contro broadcasting
  private broadcastingEnabled = false;

  constructor(private readonly socketService: SocketService) {}

  /**
   * Start broadcasting Do Data from ESP32
   */
  startDoBroadcasting() {
    if (this.broadcastingEnabled) {
      this.logger.warn('Dissolved Oxygen broadcasting is already running');
      return { message: 'Broadcasting already running' };
    }

    this.broadcastingEnabled = true;
    this.logger.log('Started Dissolved Oxygen broadcasting from ESP32');
    return { message: 'Dissolved Oxygen broadcasting started' };
  }

  /**
   * Stop broadcasting Dissolved Oxygen Data
   */
  stopDoBroadcasting() {
    if (!this.broadcastingEnabled) {
      this.logger.warn('Dissolved Oxygen broadcasting is already stopped');
      return { message: 'No Broadcasting running' };
    }

    this.broadcastingEnabled = false;
    this.logger.log('Stopped Dissolved Oxygen broadcasting');
    return { message: 'Dissovled Oxygen broadcasting stopped' };
  }

  /**
   * Handle Dissolved data from ESP32
   * store the latest data and broadcast immediately
   */
  handleDissolvedOxygenESP32(payload: any) {
    const data: DoData = {
      oxygenLevel: payload.data.oxygenLevel,
      timestamp: new Date(),
      sensorId: payload.data.sensorId,
      unit: payload.data.unit,
    };

    //Store latest ESP32 data
    this.latestESP32Data = data;

    if (!this.broadcastingEnabled) {
      this.logger.debug('Received ESP32 data but but broadcasting');
      return { status: 'broadcasting stopped' };
    }
    this.logger
      .log(`ESP32 dissolved: ${data.oxygenLevel}mg/L from ${data.sensorId}      
      `);

    //Broadcast immediately
    this.socketService.broadcast('sensor:dissolvedOxygen', data);

    return { status: 'recevied' };
  }

  /**
   * Cleanup on service destroy
   */

  onModuleDestroy() {
    this.stopDoBroadcasting();
  }
}
