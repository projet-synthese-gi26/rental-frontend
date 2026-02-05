const API_BASE_URL = 'https://apirental5gi-v2.onrender.com';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token?: string;
  message?: string;
}

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Identifiants incorrects');
    }

    return result;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Erreur lors de l'inscription");
    }

    return result;
  },
};
