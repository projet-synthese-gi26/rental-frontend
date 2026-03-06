import { defaultClient as client } from './api-client';

/**
 * Service d'authentification centralisé
 * Utilise le proxy configuré pour éviter les blocages CORS sur Render
 */
export const authService = {
  getUserMe: () => client.get<any>('/auth/me'),
  getOrgUserMe: () => client.get<any>('/api/org/auth/me'),
  login: (data: any) => client.post<any>('/auth/login', data),
  registerOrg: (data: any) => client.post<any>('/auth/register/organizationOwner', data),
  registerClient: (data: any) => client.post<any>('/auth/register/client', data),
  refresh: () => client.post<any>('/auth/refresh', {}),
  setToken: (token: string) => client.setAuthToken(token),
  updateProfile: (data: any) => client.put<any>(`/api/users/profile?params=${data.id}`, data),
  updatePassword: (oldPassword: string, newPassword: string) => client.put<any>(`/api/users/password`, { oldPassword, newPassword })  
};