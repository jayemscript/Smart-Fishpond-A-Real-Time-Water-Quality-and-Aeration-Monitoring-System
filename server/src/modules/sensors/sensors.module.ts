// src/modules/sensors/sensors.module.ts

import { Module } from '@nestjs/common';
import { TemperatureSensorService } from './services/temperature-sensor.service';
import { TurbiditySensorService } from './services/turbidity-sensor.service';
import { PhWaterSensorService } from './services/ph-water-sensor.service';
import { SensorsController } from './controllers/sensors.controller';
import {Esp32Controller} from './controllers/esp-32.controller'
import { SocketModule } from '../sockets/socket.module';
import {ESP32EndpointService} from './services/esp32-endpoint.service'

@Module({
  imports: [SocketModule],
  controllers: [SensorsController, Esp32Controller],
  providers: [
    TemperatureSensorService,
    TurbiditySensorService,
    PhWaterSensorService,
    ESP32EndpointService
  ],
  exports: [
    TemperatureSensorService,
    TurbiditySensorService,
    PhWaterSensorService,
    ESP32EndpointService
  ],
})
export class SensorsModule {}
