import { Module } from '@nestjs/common';
import { SensorsService } from './services/sensors.service';
import { SensorsController } from './controllers/sensors.controller';

@Module({
  controllers: [SensorsController],
  providers: [SensorsService],
})
export class SensorsModule {}
