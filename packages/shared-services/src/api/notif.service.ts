import { defaultClient as client } from './api-client';

export const notifService = {
  getOrgNotifications: (orgId: string) => client.get<any[]>(`/api/notifications/org/${orgId}`),
  getAgencyNotifications: (agencyId: string) => client.get<any[]>(`/api/notifications/agency/${agencyId}`),
  getClientNotifications: (clientId: string) => client.get<any[]>(`/api/notifications/client/${clientId}`),
  
  countUnreadOrg: (orgId: string) => client.get<number>(`/api/notifications/org/${orgId}/unread/count`),
  countUnreadAgency: (agencyId: string) => client.get<number>(`/api/notifications/agency/${agencyId}/unread/count`),
  countUnreadClient: (clientId: string) => client.get<number>(`/api/notifications/client/${clientId}/unread/count`),
  
  markAsRead: (id: string) => client.put<void>(`/api/notifications/${id}/read`, {}),
};