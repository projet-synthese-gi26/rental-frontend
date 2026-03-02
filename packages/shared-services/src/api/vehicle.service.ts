import { defaultClient as client } from './api-client';

export const vehicleService = {
  // vehicles
  getAvailableVehicles: () => client.get<any[]>('/api/vehicles/available'),
  getVehiclesByOrg: (orgId: string) => client.get<any[]>(`/api/vehicles/org/${orgId}`),
  getVehiclesByAgency: (agencyId: string) => client.get<any[]>(`/api/vehicles/agency/${agencyId}`),
  getVehicleDetails: (id: string) => client.get<any>(`/api/vehicles/${id}/details`),
  createVehicle: (orgId: string, data: any) => client.post<any>(`/api/vehicles/org/${orgId}`, data),
  updateVehicle: (id: string, data: any) => client.put<any>(`/api/vehicles/${id}`, data),
  updateVehicleStatus: (id: string, status: string) => 
    client.patch<any>(`/api/vehicles/${id}/status?status=${status}`, {}),
  deleteVehicle: (id: string) => client.delete(`/api/vehicles/${id}`),
  updateVehicleStatusAndPricing: (id: string, data: any) => client.put<any>(`/api/vehicles/${id}/status-pricing`, data),

  // categories
  getVehicleCategories: (orgId: string) => client.get<any[]>(`/api/vehicles/categories/org/${orgId}`),
  getAllCategories: () => client.get<any[]>('/api/vehicles/categories/all'),
  createCategory: (orgId: string, data: any) => client.post<any>(`/api/vehicles/categories/org/${orgId}`, data),
  updateCategory: (id: string, data: any) => client.put<any>(`/api/vehicles/categories/${id}`, data),
  deleteCategory: (id: string) => client.delete(`/api/vehicles/categories/${id}`),
};