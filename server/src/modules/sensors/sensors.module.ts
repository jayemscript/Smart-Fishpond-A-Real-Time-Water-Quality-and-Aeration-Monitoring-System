// src/modules/sensors/sensors.module.ts

import { Module } from '@nestjs/common';
import { SensorsService } from './services/sensors.service';
import { SensorsController } from './controllers/sensors.controller';
import { SocketModule } from '../sockets/socket.module'; // Import SocketModule

@Module({
  imports: [SocketModule], // Import to use SocketService
  controllers: [SensorsController],
  providers: [SensorsService],
  exports: [SensorsService], // Export if other modules need it
})
export class SensorsModule {}
