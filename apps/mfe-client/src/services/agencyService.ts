import { Agency, AgencyReview } from '@/types/agencyType';
import { apiRequest } from './api';

// Mock data for agencies (fallback when API is not available)
export const mockAgencies: Agency[] = [
    {
        id: '1',
        name: 'EasyRent Headquarters',
        description: 'Notre agence principale située au coeur de Yaoundé, offrant une large gamme de véhicules pour tous vos besoins de déplacement.',
        address: '123 Avenue Kennedy',
        city: 'Yaoundé',
        region: 'Centre',
        phone: '+237 222 123 456',
        email: 'contact@easyrent-yaounde.cm',
        website: 'https://easyrent.cm',
        type: 'headquarters',
        rating: 4.8,
        reviewCount: 156,
        followerCount: 2340,
        isOpen: true,
        openingHours: {
            open: '08:00',
            close: '18:00',
            days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        },
        images: [
            '/client/images/agencies/agency-1-1.jpg',
            '/client/images/agencies/agency-1-1.jpg',
            '/client/images/agencies/agency-1-3.jpg',
        ],
        logo: '/client/images/agencies/logo-1.png',
        services: ['Livraison véhicule', 'Support 24/7', 'Assurance complète', 'Maintenance'],
        location: { lat: 3.8480, lng: 11.5021 },
        createdAt: '2020-01-15',
        orgId: 'org-1',
    },
    {
        id: '2',
        name: 'EasyRent Douala Central',
        description: 'Agence moderne avec une flotte de véhicules récents, idéalement placée pour vos déplacements professionnels.',
        address: '45 Boulevard de la Liberté',
        city: 'Douala',
        region: 'Littoral',
        phone: '+237 233 456 789',
        email: 'douala@easyrent.cm',
        type: 'branch',
        rating: 4.5,
        reviewCount: 98,
        followerCount: 1520,
        isOpen: true,
        openingHours: {
            open: '07:30',
            close: '19:00',
            days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        },
        images: [
            '/client/images/agencies/agency-2-1.jpg',
            '/client/images/agencies/agency-2-2.jpg',
        ],
        services: ['Livraison véhicule', 'Assurance', 'GPS inclus'],
        location: { lat: 4.0511, lng: 9.7679 },
        createdAt: '2021-06-20',
        orgId: 'org-1',
    },
    {
        id: '3',
        name: 'EasyRent Akwa',
        description: 'Située dans le quartier des affaires, notre agence Akwa vous propose un service premium et des véhicules haut de gamme.',
        address: '78 Rue Joss',
        city: 'Douala',
        region: 'Littoral',
        phone: '+237 233 789 012',
        email: 'akwa@easyrent.cm',
        type: 'branch',
        rating: 4.7,
        reviewCount: 72,
        followerCount: 890,
        isOpen: false,
        openingHours: {
            open: '08:00',
            close: '17:00',
            days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
        },
        images: [
            '/client/images/agencies/agency-3-1.jpg',
        ],
        services: ['Service VIP', 'Chauffeur disponible', 'Véhicules luxe'],
        location: { lat: 4.0483, lng: 9.6928 },
        createdAt: '2022-03-10',
        orgId: 'org-1',
    },
    {
        id: '4',
        name: 'EasyRent Bafoussam',
        description: 'L\'agence de référence dans l\'Ouest du Cameroun pour vos locations de véhicules.',
        address: '12 Rue du Marché',
        city: 'Bafoussam',
        region: 'Ouest',
        phone: '+237 244 123 456',
        email: 'bafoussam@easyrent.cm',
        type: 'branch',
        rating: 4.3,
        reviewCount: 45,
        followerCount: 560,
        isOpen: true,
        openingHours: {
            open: '08:00',
            close: '17:30',
            days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        },
        images: [
            '/client/images/agencies/agency-4-1.jpg',
        ],
        services: ['Livraison véhicule', 'Assurance'],
        location: { lat: 5.4764, lng: 10.4177 },
        createdAt: '2022-08-05',
        orgId: 'org-1',
    },
];

// Mock reviews
export const mockReviews: AgencyReview[] = [
    {
        id: 'r1',
        agencyId: '1',
        userId: 'u1',
        userName: 'Jean Dupont',
        userPhoto: '/client/images/users/user-1.jpg',
        rating: 5,
        comment: 'Excellent service! Véhicule impeccable et personnel très professionnel.',
        createdAt: '2024-01-15',
    },
    {
        id: 'r2',
        agencyId: '1',
        userId: 'u2',
        userName: 'Marie Nguema',
        rating: 4,
        comment: 'Bonne expérience globale. Le processus de location était simple et rapide.',
        createdAt: '2024-01-10',
    },
    {
        id: 'r3',
        agencyId: '2',
        userId: 'u3',
        userName: 'Paul Kamga',
        userPhoto: '/client/images/users/user-3.jpg',
        rating: 5,
        comment: 'Je recommande vivement! Prix compétitifs et voiture en parfait état.',
        createdAt: '2024-01-08',
    },
];

// Agency Service
export const agencyService = {
    // Get all agencies (tries API first, falls back to mock data)
    getAllAgencies: async (): Promise<Agency[]> => {
        try {
            // Try to fetch from API - Note: endpoint pattern from Backend_Routes.md
            // The API uses /api/agencies/org/{orgId} but we need all agencies for clients
            // For now, we'll use mock data and switch to API when available
            return new Promise((resolve) => {
                setTimeout(() => resolve(mockAgencies), 300);
            });
        } catch {
            console.warn('API not available, using mock data');
            return mockAgencies;
        }
    },

    // Get agency by ID
    getAgencyById: async (id: string): Promise<Agency | undefined> => {
        try {
            // Try API first
            const response = await apiRequest<Agency>(`/api/agencies/${id}`);
            return response;
        } catch {
            // Fallback to mock data
            return new Promise((resolve) => {
                setTimeout(() => {
                    const agency = mockAgencies.find((a) => a.id === id);
                    resolve(agency);
                }, 200);
            });
        }
    },

    // Get agencies by organization
    getAgenciesByOrg: async (orgId: string): Promise<Agency[]> => {
        try {
            const response = await apiRequest<Agency[]>(`/api/agencies/org/${orgId}`);
            return response;
        } catch {
            return mockAgencies.filter((a) => a.orgId === orgId);
        }
    },

    // Get agency reviews
    getAgencyReviews: async (agencyId: string): Promise<AgencyReview[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const reviews = mockReviews.filter((r) => r.agencyId === agencyId);
                resolve(reviews);
            }, 200);
        });
    },

    // Filter agencies
    filterAgencies: (
        agencies: Agency[],
        filters: {
            city?: string;
            minRating?: number;
            type?: 'headquarters' | 'branch' | 'all';
            isOpen?: boolean;
            search?: string;
        }
    ): Agency[] => {
        return agencies.filter((agency) => {
            if (filters.city && filters.city !== 'all' && agency.city !== filters.city) {
                return false;
            }
            if (filters.minRating && agency.rating < filters.minRating) {
                return false;
            }
            if (filters.type && filters.type !== 'all' && agency.type !== filters.type) {
                return false;
            }
            if (filters.isOpen !== undefined && agency.isOpen !== filters.isOpen) {
                return false;
            }
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                return (
                    agency.name.toLowerCase().includes(searchLower) ||
                    agency.city.toLowerCase().includes(searchLower) ||
                    agency.description.toLowerCase().includes(searchLower)
                );
            }
            return true;
        });
    },
};