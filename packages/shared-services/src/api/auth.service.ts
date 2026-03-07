// FILE: packages/shared-services/src/api/auth.service.ts
import { defaultClient as client } from './api-client';

export const authService = {
  getUserMe: () => client.get<any>('/auth/me'),
  getOrgUserMe: () => client.get<any>('/api/org/auth/me'),
  login: (data: any) => client.post<any>('/auth/login', data),
  registerOrg: (data: any) => client.post<any>('/auth/register/organizationOwner', data),
  registerClient: (data: any) => client.post<any>('/auth/register/client', data),
  refresh: () => client.post<any>('/auth/refresh', {}),
  setToken: (token: string) => client.setAuthToken(token),
  updateProfile: (data: any) => client.put<any>('/api/users/profile', data),
  updatePassword: (data: any) => client.put<any>('/api/users/password', data),
};