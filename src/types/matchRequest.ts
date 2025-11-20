// src/types/matchRequest.ts

import { AuthUser } from './auth';

export type MatchRequestStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled';

export interface MatchRequest {
  id: string;
  talent: Pick<AuthUser, 'id' | 'name' | 'email' | 'role'>;
  opportunity: {
    id: string;
    title: string;
    category: string;
    location?: string;
    deadline?: string;
  };
  matchScore: number;
  status: MatchRequestStatus;
  message?: string;
  reviewedBy?: Pick<AuthUser, 'id' | 'name'>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMatchRequestData {
  opportunityId: string;
  matchScore?: number;
  message?: string;
}