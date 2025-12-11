// src/modules/sensors/sensors.module.ts

import { Module } from '@nestjs/common';
import { TemperatureSensorService } from './services/temperature-sensor.service';
import { TurbiditySensorService } from './services/turbidity-sensor.service';
import { PhWaterSensorService } from './services/ph-water-sensor.service';
import { SensorsController } from './controllers/sensors.controller';
import { SocketModule } from '../sockets/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [SensorsController],
  providers: [
    TemperatureSensorService,
    TurbiditySensorService,
    PhWaterSensorService,
  ],
  exports: [
    TemperatureSensorService,
    TurbiditySensorService,
    PhWaterSensorService,
  ],
})
export class SensorsModule {}
