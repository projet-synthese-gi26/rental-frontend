import { defaultClient as client } from './api-client';

export const orgService = {
  getAllOrgs: () => client.get<any[]>('/api/org/all'),
  getOrgDetails: (id: string) => client.get<any>(`/api/org/${id}`),
  updateOrg: (id: string, data: any) => client.put<any>(`/api/org/${id}`, data),
  upgradePlan: (id: string, plan: 'FREE' | 'PRO' | 'ENTERPRISE') => 
    client.put<any>(`/api/org/${id}/subscription/upgrade`, { newPlan: plan }),
  updateOrgMultipart: (id: string, formData: FormData) => 
    client.put<any>(`/api/org/${id}/multipart`, formData),
  getSubscription: (id: string) => client.get<any>(`/api/org/${id}/subscription`),
  getSubscriptionRemaining: (id: string) => client.get<any>(`/api/org/${id}/subscription/remaining`),
  getOrgsByPlan: (planId: string) => client.get<any[]>(`/api/org/plan/${planId}`),
};