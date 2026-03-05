import { defaultClient as client } from './api-client';

export const rentalService = {
  initiateRental: (data: any) => client.post<any>('/api/rentals/init', data),
  
  payRental: (id: string, data: { amount: number; method: 'MOMO' | 'OM' | 'CARD' | 'CASH' }) => 
    client.post<any>(`/api/rentals/${id}/pay`, data),
  
  startRental: (id: string) => client.put<any>(`/api/rentals/${id}/start`, {}),
  
  signalEnd: (id: string) => client.put<any>(`/api/rentals/${id}/end-signal`, {}),
  
  validateReturn: (id: string) => client.put<any>(`/api/rentals/${id}/validate-return`, {}),
  
  cancelRental: (id: string) => client.put<any>(`/api/rentals/${id}/cancel`, {}),

  getOrgReservations: (orgId: string) => client.get<any[]>(`/api/rentals/org/${orgId}/reservations`),
  
  getOrgRentals: (orgId: string) => client.get<any[]>(`/api/rentals/org/${orgId}/rentals`),
  
  getAgencyReservations: (agencyId: string) => client.get<any[]>(`/api/rentals/agency/${agencyId}/reservations`),
  
  getAgencyRentals: (agencyId: string) => client.get<any[]>(`/api/rentals/agency/${agencyId}/rentals`),
  
  getClientActiveReservations: () => client.get<any[]>('/api/rentals/client/reservations/active'),
  
  getClientRentalsHistory: () => client.get<any[]>('/api/rentals/client/rentals/history'),

  getRentalDetails: (id: string) => client.get<any>(`/api/rentals/${id}/details`),
};