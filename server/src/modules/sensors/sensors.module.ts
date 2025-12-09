// src/modules/sensors/sensors.module.ts

import { Module } from '@nestjs/common';
import { TemperatureSensorService } from './services/temperature-sensor.service';
import { SensorsController } from './controllers/sensors.controller';
import { SocketModule } from '../sockets/socket.module'; // Import SocketModule

@Module({
  imports: [SocketModule], // Import to use SocketService
  controllers: [SensorsController],
  providers: [TemperatureSensorService],
  exports: [TemperatureSensorService], // Export if other modules need it
})
export class SensorsModule {}
