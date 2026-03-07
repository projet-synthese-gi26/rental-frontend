import { defaultClient as client } from './api-client';

export const agencyService = {
  getAllAgencies: () => client.get<any[]>('/api/agencies/all'),
  getAgencies: (orgId: string) => client.get<any[]>(`/api/agencies/org/${orgId}`),
  createAgency: (orgId: string, data: any) => client.post<any>(`/api/agencies/org/${orgId}`, data),
  getAgencyDetails: (id: string) => client.get<any>(`/api/agencies/${id}/details`),
  updateAgency: (id: string, data: any) => client.put<any>(`/api/agencies/${id}`, data),
  deleteAgency: (id: string) => client.delete(`/api/agencies/${id}`),
  getAgencySearchResults: (query: string, city: string) => client.get<any[]>(`/api/agencies/search?keyword=${query}&city=${city}`),
};