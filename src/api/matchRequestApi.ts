// src/api/matchRequestApi.ts

import api from '@/api/apiConfig';
import { MatchRequest, CreateMatchRequestData } from '@/types/matchRequest';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const createMatchRequest = async (
  data: CreateMatchRequestData
): Promise<ApiResponse<MatchRequest>> => {
  try {
    const response = await api.post<{ data: MatchRequest }>('/match', {
      opportunity: data.opportunityId,
      matchScore: data.matchScore,
      message: data.message,
    });
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to create request' };
  }
};

export const getMatchRequestsForTalent = async (): Promise<ApiResponse<MatchRequest[]>> => {
  try {
    const response = await api.get<{ data: MatchRequest[] }>('/match/my');
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to load requests' };
  }
};

export const getMatchRequestsForReview = async (): Promise<ApiResponse<MatchRequest[]>> => {
  try {
    // Fallbacks because review endpoint may vary by deployment.
    const response = await api.get<{ data: MatchRequest[] }>('/match/review');
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to load requests for review' };
  }
};

export const updateMatchRequestStatus = async (
  id: string,
  status: 'approved' | 'rejected' | 'pending' | 'fulfilled'
): Promise<ApiResponse<MatchRequest>> => {
  try {
    const response = await api.patch<{ data: MatchRequest }>(`/match/${id}/status`, { status });
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to update status' };
  }
};