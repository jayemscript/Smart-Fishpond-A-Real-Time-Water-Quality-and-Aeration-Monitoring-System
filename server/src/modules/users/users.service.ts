// src/modules/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { HashingService } from 'src/utils/services/hashing.service';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Roles } from 'src/modules/rbac/entities/roles.entity';
import { Employee } from '../employee/entities/employee.entity';
import {
  PaginationService,
  QueryOptions,
} from 'src/utils/services/pagination.service';
import { PatchService } from 'src/utils/services/patch.service';
import { AuthLog } from 'src/modules/auth/entities/auth-log.entity';
import { UserPermissions } from 'src/modules/rbac/entities/user-permission.entity';
import { Notifications } from 'src/modules/notifications/entities/notification.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { NotificationsService } from 'src/modules/notifications/notifications.service';
import { AuditService } from 'src/modules/audit/audit.service';
import { FileUploadService } from 'src/utils/services/file-upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(UserPermissions)
    private readonly authLogRepository: Repository<AuthLog>,
    @InjectRepository(UserPermissions)
    private readonly userPermissionRepository: Repository<UserPermissions>,
    @InjectRepository(Notifications)
    private readonly notificationRepository: Repository<Notifications>,
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,

    //services or providers
    private readonly hashingService: HashingService,
    private readonly paginationService: PaginationService<User>,
    private readonly patchService: PatchService<User>,
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
    private readonly notificationService: NotificationsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  /** Upload a new asset image and return URL */
  async uploadImage(file: Buffer, fileName?: string): Promise<string> {
    if (!file) return '';
    return (await this.fileUploadService.uploadFiles(file, {
      folderName: 'users_profile_images',
      fileNames: fileName ? [fileName] : undefined,
      isMultiple: false,
    })) as string;
  }

  /** Replace existing asset image with a new one */
  async replaceImage(
    oldImageUrl: string,
    newFile: Buffer,
    fileName?: string,
  ): Promise<string> {
    if (oldImageUrl) {
      await this.fileUploadService.deleteFile(oldImageUrl);
    }
    return await this.uploadImage(newFile, fileName);
  }

  /** CREATE a new user */
  async createUser(
    createUserDto: CreateUserDto,
    currentUser: User,
  ): Promise<User> {
    const {
      username,
      email,
      password,
      passKey,
      fullname,
      roleId,
      // employeeId,
      access,
    } = createUserDto;

    // check if username already exists
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // check if email already exists
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    // hash password
    const hashedPassword = await this.hashingService.hash(password);

    //hash passkey
    const hashedPasskey = await this.hashingService.hash(passKey);

    // // check if employee is already assigned to another user
    // if (employeeId) {
    //   const existingUserWithEmployee = await this.userRepository.findOne({
    //     where: { employeeId: { id: employeeId } },
    //   });

    //   if (existingUserWithEmployee) {
    //     throw new ConflictException(
    //       'This employee is already linked to another user',
    //     );
    //   }
    // }

    // fetch the role entity
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new BadRequestException('Invalid roleId');
    }

    // let employee: Employee | null = null;
    // if (employeeId) {
    //   employee = await this.employeeRepository.findOne({
    //     where: { id: employeeId },
    //   });
    //   if (!employee) throw new BadRequestException('Invalid employeeId');
    // }

    // create user entity
    const newUser = this.userRepository.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      passKey: hashedPasskey,
      roleId: role,
      // employeeId: employee,
      access,
    });

    const savedUser = await this.userRepository.save(newUser);

    const TxID = `TX_USER-${savedUser.id}`;

    // Audit logs
    await this.auditService.log({
      transactionId: TxID,
      performedBy: currentUser,
      action: 'CREATE',
      title: `User Account Created ${savedUser.fullname}`,
      before: savedUser,
      after: savedUser,
    });

    //Notifications Logs
    await this.notificationService.notificationLogs({
      title: 'User Account Created',
      description: `User Account Created ${savedUser.fullname}`,
      actions: 'READ',
      status: 'NORMAL',
      author: currentUser,
    });

    return savedUser;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ): Promise<{ old_data: Partial<User>; new_data: User }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Check username uniqueness
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUser) throw new ConflictException('Username already exists');
    }

    // Check email uniqueness
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) throw new ConflictException('Email already exists');
    }

    // Prepare a mutable Partial<User>
    const updateData: Partial<User> = {};

    // Handle profile image
    if (updateUserDto.profileImage !== undefined) {
      if (updateUserDto.profileImage === '') {
        // User wants to remove avatar
        if (user.profileImage) {
          await this.fileUploadService.deleteFile(user.profileImage);
        }
        updateData.profileImage = '';
      } else {
        // User uploaded a new avatar
        const base64Data = updateUserDto.profileImage.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        const buffer = Buffer.from(base64Data, 'base64');
        const ext =
          updateUserDto.profileImage.match(/^data:image\/(\w+);base64,/)?.[1] ||
          'png';
        const fileName = `${updateUserDto.fullname || user.fullname}-${Date.now()}.${ext}`;
        const imageUrl = await this.replaceImage(
          user.profileImage,
          buffer,
          fileName,
        );
        updateData.profileImage = imageUrl;
      }
    }

    if (updateUserDto.fullname) updateData.fullname = updateUserDto.fullname;
    if (updateUserDto.username) updateData.username = updateUserDto.username;
    if (updateUserDto.email) updateData.email = updateUserDto.email;
    if (updateUserDto.access) updateData.access = updateUserDto.access;

    // Hash password if needed
    if (updateUserDto.password) {
      updateData.password = await this.hashingService.hash(
        updateUserDto.password,
      );
    }

    // Hash passKey if needed
    if (updateUserDto.passKey) {
      updateData.passKey = await this.hashingService.hash(
        updateUserDto.passKey,
      );
    }

    // Handle employeeId (allow null to unlink)
    // if (updateUserDto.hasOwnProperty('employeeId')) {
    //   if (updateUserDto.employeeId === null) {
    //     // Unlink employee
    //     updateData.employeeId = null;
    //   } else if (updateUserDto.employeeId !== user.employeeId?.id) {
    //     // Check if employee is already linked to another user
    //     const existingUserWithEmployee = await this.userRepository.findOne({
    //       where: { employeeId: { id: updateUserDto.employeeId } },
    //     });

    //     if (
    //       existingUserWithEmployee &&
    //       existingUserWithEmployee.id !== user.id
    //     ) {
    //       throw new ConflictException(
    //         'This employee is already linked to another user',
    //       );
    //     }

    //     const employee = await this.employeeRepository.findOne({
    //       where: { id: updateUserDto.employeeId },
    //     });
    //     if (!employee) {
    //       throw new BadRequestException('Invalid employeeId');
    //     }

    //     updateData.employeeId = employee;
    //   }
    // }

    // Handle role relation
    if (updateUserDto.roleId && updateUserDto.roleId !== user.roleId?.id) {
      const role = await this.roleRepository.findOne({
        where: { id: updateUserDto.roleId },
      });
      if (!role) throw new BadRequestException('Invalid roleId');

      updateData.roleId = role;
    }

    const TxID = `TX_USER-${user.id}`;

    console.log('updateData.profileImage:', updateData.profileImage);

    // Audit logs
    await this.auditService.log({
      transactionId: TxID,
      performedBy: currentUser,
      action: 'UPDATE',
      title: `User Account UPDATED ${user.fullname}`,
      before: updateUserDto,
      after: updateUserDto,
    });

    // Notifications Logs
    await this.notificationService.notificationLogs({
      title: 'User Account UPDATED',
      description: `User Account UPDATED ${user.fullname}`,
      actions: 'READ',
      status: 'NORMAL',
      author: currentUser,
    });

    return this.patchService.patch(this.userRepository, id, updateData, {
      patchBy: 'id',
      title: 'User Update',
      description: `User ${id} updated`,
      relations: [],
    });
  }

  async deleteUser(id: string, deleteUserDto: DeleteUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (
      !deleteUserDto ||
      !deleteUserDto.email ||
      deleteUserDto.email.trim() === ''
    ) {
      throw new BadRequestException('Email is required to delete a user');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Safety check: email must match
    if (user.email !== deleteUserDto.email.trim().toLowerCase()) {
      throw new ConflictException('Email confirmation does not match');
    }

    if (user.email.toLowerCase() === 'admin@email.com') {
      throw new BadRequestException(
        'Operation denied: the user account is a protected default system account and cannot be deleted',
      );
    }

    await this.userRepository.remove(user);
    return user;
  }

  /** GET paginated users */
  async getAllPaginatedUsers(
    page?: number,
    limit?: number,
    keyword?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: string | Record<string, any> | Record<string, any>[],
  ) {
    let parsedFilters: Record<string, any> | Record<string, any>[] = {};

    if (filters) {
      if (typeof filters === 'string') {
        try {
          parsedFilters = JSON.parse(filters);
        } catch (err) {
          throw new BadRequestException(
            `Invalid JSON or Invalid variable type in 'filters': ${err.message}`,
          );
        }
      } else {
        parsedFilters = filters;
      }
    }

    return this.paginationService.paginate(this.userRepository, 'user', {
      page: page || 1,
      limit: limit || 10,
      keyword: keyword || '',
      searchableFields: ['id', 'username', 'email', 'fullname'],
      sortableFields: ['username', 'email', 'createdAt', 'roleId.role'],
      sortBy: (sortBy?.trim() as keyof User) || 'createdAt',
      sortOrder: sortOrder || 'desc',
      dataKey: 'users_data',
      relations: ['roleId', 'userPermissions.permission'],
      filters: parsedFilters, // now guaranteed to be valid object/array
      withDeleted: true, // include soft-deleted users
    });
  }

  /** Soft delete a user by ID */
  async softDeleteUser(id: string, currentUser: User): Promise<User> {
    // Load user with relations to soft delete linked entities
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'studentId',
        'employeeId',
        'authLogs',
        'userPermissions',
        'notifications',
        'auditLogs',
      ],
    });

    if (!user) throw new NotFoundException('User not found or already deleted');

    if (user.email.toLowerCase() === 'admin@email.com') {
      throw new BadRequestException(
        'Operation denied: the user account is a protected default system account and cannot be deleted',
      );
    }
    const beforeDelete = { ...user };

    const deletedUser = await this.dataSource.transaction(async (manager) => {
      // if (user.employeeId) await manager.softRemove(user.employeeId);
      if (user.authLogs?.length) await manager.softRemove(user.authLogs);
      if (user.userPermissions?.length)
        await manager.softRemove(user.userPermissions);
      if (user.notifications?.length)
        await manager.softRemove(user.notifications);
      if (user.auditLogs?.length) await manager.softRemove(user.auditLogs);

      const result = await manager.softRemove(user);
      return result;
    });

    const TxID = `TX_USER-${user.id}`;

    // Audit logs
    await this.auditService.log({
      transactionId: TxID,
      performedBy: currentUser,
      action: 'DELETE',
      title: `User Account DELETED | DEACTIVATED ${user.fullname}`,
      before: beforeDelete,
      after: deletedUser,
    });

    //Notifications Logs
    await this.notificationService.notificationLogs({
      title: 'DELETE',
      description: `User Account DELETED | DEACTIVATED ${user.fullname}`,
      actions: 'READ',
      status: 'NORMAL',
      author: currentUser,
    });

    return deletedUser;
  }

  /** Recover a soft-deleted user by ID */
  async recoverDeletedUser(id: string, currentUser: User): Promise<User> {
    // Load user with deleted relations
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: [
        'studentId',
        'employeeId',
        'authLogs',
        'userPermissions',
        'notifications',
        'auditLogs',
      ],
    });

    if (!user) throw new NotFoundException('User not found');
    if (!user.deletedAt) throw new BadRequestException('User is not deleted');

    const beforeRecovery = { ...user };

    const afterRecovery = await this.dataSource.transaction(async (manager) => {
      // if (user.employeeId?.deletedAt) await manager.recover(user.employeeId);
      if (user.authLogs?.length) await manager.recover(user.authLogs);
      if (user.userPermissions?.length)
        await manager.recover(user.userPermissions);
      if (user.notifications?.length) await manager.recover(user.notifications);
      if (user.auditLogs?.length) await manager.recover(user.auditLogs);

      await manager.recover(user); // clears deletedAt
      return user;
    });

    const TxID = `TX_USER-${user.id}`;

    // Audit logs
    await this.auditService.log({
      transactionId: TxID,
      performedBy: currentUser,
      action: 'RECOVERED',
      title: `User Account RECOVERED ${user.fullname}`,
      before: beforeRecovery,
      after: afterRecovery,
    });

    //Notifications Logs
    await this.notificationService.notificationLogs({
      title: 'RECOVERED',
      description: `User Account RECOVERED ${user.fullname}`,
      actions: 'READ',
      status: 'NORMAL',
      author: currentUser,
    });

    // Recover inside transaction for consistency
    // return await this.dataSource.transaction(async (manager) => {
    //   if (user.employeeId?.deletedAt) await manager.recover(user.employeeId);
    //   if (user.authLogs?.length) await manager.recover(user.authLogs);
    //   if (user.userPermissions?.length)
    //     await manager.recover(user.userPermissions);
    //   if (user.notifications?.length) await manager.recover(user.notifications);
    //   if (user.auditLogs?.length) await manager.recover(user.auditLogs);

    //   await manager.recover(user); // clears deletedAt
    //   return user;
    // });

    return afterRecovery;
  }

  /** GET user by ID */
  async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roleId', 'userPermissions.permission'],
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Extract only what you need, keeping password + profileImage
    const { userPermissions, ...rest } = user;

    // Flatten permissions like in authCheck
    const permissions = userPermissions.map((up) => up.permission);

    return {
      ...rest,
      permissions,
    };
  }

  /** Get All Users list*/
  async getAllUsersList(): Promise<{
    message: string;
    data: User[];
  }> {
    const users = await this.userRepository.find();

    return {
      message: 'Success getting all users',
      data: users,
    };
  }
}
