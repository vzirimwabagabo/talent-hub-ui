// src/types/admin.ts

import { UserRole, SupporterType } from './auth';

// User for admin table
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  supporterType: SupporterType;
  createdAt: string;
  lastActive?: string;
}

// Talent/Volunteer profile
export interface AdminProfile {
  id: string;
  user: { id: string; name: string; email: string };
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

// Analytics data
export interface AdminAnalytics {
  totalUsers: number;
  totalDonations: number;
  mostActiveTalents: AdminProfile[];
  mostActiveVolunteers: AdminProfile[];
  unreadMessages: number;
}