import axios from 'axios';

// Buradan kolayca backend offline/online ayarlayabilirsin
const BACKEND_OFFLINE = false;

// API URL'n buradan ayarlanıyor
const API_BASE_URL = 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie'ler otomatik gönderilsin
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (BACKEND_OFFLINE) {
      console.log('Backend offline, istek engellendi:', config.url);
      return Promise.reject(new Error('Backend offline'));
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'Backend offline') {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      
      // Admin sayfalarından admin login'e yönlendir
      if (currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
      // Seller sayfalarından seller login'e yönlendir
      else if (currentPath.startsWith('/seller-panel')) {
        window.location.href = '/seller/login';
      }
      // Diğer korumalı sayfalardan normal login'e yönlendir
      else if (['/profile', '/orders'].some(route => currentPath.startsWith(route))) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;
