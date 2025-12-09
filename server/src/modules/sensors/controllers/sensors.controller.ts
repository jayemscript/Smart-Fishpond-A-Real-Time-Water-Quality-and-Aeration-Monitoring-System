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
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';

@Controller('sensors')
export class SensorsController {
  constructor(
    private readonly temperatureSensorService: TemperatureSensorService,
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
   * GET /sensors/temperature/status
   * Check if simulation is running
   * Test in Postman: GET http://localhost:3000/sensors/temperature/status
   */
  @Get('temperature/status')
  getSimulationStatus() {
    return this.temperatureSensorService.getSimulationStatus();
  }
}
