import axios from 'axios';
import router from '../utils/router';

const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const api = axios.create({
  baseURL: apiBase ? `${apiBase}` : 'http://localhost:4500/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      try {
        router.navigate('/login');
      } catch {}
    }
    return Promise.reject(error);
  }
);

export default api;