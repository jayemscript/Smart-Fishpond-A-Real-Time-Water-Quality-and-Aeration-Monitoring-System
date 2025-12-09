import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SensorsService } from '../services/sensors.service';
import { CreateSensorDto } from '../dto/create-sensor.dto';
import { UpdateSensorDto } from '../dto/update-sensor.dto';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}
}
