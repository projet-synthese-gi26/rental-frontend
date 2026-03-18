import { defaultClient as client } from './api-client';

export const rentalService = {
  initiateRental: (data: any) => client.post<any>('/api/rentals/init', data),
  
  payRental: (id: string, data: { amount: number; method: 'MOMO' | 'OM' | 'CARD' | 'CASH' }) => 
    client.post<any>(`/api/rentals/${id}/pay`, data),
  
  startRental: (id: string) => client.put<any>(`/api/rentals/${id}/start`, {}),// For agency to confirm the start of the rental
  
  signalEnd: (id: string) => client.put<any>(`/api/rentals/${id}/end-signal`, {}),// For client to signal the end of the rental
  
  validateReturn: (id: string) => client.put<any>(`/api/rentals/${id}/validate-return`, {}), // For agency to confirm the return of the vehicle
  
  cancelRental: (id: string) => client.put<any>(`/api/rentals/${id}/cancel`, {}),// For client to cancel a reservation before it starts

  getOrgReservations: (orgId: string) => client.get<any[]>(`/api/rentals/org/${orgId}/reservations`),
  
  getOrgRentals: (orgId: string) => client.get<any[]>(`/api/rentals/org/${orgId}/rentals`),
  
  getAgencyReservations: (agencyId: string) => client.get<any[]>(`/api/rentals/agency/${agencyId}/reservations`),
  
  getAgencyRentals: (agencyId: string) => client.get<any[]>(`/api/rentals/agency/${agencyId}/rentals`),
  
  getClientActiveReservations: () => client.get<any[]>('/api/rentals/client/reservations/active'),
  
  getClientRentalsHistory: () => client.get<any[]>('/api/rentals/client/rentals/history'),

  getByAgency: (agencyId: string) => client.get<any[]>(`/api/rentals/agency/${agencyId}/rentals`),

  getRentalDetails: (id: string) => client.get<any[]>(`/api/rentals/${id}/details`),

};