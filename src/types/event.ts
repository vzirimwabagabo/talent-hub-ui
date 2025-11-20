// src/types/event.ts

import { AuthUser } from './auth';

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  location?: string;
  isVirtual: boolean;
  organizer: {
    id: string;
    _id: string;
    name: string;
    role: string;
    supporterType?: string;
  };
  attendees: Pick<AuthUser, 'id' | 'name' | 'avatar' | '_id'>[];
  createdAt: string;
  updatedAt: string;
}


// Add to src/types/event.ts

export interface CreateEventData {
  title: string;
  description: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  location?: string;
  isVirtual: boolean;
}