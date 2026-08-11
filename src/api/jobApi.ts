import api from '@/api/apiConfig';

export interface ExternalJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
  category: string;
  source: string;
  remote: boolean;
  postedAt: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  jobs?: T;
  error?: string;
}

export const getExternalJobs = async (): Promise<ApiResponse<ExternalJob[]>> => {
  try {
    const response = await api.get<{ jobs: ExternalJob[] }>('/jobs/external');
    return { success: true, jobs: response.data.jobs || [] };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load external jobs',
      jobs: [],
    };
  }
};