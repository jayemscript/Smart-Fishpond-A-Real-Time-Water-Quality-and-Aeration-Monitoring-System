// src/modules/sockets/socket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { SocketService } from './socket.service';
import { UsersSocketService } from './users/users.socket.service';
import { ModularSocketService } from './interfaces/modular-socket.service.interface';
import { NotificationsSocketService } from './notifications/notifications.socket.service';
import { TemperatureSensorService } from 'src/modules/sensors/services/temperature-sensor.service';

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  private domainServices: ModularSocketService[] = [];

  constructor(
    private readonly socketService: SocketService,
    private readonly usersSocketService: UsersSocketService,
    private readonly notificationSocketService: NotificationsSocketService,
    private readonly temperatureSensorService: TemperatureSensorService,
  ) {
    this.domainServices = [usersSocketService];
  }

  @SubscribeMessage('sensor:temperature')
  handleTemperature(@MessageBody() payload: any) {
    return this.temperatureSensorService.handleTemperatureESP32(payload);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.socketService.addClient(client);

    this.domainServices.forEach((service) => {
      service.handleConnection?.(client);
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.socketService.removeClient(client.id);

    this.domainServices.forEach((service) => {
      service.handleDisconnect?.(client.id);
    });
  }
}
