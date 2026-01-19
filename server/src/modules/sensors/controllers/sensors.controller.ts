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
import { PhWaterSensorService } from '../services/ph-water-sensor.service';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';

@Controller('sensors')
export class SensorsController {
  constructor(
    private readonly temperatureSensorService: TemperatureSensorService,
    private readonly turbiditySensorService: TurbiditySensorService,
    private readonly phWaterSensorService: PhWaterSensorService,
  ) {}

  /**
   * POST /sensors/temperature/start
   * Start continuous temperature simulation
   * Test in Postman: POST http://localhost:3000/sensors/temperature/start
   */
  @Post('temperature/start')
  startTemperatureBroadcasting() {
    return this.temperatureSensorService.startTemperatureBroadcasting();
  }

  /**
   * POST /sensors/temperature/stop
   * Stop temperature simulation
   * Test in Postman: POST http://localhost:3000/sensors/temperature/stop
   */
  @Post('temperature/stop')
  stopTemperatureBroadcasting() {
    return this.temperatureSensorService.stopTemperatureBroadcasting();
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

  /**
   * POST /sensors/ph-water/start
   * start continous ph-water monitoring
   *
   */
  @Post('ph-water/start')
  startPhBroadcasting() {
    return this.phWaterSensorService.startPhBroadcasting();
  }

  /**
   * POST /sensors/ph-water/stop
   * Stop ph-water monitoring
   *
   */
  @Post('ph-water/stop')
  stopPhBroadcasting() {
    return this.phWaterSensorService.stopPhBroadcasting();
  }


  // new
  // // POST /sensors/temperature/data
  // @Post('temperature/data')
  // receiveTemperatureFromESP32(@Body() payload: any) {
  // // Calls existing service method
  // return this.temperatureSensorService.handleTemperatureESP32(payload);
  // }


  /**
   * Unified endpoint for all sensor data from ESP32
   * Example payload:
   * { sensorType: "temperature", data: { temperature: 28.5, sensorId: "TEMP_SENSOR_01" } }
   * { sensorType: "phWater", data: { phLevel: 7.8, sensorId: "PH_SENSOR_01" } }
   */
  @Post('data')
  receiveDataFromESP32(@Body() payload: any) {
    const { sensorType } = payload;

    switch (sensorType) {
      case 'temperature':
        return this.temperatureSensorService.handleTemperatureESP32(payload);

      case 'phWater':
        return this.phWaterSensorService.handlePhWaterESP32(payload);

      default:
        return { status: 'error', message: 'Unknown sensor type' };
    }
  }

}
