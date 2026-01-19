import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ESP32EndpointService } from '../services/esp32-endpoint.service';

@Controller('esp-32')
export class Esp32Controller {
  constructor(private readonly esp32Service: ESP32EndpointService) {}
}
