// src/api/conversationApi.ts

import api from './apiConfig';
import { Conversation, StartConversationData } from '@/types/conversation';
import { Message } from '@/types/message';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch all conversations for the current user
 */
export const getConversations = async (): Promise<ApiResponse<Conversation[]>> => {
  try {
    const response = await api.get<{ conversations: Conversation[] }>('/conversation');
    return { success: true, data: response.data.conversations }; // ✅ fixed
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to load conversations';
    return { success: false, error: message };
  }
};

/**
 * Start a new conversation with a user (or get existing one)
 */
export const startConversation = async (
  data: StartConversationData
): Promise<ApiResponse<Conversation>> => {
  try {
    //console.log("Sending data for conversations: ", data)
    const response = await api.post<{ conversation: Conversation }>('/conversation', data);
    //console.log("from api",response?.data);
    return { success: true, data: response.data.conversation }; // ✅ fixed
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to start conversation';
    return { success: false, error: message };
  }
};

/**
 * Get all messages in a conversation
 */
export const getConversationMessages = async (
  conversationId: string
): Promise<ApiResponse<Message[]>> => {
  try {
    const response = await api.get<{ messages: Message[] }>(
      `/conversation/${conversationId}/messages`
    );
    return { success: true, data: response.data.messages }; // ✅ fixed
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to load messages';
    return { success: false, error: message };
  }
};