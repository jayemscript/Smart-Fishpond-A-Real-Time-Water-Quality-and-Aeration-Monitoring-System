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

@Entity('dissolved_oxygen_records')
export class DissolvedOxygenRecords extends BaseEntity {
  @Column({
    name: 'sensor_id',
    type: 'varchar',
    nullable: false,
  })
  sensorId: string;

  @Column({
    name: 'value',
    type: 'float',
    nullable: false,
  })
  oxygenLevel: number;

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
