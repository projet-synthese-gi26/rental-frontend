import { defaultClient as client } from './api-client';

export const driverService = {
  getDriversByAgency: (agencyId: string) => client.get<any[]>(`/api/drivers/agency/${agencyId}`),
  createDriver: (orgId: string, formData: FormData) => client.post<any>(`/api/drivers/org/${orgId}`, formData),
  deleteDriver: (id: string) => client.delete(`/api/drivers/${id}`),
  updateDriverStatusAndPricing: (id: string, data: any) => client.patch<any>(`/api/drivers/${id}/status-pricing`, data),
  getDriverDetails: (id: string) => client.get<any>(`/api/drivers/${id}/details`),
  getAvailableDrivers: (agencyId: string, start: string, end: string) => 
    client.get<any[]>(`/api/vehicles/drivers/available?agencyId=${agencyId}&startDate=${start}&endDate=${end}`),
};