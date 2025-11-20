// src/types/message.ts

import { AuthUser } from './auth';

// Original message from API
export interface Message {
  _id: string;
  sender: Pick<AuthUser, '_id' | 'name' | 'email'  | "role">;
  receiver: Pick<AuthUser, '_id' | 'name' | 'email'  | "role" >;
  content: string;
  read: boolean;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
  role ?: string
}

// Extended message used in UI with conversation context
export interface ConversationMessage extends Message {
  otherUser: Pick<AuthUser, '_id' | 'name' | 'email' | "avatar" | "role">;
}

export interface SendMessageData {
  receiverId: string;
  content: string;
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

export interface DeleteMessageResponse {
  success: boolean;
  message: string;
}