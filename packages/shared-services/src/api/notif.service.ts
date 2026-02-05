import { defaultClient as client } from './api-client';

export const notifService = {
  getNotificationsByClient: (clientId: string) => client.get<any[]>(`/api/notifications/client/${clientId}`),
  getUnreadNotificationsCount: (clientId: string) => client.get<number>(`/api/notifications/client/${clientId}/unread/count`),
  markNotificationAsRead: (id: string) => client.put<any>(`/api/notifications/${id}/read`, {}),
};