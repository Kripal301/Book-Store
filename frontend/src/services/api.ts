// src/services/api.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};


// Build headers with optional auth token
const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      // ✅ Critical: "Bearer " + space + token
      headers['Authorization'] = `Bearer ${token}`;
      console.log('🔍 API: Authorization header set');  // Optional debug
    } else {
      console.log('🔍 API: No token found in localStorage');  // Optional debug
    }
  }
  
  return headers;
};

// Handle API response with error parsing
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Generic request wrapper
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(true),  
      ...options.headers,
    },
  };


  try {
    const response = await fetch(url, config);
    return await handleResponse<T>(response);
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
};



export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) => 
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) => 
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => 
    request<T>(endpoint, { method: 'DELETE' }),
  
  // Auth helpers
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  
  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  isAuthenticated: (): boolean => !!getAuthToken(),
  
  getToken: (): string | null => getAuthToken(),
};