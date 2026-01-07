import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ESP32EndpointService } from '../services/esp32-endpoint.service';

@Controller('esp-32')
export class Esp32Controller {
  constructor(private readonly esp32Service: ESP32EndpointService) {}

  @Get('verify')
  verify(@Query('deviceId') deviceId: string) {
    return this.esp32Service.verifyDevice(deviceId);
  }

  @Post('test-handshake')
  testHandshake(@Body() body: { deviceId: string; data?: any }) {
    return this.esp32Service.testHandshake(body.deviceId, body.data);
  }

  @Get('info')
  getInfo(@Query('deviceId') deviceId?: string) {
    return this.esp32Service.getInfo(deviceId);
  }
}
