import { Permissions } from './rbac-api.interface';

export interface getAllPaginatedUser {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  users_data: any[];
}

export interface UserRequest {
  fullname: string;
  username: string;
  email: string;
  password: string;
  passKey: string;
  roleId: string;
  employeeId?: string;
  studentId?: string;
  access?: string[];
}

export interface UserData {
  id: string;
  fullname: string;
  profileImage: string;
  email: string;
  password: string;
  passKey: string;
  access?: string[];
  employeeId: {
    id: string;
    employeeId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    position: string;
    department: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    version: number;
    deletedAt: string | null;
  };
  roleId: {
    id: string;
    role: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    version: number;
  };
  permissions: Permissions | [];
  failedAttempts: number;
  lockoutUntil: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
}

export interface UserResponse {
  status: string;
  message: string;
  data: UserData | null;
}
