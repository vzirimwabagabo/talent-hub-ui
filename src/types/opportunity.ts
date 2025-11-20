// src/types/opportunity.ts

export type OpportunityCategory = 'job' | 'internship' | 'scholarship' | 'grant' | 'volunteering' | 'other';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  location?: string;
  applyUrl?: string;
  deadline?: string; // ISO string
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional: if your API includes company/user info
  postedBy?: {
    id?: string;
    _id?: string;
    name: string;
    [key: string]: any;
  };
}

export interface CreateOpportunityData {
  title: string;
  description: string;
  category: OpportunityCategory;
  location?: string;
  applyUrl?: string;
  deadline?: string;
}