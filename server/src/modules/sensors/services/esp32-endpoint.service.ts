import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from 'src/modules/sockets/socket.service';

export interface ESP32Client {
  deviceId: string;
  socketId: string;
  connectedAt: Date;
  lastSeen: Date;
}

@Injectable()
export class ESP32EndpointService {
  private readonly logger = new Logger(ESP32EndpointService.name);

  // Map deviceId -> ESP32Client
  private connectedDevices: Map<string, ESP32Client> = new Map();

  constructor(private readonly socketService: SocketService) {}

  // Register or update device on every connection
  registerDevice(deviceId: string, socketId: string) {
    const now = new Date();
    const existing = this.connectedDevices.get(deviceId);
    if (existing && existing.socketId !== socketId) {
      this.logger.log(`ESP32 reconnected, updating socketId: ${deviceId}`);
    }

    this.connectedDevices.set(deviceId, {
      deviceId,
      socketId,
      connectedAt: existing?.connectedAt || now,
      lastSeen: now,
    });

    this.logger.log(`ESP32 registered: ${deviceId}`);
  }

  removeDeviceBySocket(socketId: string) {
    for (const [deviceId, device] of this.connectedDevices.entries()) {
      if (device.socketId === socketId) {
        this.connectedDevices.delete(deviceId);
        this.logger.log(`ESP32 disconnected: ${deviceId}`);
        break;
      }
    }
  }

  updateLastSeen(deviceId: string) {
    const device = this.connectedDevices.get(deviceId);
    if (device) device.lastSeen = new Date();
  }

  verifyDevice(deviceId: string) {
    const device = this.connectedDevices.get(deviceId);
    return { connected: !!device };
  }

  async testHandshake(deviceId: string, data: any) {
    const device = this.connectedDevices.get(deviceId);
    if (!device) {
      return { success: false, message: 'ESP32 not connected' };
    }

    // send handshake
    this.socketService.sendToClient(device.socketId, 'handshake', {
      message: 'Hello from server!',
      data,
    });

    return { success: true, message: 'Handshake sent', deviceId };
  }

  getInfo(deviceId?: string) {
    if (deviceId) {
      const device = this.connectedDevices.get(deviceId);
      return device ? { success: true, device } : { success: false, message: 'ESP32 not found' };
    }

    return {
      success: true,
      totalDevices: this.connectedDevices.size,
      devices: Array.from(this.connectedDevices.values()),
    };
  }
}
