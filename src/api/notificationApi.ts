import api from '@/api/apiConfig';

export interface NotificationRecord {
  _id?: string;
  id?: string;
  type?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
  link?: string;
}

export const getMyNotifications = async (): Promise<NotificationRecord[]> => {
  const res = await api.get<{ data: NotificationRecord[] }>('/notification/me');
  return res.data.data || [];
};

export const markNotificationRead = async (notificationId: string): Promise<NotificationRecord> => {
  const res = await api.put<{ data: NotificationRecord }>(`/notification/${notificationId}/read`);
  return res.data.data;
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  await api.delete(`/notification/${notificationId}`);
};
