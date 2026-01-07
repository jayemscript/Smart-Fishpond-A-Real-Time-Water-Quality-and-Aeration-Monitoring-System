//src/modules/sensors/controllers/esp-32.controller.ts

import {
Controller,
Get,
Post,
Body,
Param,
Patch,
Delete
} from '@nestjs/common'
import {ESP32EndpointService} from '../services/esp32-endpoint.service'

@Controller('esp-32')
export class Esp32Controller {
    constructor ( 
        private readonly esp32Service: ESP32EndpointService
    ) {}
}