  // src/services/authService.ts
  import { api } from './api';
  import { User } from '../types';

  export interface LoginCredentials {
    email: string;
    password: string;
  }

  export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
  }

  export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
  }

  export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      if (response.success && response.token) {
        api.setToken(response.token);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    },

    signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/signup', credentials);
      
      if (response.success && response.token) {
        api.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    },

    // ✅ REPLACED getMe function with error handling:
    getMe: async (): Promise<{ success: boolean; user: User }> => {
      try {
        return await api.get<{ success: boolean; user: User }>('/auth/me');
      } catch (error: any) {
        if (error.message?.includes('expired') || error.message?.includes('Invalid token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth:expired'));  // Optional: notify app
        }
        throw error;
      }
    },

    logout: (): void => {
      api.clearToken();
    },

    isAuthenticated: (): boolean => api.isAuthenticated(),
    
    getStoredUser: (): User | null => {
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      }
      return null;
    },
  };