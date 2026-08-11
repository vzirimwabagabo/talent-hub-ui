import api from '@/api/apiConfig';

export interface PublicVolunteerProfile {
  id: string;
  name: string;
  avatar?: string | null;
  skills: string[];
  interests: string[];
  availability: string;
  bio: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  profiles?: T;
  error?: string;
}

export const getPublicVolunteerProfiles = async (): Promise<ApiResponse<PublicVolunteerProfile[]>> => {
  try {
    const response = await api.get<{ profiles: PublicVolunteerProfile[] }>('/volunteer/public');
    return { success: true, data: response.data.profiles };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to load volunteer profiles',
    };
  }
};