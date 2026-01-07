import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { UsersSocketService } from './users/users.socket.service';
import { NotificationsSocketService } from './notifications/notifications.socket.service';
import { ESP32EndpointService } from '../sensors/services/esp32-endpoint.service';
@Module({
  providers: [
    SocketGateway,
    SocketService,
    UsersSocketService,
    NotificationsSocketService,
    ESP32EndpointService,
  ],
  exports: [
    SocketService,
    UsersSocketService,
    NotificationsSocketService,
    ESP32EndpointService,
  ],
})
export class SocketModule {}
