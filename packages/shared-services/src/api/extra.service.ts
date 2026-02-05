import { defaultClient as client } from './api-client';

export const extraService = {
  getPlans: () => client.get<any[]>('/api/subscriptions/plans'),
  updatePlanQuotas: (id: string, data: any) => client.put<any>(`/api/subscriptions/plans/${id}`, data),
  getPermissions: () => client.get<any[]>('/api/permissions'),
  uploadMedia: (formData: FormData) => client.post<any>('/api/media/upload', formData),
};