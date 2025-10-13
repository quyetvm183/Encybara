export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive';
  role?: Role;
  createdAt: string;
  updatedAt?: string;
  field?: string;
}

export interface UserResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
  roleId?: number;
  field?: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
  roleId?: number;
  field?: string;
  status?: 'active' | 'inactive';
}