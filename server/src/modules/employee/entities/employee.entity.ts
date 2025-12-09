import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  BeforeInsert,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { User } from 'src/modules/users/entities/user.entity';
import { DateTimeTransformer } from 'src/shared/dates/date-time.transformer';
import { BaseEntity } from 'src/shared/entities/base-entity';
import { EmployeePersonalInfo } from './personal-info.entity';
import { EmployeeContactInfo } from './contact-info.entity';
import { EmployeeAddressInfo } from './address-info.entity';
import { EmployeeGovernmentInfo } from './government-info.entity';
import { EmployeeFamilyInfo } from './family-info.entity';
import { EmployeeEducationalInfo } from './educational-info.entity';
import { EmployeeWorkExperienceInfo } from './work-experience-info.entity';
// new
import { EmployeeCoreWorkInfo } from './employee-work-info.entity';

@Entity('employees')
export class Employee extends BaseEntity {
  // @OneToOne(() => User, (user) => user.employeeId)
  // user: User;

  @Column({
    name: 'employee_id',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  employeeId: string;

  @OneToOne(() => EmployeePersonalInfo, { cascade: true })
  @JoinColumn({ name: 'personal_info_id' })
  personalInfo: EmployeePersonalInfo;

  @OneToOne(() => EmployeeContactInfo, { cascade: true })
  @JoinColumn({ name: 'contact_info_id' })
  contactInfo: EmployeeContactInfo;

  @OneToOne(() => EmployeeAddressInfo, { cascade: true })
  @JoinColumn({ name: 'address_info_id' })
  addressInfo: EmployeeAddressInfo;

  @OneToOne(() => EmployeeGovernmentInfo, {
    cascade: true,
  })
  @JoinColumn({ name: 'government_info_id' })
  governmentInfo: EmployeeGovernmentInfo;

  @OneToOne(() => EmployeeFamilyInfo, { cascade: true })
  @JoinColumn({ name: 'family_info_id' })
  familyInfo: EmployeeFamilyInfo;

  @OneToOne(() => EmployeeEducationalInfo, {
    cascade: true,
  })
  @JoinColumn({ name: 'educational_info_id' })
  educationalInfo: EmployeeEducationalInfo;

  @OneToMany(() => EmployeeWorkExperienceInfo, (work) => work.employee, {
    cascade: true,
  })
  workExperienceInfo: EmployeeWorkExperienceInfo[];

  @Column({ type: 'boolean', default: false, name: 'is_verified' })
  isVerified: boolean; // false = editable, true = finalized (Employee Core Record)

  @Column({ type: 'boolean', default: false, name: 'is_approved' })
  isApproved: boolean; // false = on-boarding, true = probation (Employe Company Job Details)

  @Column({
    name: 'verified_at',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  verifiedAt?: Date | null;

  @Column({
    name: 'approved_at',
    type: 'timestamptz',
    nullable: true,
    transformer: DateTimeTransformer,
  })
  approvedAt?: Date | null;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'prepared_by_id' })
  preparedBy: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'verified_by_id' })
  verifiedBy?: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy?: User;

  // Core Work Information

  @OneToMany(() => EmployeeCoreWorkInfo, (coreWork) => coreWork.employee, {
    cascade: true,
  })
  coreWorkInfo: EmployeeCoreWorkInfo[];
}
