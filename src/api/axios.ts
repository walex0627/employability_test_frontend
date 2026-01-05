import axios, { type InternalAxiosRequestConfig } from 'axios';

/**
 * Instancia de API con headers de seguridad.
 * IMPORTANTE: Verifica que VITE_API_URL en tu .env sea http://localhost:3000
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    // La API Key debe estar en tu archivo .env
    'x-api-key': import.meta.env.VITE_API_KEY 
  }
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;