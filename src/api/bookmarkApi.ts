import api from '@/api/apiConfig';

export interface BookmarkRecord {
  _id?: string;
  id?: string;
  itemType?: string;
  itemId?: {
    _id?: string;
    title?: string;
    name?: string;
    company?: string;
    location?: string;
  } | null;
  createdAt?: string;
}

export const getUserBookmarks = async (): Promise<BookmarkRecord[]> => {
  const res = await api.get<{ data: BookmarkRecord[] }>('/bookmark');
  return res.data.data || [];
};

export const createBookmark = async (itemType: string, itemId: string) => {
  const res = await api.post<{ data: BookmarkRecord }>('/bookmark', { itemType, itemId });
  return res.data.data;
};

export const deleteBookmark = async (bookmarkId: string): Promise<void> => {
  await api.delete(`/bookmark/${bookmarkId}`);
};
