// API Configuration for connecting to the backend
const API_BASE_URL = 'https://apirental5gi.onrender.com';

// Token management
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
    if (token) {
        localStorage.setItem('accessToken', token);
    } else {
        localStorage.removeItem('accessToken');
    }
};

export const getAccessToken = (): string | null => {
    if (!accessToken && typeof window !== 'undefined') {
        accessToken = localStorage.getItem('accessToken');
    }
    return accessToken;
};

// API request helper
export const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    const token = getAccessToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
};

// Auth API
export const authApi = {
    login: async (email: string, password: string) => {
        const response = await apiRequest<{
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                role: string;
            };
        }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        setAccessToken(response.accessToken);
        return response;
    },

    register: async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }) => {
        return apiRequest('/auth/register/client', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getCurrentUser: async () => {
        return apiRequest<{
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
            phone: string;
        }>('/auth/me');
    },

    refresh: async () => {
        return apiRequest<{ accessToken: string }>('/auth/refresh', {
            method: 'POST',
        });
    },

    logout: () => {
        setAccessToken(null);
    },
};

export { API_BASE_URL };