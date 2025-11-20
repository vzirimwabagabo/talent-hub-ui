// src/types/conversation.ts

import { AuthUser } from './auth';

export interface ConversationParticipant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'participant' | 'supporter' | 'admin';
  supporterType: 'employer' | 'donor' | 'volunteer' | null;
}

export interface LastMessage {
  content: string;
  senderId: string;
  sentAt: string; // ISO string
}

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage: LastMessage | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StartConversationData {
  participantId: string;
}