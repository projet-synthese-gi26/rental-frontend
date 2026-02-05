import { ApiVehicle, ApiDriver, VehicleCategory, VehicleDetailsResponse } from '@/types/apiVehicleType';

const API_BASE_URL = 'https://apirental5gi-v2.onrender.com';

export const catalogService = {
    getAvailableVehicles: async (): Promise<ApiVehicle[]> => {
        const response = await fetch(`${API_BASE_URL}/api/vehicles/available`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    },

    getVehicleDetails: async (id: string): Promise<VehicleDetailsResponse> => {
        const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}/details`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    getAvailableDrivers: async (agencyId: string, startDate: string, endDate: string): Promise<ApiDriver[]> => {
        const params = new URLSearchParams({
            agencyId,
            startDate,
            endDate,
        });
        const response = await fetch(`${API_BASE_URL}/api/vehicles/drivers/available?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    },

    getAllCategories: async (): Promise<VehicleCategory[]> => {
        const response = await fetch(`${API_BASE_URL}/api/vehicles/categories/all`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    },
};
