// src/api/matchRequestApi.ts

import api from '@/api/apiConfig';
import { MatchRequest, CreateMatchRequestData } from '@/types/matchRequest';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface MatchRequestApiRecord {
  _id?: string;
  id?: string;
  talent?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  opportunity?: {
    _id?: string;
    id?: string;
    title?: string;
    category?: string;
    location?: string;
    deadline?: string;
  };
  reviewedBy?: {
    _id?: string;
    id?: string;
    name?: string;
  };
  matchScore?: number;
  status?: MatchRequest['status'];
  message?: string;
  createdAt?: string;
  updatedAt?: string;
}

const normalizeMatchRequest = (request: MatchRequestApiRecord): MatchRequest => ({
  id: request.id || request._id || '',
  talent: {
    id: request.talent?.id || request.talent?._id || '',
    name: request.talent?.name || '',
    email: request.talent?.email || '',
    role: (request.talent?.role as MatchRequest['talent']['role']) || 'participant',
  },
  opportunity: {
    id: request.opportunity?.id || request.opportunity?._id || '',
    title: request.opportunity?.title || '',
    category: request.opportunity?.category || 'other',
    location: request.opportunity?.location,
    deadline: request.opportunity?.deadline,
  },
  matchScore: request.matchScore || 0,
  status: request.status || 'pending',
  message: request.message,
  reviewedBy: request.reviewedBy
    ? {
        id: request.reviewedBy.id || request.reviewedBy._id || '',
        name: request.reviewedBy.name || '',
      }
    : undefined,
  createdAt: request.createdAt || '',
  updatedAt: request.updatedAt || '',
});

export const createMatchRequest = async (
  data: CreateMatchRequestData
): Promise<ApiResponse<MatchRequest>> => {
  try {
    const response = await api.post<{ data: MatchRequestApiRecord }>('/match', {
      opportunity: data.opportunityId,
      matchScore: data.matchScore,
      message: data.message,
    });
    return { success: true, data: normalizeMatchRequest(response.data.data) };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to create request' };
  }
};

export const getMatchRequestsForTalent = async (): Promise<ApiResponse<MatchRequest[]>> => {
  try {
    const response = await api.get<{ data: MatchRequestApiRecord[] }>('/match/my');
    return { success: true, data: (response.data.data || []).map(normalizeMatchRequest) };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to load requests' };
  }
};

export const getMatchRequestsForReview = async (): Promise<ApiResponse<MatchRequest[]>> => {
  try {
    const response = await api.get<{ data: MatchRequestApiRecord[] }>('/match/review');
    return { success: true, data: (response.data.data || []).map(normalizeMatchRequest) };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to load requests for review' };
  }
};

export const updateMatchRequestStatus = async (
  id: string,
  status: 'approved' | 'rejected' | 'pending' | 'fulfilled'
): Promise<ApiResponse<MatchRequest>> => {
  try {
    const response = await api.patch<{ data: MatchRequestApiRecord }>(`/match/${id}/status`, { status });
    return { success: true, data: normalizeMatchRequest(response.data.data) };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to update status' };
  }
};