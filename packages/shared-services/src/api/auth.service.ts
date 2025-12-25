import { createApiClient } from './api-client';

const API_URL = 'https://apirental5gi.onrender.com';
const client = createApiClient(API_URL);

export const authService = {
  // Connexion
  login: (data: any) => client.post<any>('/auth/login', data),

  // Inscription Client
  registerClient: (data: any) => client.post<any>('/auth/register/client', data),

  // Inscription Organisation
  registerOrg: (data: any) => client.post<any>('/auth/register/organizationOwner', data),
};