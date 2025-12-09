import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Permissions } from 'src/modules/rbac/entities/permission.entity';
import { Roles } from 'src/modules/rbac/entities/roles.entity';
import { UserPermissions } from 'src/modules/rbac/entities/user-permission.entity';
import { AuthLog } from 'src/modules/auth/entities/auth-log.entity';

import { Session } from 'src/modules/auth/entities/session.entity';
import { AuditLog } from 'src/modules/audit/entities/audit-log.entity';
import { Notifications } from 'src/modules/notifications/entities/notification.entity';
const isSSL = process.env.DB_SSL === 'true';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    User,
    Permissions,
    Roles,
    UserPermissions,
    AuthLog,
    Session,
    AuditLog,
    Notifications,
  ],
  migrations: ['migrations/*.ts'],
  synchronize: true,
  ssl: isSSL ? { rejectUnauthorized: false } : false,
});
