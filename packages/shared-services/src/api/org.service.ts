import { defaultClient as client } from './api-client';

/**
 * Service centralisé pour l'API Rental
 * Classé par catégories selon le Swagger
 */
export const orgService = {
  
  // ================================================
  // 1. AUTHENTICATION (auth-controller)
  // ================================================
  getMe: () => client.get<any>('/api/org/auth/me'),
  login: (data: any) => client.post<any>('/auth/login', data),
  registerOrg: (data: any) => client.post<any>('/auth/register/organizationOwner', data),
  registerClient: (data: any) => client.post<any>('/auth/register/client', data),
  refresh: () => client.post<any>('/auth/refresh', {}),
  
  // Méthode utilitaire pour le token
  setToken: (token: string) => client.setAuthToken(token),

  // ================================================
  // 2. ORGANIZATION MANAGEMENT
  // ================================================
  /** Lister toutes les organisations (Admin) */
  getAllOrgs: () => client.get<any[]>('/api/org/all'),
  
  /** Obtenir les détails d'une organisation */
  getOrgDetails: (id: string) => client.get<any>(`/api/org/${id}`),
  
  /** Mettre à jour une organisation (JSON) */
  updateOrg: (id: string, data: any) => client.put<any>(`/api/org/${id}`, data),
  
  /** Upgrade du plan de l'organisation */
  upgradePlan: (id: string, plan: 'FREE' | 'PRO' | 'ENTERPRISE') => 
    client.put<any>(`/api/org/${id}/subscription/upgrade`, { newPlan: plan }),
  
  /** Mettre à jour une organisation (Multipart/Fichiers) */
  updateOrgMultipart: (id: string, formData: FormData) => 
    client.put<any>(`/api/org/${id}/multipart`, formData),
  
  /** Statut de l'abonnement de l'organisation */
  getSubscription: (id: string) => client.get<any>(`/api/org/${id}/subscription`),
  
  /** Temps restant avant expiration */
  getSubscriptionRemaining: (id: string) => client.get<any>(`/api/org/${id}/subscription/remaining`),
  
  /** Lister les organisations par ID de plan */
  getOrgsByPlan: (planId: string) => client.get<any[]>(`/api/org/plan/${planId}`),

  // ================================================
  // 3. AGENCY MANAGEMENT
  // ================================================
  /** Lister les agences d'une organisation (Résout ton TypeError) */
  getAgencies: (orgId: string) => client.get<any[]>(`/api/agencies/org/${orgId}`),
  
  /** Créer une nouvelle agence pour une organisation */
  createAgency: (orgId: string, data: any) => client.post<any>(`/api/agencies/org/${orgId}`, data),
  
  /** Obtenir les détails d'une agence */
  getAgencyDetails: (id: string) => client.get<any>(`/api/agencies/${id}`),
  
  /** Modifier une agence */
  updateAgency: (id: string, data: any) => client.put<any>(`/api/agencies/${id}`, data),
  
  /** Supprimer une agence */
  deleteAgency: (id: string) => client.delete(`/api/agencies/${id}`),

  // ================================================
  // 4. POSTE & ROLES
  // ================================================
  /** Lister les postes d'une organisation */
  getPostes: (orgId: string) => client.get<any[]>(`/api/postes/org/${orgId}/postes`),
  
  /** Créer un nouveau poste avec permissions */
  createPoste: (orgId: string, data: any) => client.post<any>(`/api/postes/org/${orgId}/poste`, data),
  
  /** Mettre à jour un poste */
  updatePoste: (id: string, data: any) => client.put<any>(`/api/postes/${id}`, data),

  // ================================================
  // 5. STAFF MANAGEMENT
  // ================================================
  /** Lister tout le staff d'une organisation */
  getStaffByOrg: (orgId: string) => client.get<any[]>(`/api/staff/org/${orgId}`),
  
  /** Ajouter un membre au staff */
  addStaff: (orgId: string, data: any) => client.post<any>(`/api/staff/org/${orgId}`, data),
  
  /** Lister le staff d'une agence */
  getStaffByAgency: (agencyId: string) => client.get<any[]>(`/api/staff/agency/${agencyId}`),
  
  /** Obtenir les détails d'un membre du staff */
  getStaffDetails: (id: string) => client.get<any>(`/api/staff/${id}`),
  
  /** Modifier un membre du staff */
  updateStaff: (id: string, data: any) => client.put<any>(`/api/staff/${id}`, data),
  
  /** Supprimer un membre du staff */
  deleteStaff: (id: string) => client.delete(`/api/staff/${id}`),

  // ================================================
  // 6. SUBSCRIPTION CATALOG
  // ================================================
  /** Lister tous les plans du catalogue */
  getPlans: () => client.get<any[]>('/api/subscriptions/plans'),
  
  /** Mettre à jour les quotas d'un plan (Admin) */
  updatePlanQuotas: (id: string, data: any) => client.put<any>(`/api/subscriptions/plans/${id}`, data),

  // ================================================
  // 7. PERMISSIONS METADATA
  // ================================================
  /** Lister toutes les permissions disponibles */
  getPermissions: () => client.get<any[]>('/api/permissions'),

  // ================================================
  // 8. MEDIA MANAGEMENT
  // ================================================
  /** Upload d'un fichier */
  uploadMedia: (formData: FormData) => client.post<any>('/api/media/upload', formData),

  // ================================================
  // 4. VEHICLE MANAGEMENT
  // ================================================
  /** Lister tous les véhicules d'une organisation */
  getVehiclesByOrg: (orgId: string) => client.get<any[]>(`/api/vehicles/org/${orgId}`),
  
  /** Lister les véhicules d'une agence spécifique */
  getVehiclesByAgency: (agencyId: string) => client.get<any[]>(`/api/vehicles/agency/${agencyId}`),
  
  /** Ajouter un véhicule à la flotte d'une organisation */
  createVehicle: (orgId: string, data: any) => client.post<any>(`/api/vehicles/org/${orgId}`, data),
  
  /** Obtenir les détails d'un véhicule */
  getVehicleDetails: (id: string) => client.get<any>(`/api/vehicles/${id}`),
  
  /** Mettre à jour les informations d'un véhicule */
  updateVehicle: (id: string, data: any) => client.put<any>(`/api/vehicles/${id}`, data),
  
  /** Changer le statut du véhicule (MAINTENANCE, AVAILABLE, RENTED) */
  updateVehicleStatus: (id: string, status: string) => 
    client.patch<any>(`/api/vehicles/${id}/status?status=${status}`, {}),
  
  /** Supprimer un véhicule */
  deleteVehicle: (id: string) => client.delete(`/api/vehicles/${id}`),

  // ================================================
  // 5. VEHICLE CATEGORIES
  // ================================================
  /** Lister les catégories de véhicules d'une organisation */
  getVehicleCategories: (orgId: string) => client.get<any[]>(`/api/vehicles/categories/org/${orgId}`),
  
  /** Créer une nouvelle catégorie */
  createCategory: (orgId: string, data: any) => client.post<any>(`/api/vehicles/categories/org/${orgId}`, data),
  
  /** Mettre à jour une catégorie */
  updateCategory: (id: string, data: any) => client.put<any>(`/api/vehicles/categories/${id}`, data),
  
  /** Supprimer une catégorie */
  deleteCategory: (id: string) => client.delete(`/api/vehicles/categories/${id}`),
};