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

@Entity('ph_level_records')
export class PhLevelRecords extends BaseEntity {
  @Column({
    name: 'sensor_id',
    type: 'varchar',
    nullable: false,
  })
  sensorId: string;

  @Column({
    name: 'ph_level',
    type: 'float',
    nullable: false,
  })
  phLevel: number;

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
