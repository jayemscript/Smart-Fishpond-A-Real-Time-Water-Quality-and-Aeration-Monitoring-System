import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base-entity';
import { DateTimeTransformer } from 'src/shared/dates/date-time.transformer';

@Entity('temperature_records')
export class TemperatureRecord extends BaseEntity {
  @Column({
    name: 'sensor_id',
    type: 'varchar',
    nullable: false,
  })
  sensorId: string;

  @Column({
    name: 'temperature',
    type: 'float',
    nullable: false,
  })
  temperature: number;

  @Column({
    name: 'timestamp',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  timestamp: Date | null;

  @Column({
    name: 'unit',
    type: 'varchar',
    nullable: false,
  })
  unit: string;
}
