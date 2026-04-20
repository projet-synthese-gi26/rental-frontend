export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: { baseUrl: string }) {
    this.baseUrl = config.baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token.trim()}`;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    // 1. Construction de l'URL
    // Si l'endpoint commence par /, on l'enlève pour éviter les doubles slashs
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const url = `${this.baseUrl}/${cleanEndpoint}`;

    // 2. Récupération dynamique du token
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    const requestHeaders: Record<string, string> = { 
      ...this.headers,
      'Accept': '*/*', // Aligné sur Swagger
    };

    if (token) {
      console.log('Adding auth token to request:', token);
      requestHeaders['Authorization'] = `Bearer ${token.trim()}`;
    }

    let body: any;
    if (data instanceof FormData) {
      delete requestHeaders['Content-Type'];
      body = data; 
    } else if (data) {
      body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body,
      });

      if (response.status === 204) return { data: {} as T, status: 204, ok: true };

      const responseData = await response.json().catch(() => null);

      return {
        data: responseData,
        status: response.status,
        ok: response.ok,
      };
    } catch (error) {
      console.error(`[API Error] ${method} ${url}:`, error);
      return { data: null as any, status: 0, ok: false };
    }
  }

  async get<T>(e: string) { return this.request<T>('GET', e); }
  async post<T>(e: string, d: unknown) { return this.request<T>('POST', e, d); }
  async put<T>(e: string, d: unknown) { return this.request<T>('PUT', e, d); }
  async patch<T>(e: string, d: unknown) { return this.request<T>('PATCH', e, d); }
  async delete<T>(e: string) { return this.request<T>('DELETE', e); }
}

/**
 * Détecte si on est sur /agency ou /organisation pour taper le bon proxy local
 */
const getDynamicBaseUrl = () => {
  if (typeof window === 'undefined') return process.env.NEXT_PUBLIC_API_URL ; //'https://apirental5gi-v2.onrender.com';
  
  const path = window.location.pathname;
  if (path.startsWith('/client')) return '/client/api-rental';
  if (path.startsWith('/agency')) return '/agency/api-rental';
  if (path.startsWith('/organisation')) return '/organisation/api-rental';
  
  return '/api-rental';
};

export const defaultClient = new ApiClient({
  baseUrl: getDynamicBaseUrl()
});

/**
 * Fonction utilitaire pour créer de nouvelles instances si nécessaire
 */
export function createApiClient(baseUrl: string): ApiClient {
  return new ApiClient({ baseUrl });
}