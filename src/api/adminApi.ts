// src/api/adminApi.ts

import api from '@/api/apiConfig';

// =======================
// Types
// =======================

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  supporterType?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: string;
  supporterType?: string | null;
}

// =======================
// Admin Analytics
// =======================

export const getAdminAnalytics = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get('/admin/analytics');
    return { success: true, data: response.data.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load analytics',
    };
  }
};

// =======================
// Get All Users
// =======================

export const getAllUsers = async (): Promise<AdminUser[]> => {
  try {
    const response = await api.get<{ users: AdminUser[] }>('/admin/users');
    return Array.isArray(response.data.users) ? response.data.users : [];
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Optional: getAdminUsers with mapping for legacy usage
export const getAdminUsers = async (): Promise<ApiResponse<AdminUser[]>> => {
  try {
    const response = await api.get<{ users: AdminUser[] }>('/admin/users');
    const users = (response.data.users ?? []).map((u: any) => ({
      _id: u._id,
      name: u.name ?? '',
      email: u.email ?? '',
      role: u.role ?? 'participant',
      supporterType: u.supporterType ?? null,
      createdAt: u.createdAt ?? '',
      updatedAt: u.updatedAt ?? '',
    }));

    return { success: true, data: users };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load users',
    };
  }
};

// =======================
// Get Stats
// =======================

export const getStats = async (): Promise<any> => {
  try {
    const response = await api.get('/admin/stats/all');
    return response.data ?? {};
  } catch (error: any) {
    console.error('Error fetching statistics:', error);
    return {};
  }
};

// =======================
// Update User
export const updateUser = async (
  userId: string,
  updates: any
) => {
  try {
    const response = await api.patch(`/admin/users/${userId}`, updates);
    return {
      success: response.data.success,
      data: response.data.user,   // <-- CORRECT (backend returns "user")
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update user',
    };
  }
};

// =======================
// Delete User
// =======================
export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return {
      success: response.data.success,
      data: response.data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete user',
    };
  }
};