
export interface UserFormModalProps {
  open: boolean;
  close: () => void;
  onSuccess?: () => void;
  initialData?: any;
  mode?: 'add' | 'edit';
}

export interface Role {
  id: string;
  role: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  deletedAt: string | null;
}

export interface Employee {
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
}

export interface UserFormData {
  id?: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  passKey: string;
  roleId: Role | null;
  employeeId: Employee | null;
  access?: string[];
}

export interface UserPayload {
  id?: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  passKey: string;
  roleId: string | null;
  employeeId: string | null;
  access?: string[];
}

export interface UserProfileFormData {
  id?: string;
  fullname: string;
  profileImage: string;
  username: string;
  password: string;
  passKey: string;
}
