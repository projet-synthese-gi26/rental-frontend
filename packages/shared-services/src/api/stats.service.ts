import { defaultClient as client } from './api-client';

export const statsService = {
  getOrgReport: (orgId: string, year?: number) => 
    client.get<any>(`/api/stats/org/${orgId}/report${year ? `?year=${year}` : ''}`),
    
  getOrgDashboard: (orgId: string, year?: number) => 
    client.get<any>(`/api/stats/org/${orgId}/dashboard${year ? `?year=${year}` : ''}`),

  getAgencyReport: (agencyId: string, year?: number, month?: number) => 
    client.get<any>(`/api/stats/agency/${agencyId}/report?year=${year}&month=${month}`),

  getAgencyDashboard: (agencyId: string, year?: number) => 
    client.get<any>(`/api/stats/agency/${agencyId}/dashboard${year ? `?year=${year}` : ''}`),

  getAgencyDetailedReport: (agencyId: string, year?: number, month?: number) => 
    client.get<any>(`/api/stats/agency/${agencyId}/report?year=${year}&month=${month}`),
};