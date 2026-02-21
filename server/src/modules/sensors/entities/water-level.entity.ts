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

@Entity('water_level_records')
export class WaterLevelRecords extends BaseEntity {
  @Column({
    name: 'sensor_id',
    type: 'varchar',
    nullable: false,
  })
  sensorId: string;

  @Column({
    name: 'level',
    type: 'varchar',
    nullable: false,
  })
  level: string;

  @Column({
    name: 'timestamp',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  timestamp: Date | null;

  @Column({
    name: 'status',
    type: 'varchar',
    nullable: false,
  })
  status: string;
}
