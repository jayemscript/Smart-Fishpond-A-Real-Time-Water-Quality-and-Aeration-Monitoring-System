import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { UsersSocketService } from './users/users.socket.service';
import { NotificationsSocketService } from './notifications/notifications.socket.service';
import { TemperatureSensorService } from 'src/modules/sensors/services/temperature-sensor.service';

@Module({
  providers: [
    SocketGateway,
    SocketService,
    UsersSocketService,
    NotificationsSocketService,
    TemperatureSensorService,
  ],
  exports: [
    SocketService,
    UsersSocketService,
    NotificationsSocketService,
    TemperatureSensorService,
  ],
})
export class SocketModule {}
