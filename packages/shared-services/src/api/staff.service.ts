import { defaultClient as client } from './api-client';

export const staffService = {
  // staff
  getStaffByOrg: (orgId: string) => client.get<any[]>(`/api/staff/org/${orgId}`),
  addStaff: (orgId: string, data: any) => client.post<any>(`/api/staff/org/${orgId}`, data),
  getStaffByAgency: (agencyId: string) => client.get<any[]>(`/api/staff/agency/${agencyId}`),
  getStaffDetails: (id: string) => client.get<any>(`/api/staff/${id}`),
  updateStaff: (id: string, data: any) => client.put<any>(`/api/staff/${id}`, data),
  deleteStaff: (id: string) => client.delete(`/api/staff/${id}`),

  // postes
  getPostes: (orgId: string) => client.get<any[]>(`/api/postes/org/${orgId}/postes`),
  createPoste: (orgId: string, data: any) => client.post<any>(`/api/postes/org/${orgId}/poste`, data),
  updatePoste: (id: string, data: any) => client.put<any>(`/api/postes/${id}`, data),
};