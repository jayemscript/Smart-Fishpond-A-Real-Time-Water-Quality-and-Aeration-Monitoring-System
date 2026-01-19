// User data returned after login
export interface AuthUser {
  id: string;
  username: string;
  fullname: string;
  email: string;
  passKey: string;
  failedAttempts: number;
  lockoutUntil: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
  deletedAt: string | null;
}

// Login response
export interface AuthResponse {
  token: string;
  user: AuthUser;
  headerToken?: string;
  message?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthCheckResponse {
  id: string;
  fullname: string;
  username: string;
  profileImage?: string;
  email: string;
  password: string;
  failedAttempts: number;
  lockoutUntil: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  access: string[];
  iat: number;
  exp: number;
  roleId: {
    id: string;
    role: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    deletedAt: string | null;
  };
  permissions: [
    {
      id: string;
      permission: string;
      description: string;
      createdAt: string;
      updatedAt: string;
      version: number;
      deletedAt: string | null;
    },
  ];
}

export interface GetAllPaginatedAuthLogs {
  status: string;
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  auth_logs_data: any[];
}

export interface PasskeyResponse {
  status: boolean;
  message: string;
  isAuthenticated: boolean;
  user: {
    id: string;
    fullname: string;
    username: string;
    email: string;
  };
}
