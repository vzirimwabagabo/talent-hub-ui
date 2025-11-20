// src/types/user.ts
export type UserRole = 'participant' | 'supporter' | 'admin';
export type SupporterType = 'employer' | 'donor' | 'volunteer' | null;

export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  supporterType: SupporterType;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  normalizeUser(user: any): User;
}


export interface UpdateUserPayload {
  role?: UserRole;
  supporterType?: SupporterType;
}