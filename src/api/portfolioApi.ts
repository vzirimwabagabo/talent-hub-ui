import api from '@/api/apiConfig';

export interface PortfolioItem {
  _id?: string;
  id?: string;
  projectName: string;
  description?: string;
  projectUrl?: string | null;
  technologies: string[];
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface PortfolioResponse {
  success: boolean;
  data?: PortfolioItem[] | PortfolioItem;
  message?: string;
}

export const getMyPortfolioItems = async (): Promise<PortfolioItem[]> => {
  const response = await api.get<PortfolioResponse>('/portfolio/my');
  const payload = response.data?.data;

  if (!Array.isArray(payload)) return [];
  return payload;
};

export const createPortfolioItem = async (item: {
  projectName: string;
  description?: string;
  projectUrl?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
}): Promise<PortfolioItem> => {
  const response = await api.post<PortfolioResponse>('/portfolio', item);
  const payload = response.data?.data;

  if (!payload || Array.isArray(payload)) {
    throw new Error('Invalid portfolio create response');
  }

  return payload;
};

export const deletePortfolioItem = async (itemId: string): Promise<void> => {
  await api.delete(`/portfolio/${itemId}`);
};
