// src/api/opportunityApi.ts

import api from '@/api/apiConfig';
import { CreateOpportunityData } from '@/types/opportunity';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const createOpportunity = async (data): Promise<ApiResponse<void>> => {
  try {
    //console.log(data);
    await api.post('/opportunity',data);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.response?.data?.message || 'Failed to create opportunity' };
  }
};


export const getAllOpportunities = async () => {
  try {

    const res  = await api.get('/opportunity')
    return {success:true,opportunities: res.data?.opportunities}
    
  } catch (error) {
    console.log(error);
    
  }
}

export const getOpportunityDetails = async (id:string) => {
  try {
    const res = await api.get(`/opportunity/${id}`)
    return { success:true,opportunity:res.data.opportunity}
    
  } catch (error) {
    console.log(error)
  }

}


export const updateOpportunity = async (id:string, data:any)=>{
try {
  const res = await api.patch(`/opportunity/${id}`, data)
  return { success:true,opportunity:res.data.opportunity}
} catch (error) {
  console.log(error)
}
}


export const deleteOpportunity = async (id:string) => {
  try {
    const res = await api.delete(`/opportunity/${id}`)
    return {success:true, opportunity:res.data.opportunity}
  } catch (error) {
    console.log(error)
  }
}