// src/api/messageApi.ts

import api from '@/api/apiConfig';
import {
  Message,
  SendMessageData,
  MarkAsReadResponse,
  DeleteMessageResponse,
} from '@/types/message';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Send a new message
export const sendMessage = async (
  data: SendMessageData
): Promise<ApiResponse<Message>> => {
  try {
    const response = await api.post<{ message: Message }>('/message', data);
    return { success: true, data: response.data.message };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to send message';
    return { success: false, error: message };
  }
};

// Get all messages for current user (conversations)
export const getUserMessages = async (): Promise<ApiResponse<Message[]>> => {
  try {
    const response = await api.get<{ messages: Message[] }>('/message');
    console.log(response?.data?.messages);
    return { success: true, data: response.data.messages };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to load messages';
    return { success: false, error: message };
  }
};

// Get unread message count
export const getUnreadMessages = async (): Promise<
  ApiResponse<{ count: number }>
> => {
  try {
    const response = await api.get<{ count: number }>('/message/unread');
    return { success: true, data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to check unread messages';
    return { success: false, error: message };
  }
};

// Mark a message as read
export const markAsRead = async (messageId: string): Promise<ApiResponse<MarkAsReadResponse>> => {
  try {
    const response = await api.patch<{ success: boolean; message: string }>(
      `/message/${messageId}/read`
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to mark message as read';
    return { success: false, error: message };
  }
};

// Delete a message
export const deleteMessage = async (messageId: string): Promise<ApiResponse<DeleteMessageResponse>> => {
  try {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/message/${messageId}`
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to delete message';
    return { success: false, error: message };
  }
};