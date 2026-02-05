export interface Agency {
    id: string;
    name: string;
    description: string;
    address: string;
    city: string;
    region: string;
    phone: string;
    email: string;
    website?: string;
    type: 'headquarters' | 'branch';
    rating: number;
    reviewCount: number;
    followerCount: number;
    isOpen: boolean;
    openingHours: {
        open: string;
        close: string;
        days: string[];
    };
    images: string[];
    logo?: string;
    services: string[];
    location: {
        lat: number;
        lng: number;
    };
    createdAt: string;
    orgId: string;
}

export interface AgencyReview {
    id: string;
    agencyId: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    rating: number;
    comment: string;
    createdAt: string;
}