import { api, toErrorMessage } from './client';

export async function getNotifications() {
  try {
    const { data } = await api.get('/api/notifications');
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function markAsRead(notificationId) {
  try {
    await api.post(`/api/notifications/${notificationId}/read`);
    return true;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}

export async function getUnreadCount() {
  try {
    const { data } = await api.get('/api/notifications/unread-count');
    return data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
}


