// src/api/donationApi.ts
import api from '@/api/apiConfig';

export interface Donation {
  _id?: string;
  id?: string;
  amount: number;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

// ✅ Fetch current user's donations → use '/donations/me'
export const getDonations = async (): Promise<Donation[]> => {
  const res = await api.get<{ donations: Donation[] }>('/donations/me');
  return res.data.donations;
};

// ✅ Create donation → '/donations' is correct
export const createDonation = async (data: { amount: number; description?: string }) => {
  const res = await api.post<{ donation: Donation }>('/donations', data);
  return res.data.donation;
};