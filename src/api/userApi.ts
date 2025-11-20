// src/api/userApi.ts
import {User} from "@/types/user"
import api from '@/api/apiConfig';
import { AuthUser, RegisterCredentials } from '@/types/auth';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  [key: string]: any;
}


const normalizeUser = (user: any): {
  id: string;
  name: string;
  email: string;
  role: string;
  supporterType: string;
  avatar?: string;
} => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  supporterType: user.supporterType,
  avatar: user.avatar,
});

// Login
export const loginUser = async (
  credentials: { email: string; password: string }
): Promise<ApiResponse<{ token: string; user: AuthUser }>> => {
  try {
    const response = await api.post<{ token: string; user: AuthUser }>('/auth/login', credentials);
    return { success: true, data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to log in';
    return { success: false, error: message };
  }
};

// Register
export const registerUser = async (
  data: RegisterCredentials
): Promise<ApiResponse<{ token: string; user: AuthUser }>> => {
  try {
    const response = await api.post<{ token: string; user: AuthUser }>('/auth/register', data);
    return { success: true, data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Registration failed';
    return { success: false, error: message };
  }
};

// Get current user
export const getCurrentUser = async (): Promise<ApiResponse<AuthUser>> => {
  try {
    const response = await api.get<{ user: AuthUser }>('/auth/me');
    return { success: true, data: response.data.user };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Unable to fetch user profile';
    return { success: false, error: message };
  }
};

// Update user profile
export const updateUserProfile = async (
  updates: Partial<Omit<AuthUser, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<AuthUser>> => {
  try {
    const response = await api.patch<{ user: AuthUser }>('/auth/profile', updates);
    return { success: true, data: response.data.user };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to update profile';
    return { success: false, error: message };
  }
};

// Change password
export const changePassword = async (
  data: { currentPassword: string; newPassword: string }
): Promise<ApiResponse<void>> => {
  try {
    await api.post('/auth/change-password', data);
    return { success: true };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to change password';
    return { success: false, error: message };
  }
};

// Request password reset (email)
export const requestPasswordReset = async (
  email: string
): Promise<ApiResponse<void>> => {
  try {
    await api.post('/auth/forgot-password', { email });
    return { success: true };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to send reset email';
    return { success: false, error: message };
  }
};

// Reset password with token
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ApiResponse<void>> => {
  try {
    await api.post('/auth/reset-password', { token, newPassword });
    return { success: true };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to reset password';
    return { success: false, error: message };
  }
};

// Logout (optional backend invalidation)
export const logoutUser = async (): Promise<ApiResponse<void>> => {
  try {
    await api.post('/auth/logout');
    return { success: true };
  } catch (error: any) {
    // We still consider logout successful even if backend fails
    // because we clear tokens on frontend
    console.warn('Logout API call failed, but frontend state cleared');
    return { success: true };
  }
};

// ✅ Updated endpoint to match your Express route
export const getAllUsers = async (): Promise<{success?: boolean;  data?: User[]; error?: string }> => {
  try {
    // 👇 Use the correct admin endpoint
    const response = await api.get<{ users: any[] }>('/admin/users');
    return {success:true,data:response.data.users}
    //console.log(response.data?.users);
    ///const normalizedUsers = response.data.users.map(normalizeUser);
   // return { success: true,  data: normalizedUsers };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to load users';
    return { success: false, error: message };
  }
};