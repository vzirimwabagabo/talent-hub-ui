// src/types/dashboard.ts

import { UserRole, SupporterType } from './auth';

// --- Shared ---
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'alert' | 'message';
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: { id: string; name: string; avatar?: string };
  content: string;
  read: boolean;
  sentAt: string;
}

export interface BookmarkItem {
  id: string;
  itemId: string;
  itemType: 'Talent' | 'Event' | 'Message' | 'Opportunity';
  title: string;
  createdAt: string;
}

// --- Participant ---
export interface MatchRequest {
  id: string;
  opportunity: {
    id: string;
    title: string;
    category: string;
    deadline?: string;
  };
  matchScore: number;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  message?: string;
  reviewedBy?: { id: string; name: string };
  createdAt: string;
}

export interface TalentProfile {
  id: string;
  bio: { en: string };
  skills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  availability: 'full-time' | 'part-time' | 'freelance';
  profileCompletion: number;
}

export interface Opportunity {
  id: string;
  title: string;
  category: string;
  location?: string;
  deadline?: string;
  postedBy: { id: string; name: string };
  isActive: boolean;
}

// --- Supporter ---
export interface Donation {
  id: string;
  amount: number;
  currency: string;
  message?: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  startDate: string;
  location?: string;
  isVirtual: boolean;
  attendeesCount: number;
}

// --- Admin ---
export interface UserStats {
  totalUsers: number;
  participants: number;
  supporters: number;
  admins: number;
}

export interface PlatformStats {
  totalOpportunities: number;
  activeOpportunities: number;
  totalMatchRequests: number;
  pendingRequests: number;
}