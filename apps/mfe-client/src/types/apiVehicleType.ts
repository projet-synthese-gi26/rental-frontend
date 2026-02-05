export interface ApiVehicle {
    id: string;
    agencyId: string;
    categoryId: string;
    licencePlate: string;
    vinNumber: string;
    brand: string;
    model: string;
    yearProduction: string;
    places: number;
    kilometrage: number;
    statut: string;
    color: string;
    transmission: string;
    functionalities: {
        air_condition: boolean;
        usb_input: boolean;
        seat_belt: boolean;
        audio_input: boolean;
        child_seat: boolean;
        bluetooth: boolean;
        sleeping_bed: boolean;
        onboard_computer: boolean;
        gps: boolean;
        luggage: boolean;
        water: boolean;
        additional_covers: boolean;
    };
    engineDetails: {
        type: string;
        horsepower: number;
        capacity: number;
    };
    fuelEfficiency: {
        city: string;
        highway: string;
    };
    insuranceDetails: {
        provider: string;
        policy_number: string;
        expiry: string;
    };
    description: string[];
    images: string[];
    pricing: {
        id: string;
        organizationId: string;
        resourceType: string;
        resourceId: string;
        pricePerHour: number;
        pricePerDay: number;
        currency: string;
        createdAt: string;
        updatedAt: string;
        newRecord: boolean;
        new: boolean;
    } | null;
}

export interface VehiclePricing {
    id: string;
    organizationId: string;
    resourceType: string;
    resourceId: string;
    pricePerHour: number;
    pricePerDay: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
    newRecord: boolean;
    new: boolean;
}

export interface VehicleReview {
    id: string;
    name: string;
    photo?: string;
    rating: number;
    comment: string;
    date?: string;
}

export interface VehicleDetailsResponse {
    vehicle: ApiVehicle;
    pricing: VehiclePricing | null;
    schedule: unknown[];
    rating: number;
    reviews: VehicleReview[];
    isDriverBookingRequired: boolean;
}

export interface ApiDriver {
    id: string;
    organizationId: string;
    agencyId: string;
    firstname: string;
    lastname: string;
    tel: string;
    age: number;
    gender: number;
    profilUrl: string;
    cniUrl: string;
    drivingLicenseUrl: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    pricing: VehiclePricing | null;
}

export interface VehicleCategory {
    id: string;
    organizationId: string;
    name: string;
    description: string;
    newRecord: boolean;
    new: boolean;
}
