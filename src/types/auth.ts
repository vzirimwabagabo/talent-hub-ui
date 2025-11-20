// src/types/auth.ts

export type UserRole = 'participant' | 'supporter' | 'admin';
export type RegisterableRole = 'participant' | 'supporter'; // only these can register
export type SupporterType = 'employer' | 'donor' | 'volunteer' | null;

export interface AuthUser {
  _id: string;
  id? : string;
  name: string;
  email: string;
  role: UserRole;
  supporterType: SupporterType;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  data?: any;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: UserRole; // optional; backend defaults to 'participant'
  supporterType?: SupporterType;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}