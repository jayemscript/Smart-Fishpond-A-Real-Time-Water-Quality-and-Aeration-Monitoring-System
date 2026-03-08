// src/modules/sensors/sensors.module.ts

import { Module } from '@nestjs/common';
import { TemperatureSensorService } from './services/temperature-sensor.service';
import { TurbiditySensorService } from './services/turbidity-sensor.service';
import { PhWaterSensorService } from './services/ph-water-sensor.service';
import { WaterLevelSensorService } from './services/water-level-sensor.service';
import { DissolvedOxygenSensorService } from './services/do.service';
import { SensorLogsService } from './services/sensor-logs.service';
import { SensorAnalyticsService } from './services/sensor-analytics.service';
import { SensorsController } from './controllers/sensors.controller';
import { SensorLogsController } from './controllers/sensor-logs.controller';
import { SocketModule } from '../sockets/socket.module';
import { SensorLoggerService } from './services/sensor-logger.service';
import { SensorAlertService } from './services/sensor-alert.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { User } from '../users/entities/user.entity';
import { DissolvedOxygenRecords } from './entities/do.entity';
import { TemperatureRecord } from './entities/temperature.entity';
import { WaterLevelRecords } from './entities/water-level.entity';
import { PhLevelRecords } from './entities/ph-level.entity';
import { MailerModule } from 'src/modules/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      DissolvedOxygenRecords,
      PhLevelRecords,
      TemperatureRecord,
      WaterLevelRecords,
    ]),
    SharedModule,
    AuthModule,
    SocketModule,
    MailerModule,
  ],
  controllers: [SensorsController, SensorLogsController],
  providers: [
    TemperatureSensorService,
    TurbiditySensorService,
    PhWaterSensorService,
    WaterLevelSensorService,
    DissolvedOxygenSensorService,
    SensorLoggerService,
    SensorLogsService,
    SensorAnalyticsService,
    SensorAlertService,
  ],
  exports: [
    TemperatureSensorService,
    TurbiditySensorService,
    PhWaterSensorService,
    WaterLevelSensorService,
    DissolvedOxygenSensorService,
    SensorLoggerService,
    SensorLogsService,
    SensorAnalyticsService,
    SensorAlertService,
  ],
})
export class SensorsModule {}
