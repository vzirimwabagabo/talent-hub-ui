// src/types/review.ts
export interface Review {
  id: string;
  talentProfile: string;
  reviewer: {
    id: string;
    name: string;
  };
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}