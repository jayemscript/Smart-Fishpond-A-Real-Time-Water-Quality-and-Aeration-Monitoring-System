// src/modules/users/entities/user.entity.ts
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
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Roles } from 'src/modules/rbac/entities/roles.entity';
import { v7 as uuidv7 } from 'uuid';
import { UserPermissions } from 'src/modules/rbac/entities/user-permission.entity';
import { AuthLog } from 'src/modules/auth/entities/auth-log.entity';
import { Notifications } from 'src/modules/notifications/entities/notification.entity';
// import { Employee } from 'src/modules/employee/entities/employee.entity';
import { AuditLog } from 'src/modules/audit/entities/audit-log.entity';
import { DateTimeTransformer } from 'src/shared/dates/date-time.transformer';
import { BaseEntity } from 'src/shared/entities/base-entity';

@Entity('users')
export class User extends BaseEntity {
  // @OneToOne(() => Employee, {
  //   // eager: true,
  //   onDelete: 'CASCADE',
  //   nullable: true,
  // })
  // @JoinColumn({ name: 'employee_id' })
  // employeeId: Employee | null;


  @Column({
    name: 'profile_image',
    type: 'text',
    nullable: true,
  })
  profileImage: string;

  @Column({ name: 'full_name', type: 'varchar', nullable: false })
  fullname: string;

  @Column({
    name: 'user_name',
    type: 'varchar',
    nullable: false,
    unique: true,
    transformer: {
      to: (value: string) => value.trim().toLowerCase(),
      from: (value: string) => value,
    },
  })
  username: string;

  @Column({ type: 'json', nullable: true })
  access: string[];

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
    unique: true,
    transformer: {
      to: (value: string) => value.trim().toLowerCase(),
      from: (value: string) => value,
    },
  })
  email: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @Column({ name: 'pass_key', type: 'varchar', nullable: true })
  passKey: string;

  @ManyToOne(() => Roles, { eager: true })
  @JoinColumn({ name: 'role_id' })
  roleId: Roles;

  @OneToMany(() => UserPermissions, (userPermission) => userPermission.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userPermissions: UserPermissions[];

  @Column({ name: 'failed_attempts', type: 'int', default: 0 })
  failedAttempts: number;

  @Column({
    name: 'lockout_until',
    type: 'timestamptz',
    nullable: true,
    default: null,
    transformer: DateTimeTransformer,
  })
  lockoutUntil: Date | null;

  @OneToMany(() => AuthLog, (authLog) => authLog.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  authLogs: AuthLog[];

  @OneToMany(() => Notifications, (notification) => notification.author, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  notifications: Notifications[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.performedBy, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  auditLogs: AuditLog[];
}
