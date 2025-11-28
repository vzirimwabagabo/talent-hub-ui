// src/api/reviewApi.ts
import api from '@/api/apiConfig';
import { Review, ReviewFormData } from '@/types/review';

// Get reviews for a talent profile
export const getReviewsByTalent = async (talentId: string): Promise<Review[]> => {
  const res = await api.get<{ reviews: Review[] }>(`/reviews/talent/${talentId}`);
  return res.data.reviews;
};

// Submit a new review
export const createReview = async (talentId: string, data: ReviewFormData): Promise<Review> => {
  const res = await api.post<{ review: Review }>('/reviews', {
    talentProfile: talentId,
    ...data,
  });
  return res.data.review;
};
// Update a review
export const updateReview = async (reviewId: string,  ReviewFormData): Promise<Review> => {
  const res = await api.put<{ review: Review }>(`/reviews/${reviewId}`, data);
  return res.data.review;
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
  await api.delete(`/reviews/${reviewId}`);
};