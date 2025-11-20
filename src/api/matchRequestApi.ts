// src/api/matchRequestApi.ts

import api from '@/api/apiConfig';
import { MatchRequest, CreateMatchRequestData } from '@/types/matchRequest';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const createMatchRequest = async (
   CreateMatchRequestData
): Promise<ApiResponse<MatchRequest>> => {
  try {
    const response = await api.post<{ data: MatchRequest }>('/api/v1/match-requests', data);
    return { success: true, data: response.data.data }; // ✅ Fixed
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to create request' };
  }
};

export const getMatchRequestsForTalent = async (): Promise<ApiResponse<MatchRequest[]>> => {
  try {
    const response = await api.get<{ data: MatchRequest[] }>('/api/v1/match-requests/my');
    return { success: true,  data:response.data.data }; // ✅ Fixed
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to load requests' };
  }
};

export const getMatchRequestsForReview = async (): Promise<ApiResponse<MatchRequest[]>> => {
  try {
    const response = await api.get<{ data: MatchRequest[] }>('/match-requests/review');
    return { success: true,  data: response.data.data }; // ✅ Fixed
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to load requests' };
  }
};

export const updateMatchRequestStatus = async (
  id: string,
  status: 'approved' | 'rejected' | 'pending' | 'fulfilled'
): Promise<ApiResponse<MatchRequest>> => {
  try {
    const response = await api.patch<{ data: MatchRequest }>(`/match-requests/${id}/status`, { status });
    return { success: true, data: response.data.data }; // ✅ Fixed
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to update status' };
  }
};