// src/modules/sensors/sensors.module.ts

import { Module } from '@nestjs/common';
import { TemperatureSensorService } from './services/temperature-sensor.service';
import { TurbiditySensorService } from './services/turbidity-sensor.service';
import { SensorsController } from './controllers/sensors.controller';
import { SocketModule } from '../sockets/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [SensorsController],
  providers: [TemperatureSensorService, TurbiditySensorService],
  exports: [TemperatureSensorService, TurbiditySensorService],
})
export class SensorsModule {}
