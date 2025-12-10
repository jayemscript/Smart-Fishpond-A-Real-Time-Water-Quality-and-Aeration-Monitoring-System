// src/modules/sensors/controllers/sensors.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  TemperatureSensorService,
  TemperatureData,
} from '../services/temperature-sensor.service';
import { TurbiditySensorService } from '../services/turbidity-sensor.service';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';

@Controller('sensors')
export class SensorsController {
  constructor(
    private readonly temperatureSensorService: TemperatureSensorService,
    private readonly turbiditySensorService: TurbiditySensorService,
  ) {}

  /**
   * POST /sensors/temperature/start
   * Start continuous temperature simulation
   * Test in Postman: POST http://localhost:3000/sensors/temperature/start
   */
  @Post('temperature/start')
  startTemperatureSimulation() {
    return this.temperatureSensorService.startTemperatureSimulation();
  }

  /**
   * POST /sensors/temperature/stop
   * Stop temperature simulation
   * Test in Postman: POST http://localhost:3000/sensors/temperature/stop
   */
  @Post('temperature/stop')
  stopTemperatureSimulation() {
    return this.temperatureSensorService.stopTemperatureSimulation();
  }

  /**
   * POST /sensors/turbidity/start
   * Start continious turbidity simulation
   *
   */
  @Post('turbidity/start')
  startTurbiditySimulation() {
    return this.turbiditySensorService.startTurbiditySimulation();
  }

  /**
   * POST /sensors/turbidity/stop
   * Stop Temperature simulation
   *
   */
  @Post('turbidity/stop')
  stopTurbiditySimulation() {
    return this.turbiditySensorService.stopTurbiditySimulation();
  }
}
