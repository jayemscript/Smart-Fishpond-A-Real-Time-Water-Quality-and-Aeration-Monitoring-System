//src/modules.module.ts
import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { SocketModule } from './modules/sockets/socket.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SystemModule } from './modules/system/system.module';
import { SmsModule } from './modules/sms/sms.module';
import { MailerModule } from './modules/mailer/mailer.module';

@Module({
  imports: [
    HealthModule,
    UsersModule,
    AuthModule,
    RbacModule,
    SocketModule,
    AuditModule,
    NotificationsModule,
    SystemModule,
    SmsModule,
    MailerModule,
  ],
  exports: [
    HealthModule,
    UsersModule,
    AuthModule,
    RbacModule,
    SocketModule,
    NotificationsModule,
    AuditModule,
    SystemModule,
    SmsModule,
    MailerModule,
  ],
})
export class ModulesModule {}
