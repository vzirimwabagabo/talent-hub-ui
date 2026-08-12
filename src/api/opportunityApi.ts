// src/api/opportunityApi.ts

import api from '@/api/apiConfig';
import type { CreateOpportunityData, Opportunity } from '@/types/opportunity';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface OpportunityApiRecord {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  category: Opportunity['category'];
  location?: string;
  applyUrl?: string | null;
  deadline?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const normalizeOpportunity = (opportunity: OpportunityApiRecord): Opportunity => ({
  id: opportunity.id || opportunity._id || '',
  title: opportunity.title,
  description: opportunity.description,
  category: opportunity.category,
  location: opportunity.location,
  applyUrl: opportunity.applyUrl ?? undefined,
  deadline: opportunity.deadline,
  isActive: opportunity.isActive ?? true,
  createdAt: opportunity.createdAt || '',
  updatedAt: opportunity.updatedAt || '',
});

export const createOpportunity = async (
  data: CreateOpportunityData
): Promise<ApiResponse<Opportunity>> => {
  try {
    const res = await api.post<{ data: OpportunityApiRecord }>('/opportunity', data);
    return { success: true, data: normalizeOpportunity(res.data.data) };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to create opportunity' };
  }
};


export const getAllOpportunities = async (): Promise<{ success: boolean; opportunities: Opportunity[]; data: Opportunity[]; error?: string }> => {
  try {
    const res = await api.get<{ opportunities: OpportunityApiRecord[] }>('/opportunity');
    const opportunities = (res.data.opportunities || []).map(normalizeOpportunity);
    return { success: true, opportunities, data: opportunities };
    
  } catch (error) {
    console.log(error);
    return { success: false, opportunities: [], data: [], error: 'Failed to load opportunities' };
    
  }
}

export const getExternalJobs = async (): Promise<{ success: boolean; jobs: Opportunity[]; error?: string }> => {
  try {
    const res = await api.get('/jobs/external');
    return { success: true, jobs: res.data?.jobs || [] };
  } catch (error) {
    console.log(error);
    return { success: false, jobs: [], error: 'Failed to load external jobs' };
  }
};

export const getOpportunityDetails = async (id: string): Promise<{ success: boolean; opportunity?: Opportunity; error?: string }> => {
  try {
    const res = await api.get<{ opportunity: OpportunityApiRecord }>(`/opportunity/${id}`);
    return { success: true, opportunity: normalizeOpportunity(res.data.opportunity) };
    
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Failed to load opportunity' };
  }

}


export const updateOpportunity = async (
  id: string,
  data: CreateOpportunityData
): Promise<{ success: boolean; opportunity?: Opportunity; error?: string }> => {
try {
  const res = await api.patch<{ opportunity: OpportunityApiRecord }>(`/opportunity/${id}`, data)
  return { success:true,opportunity:normalizeOpportunity(res.data.opportunity) }
} catch (error) {
  console.log(error)
  return { success: false, error: 'Failed to update opportunity' };
}
}


export const deleteOpportunity = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await api.delete(`/opportunity/${id}`)
    return { success: true }
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Failed to delete opportunity' }
  }
}