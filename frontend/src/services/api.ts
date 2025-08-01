import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Tüm isteklerde cookie gönderilsin
});

// Request interceptor to add auth token and check backend status
api.interceptors.request.use(
  (config) => {
    // Backend offline ise isteği engelle
    if (window.BACKEND_OFFLINE) {
      console.log('Backend offline, istek engellendi:', config.url);
      return Promise.reject(new Error('Backend offline'));
    }
    
    // Cookie tabanlı authentication kullandığımız için Authorization header'ı eklemeye gerek yok
    // withCredentials: true zaten cookie'leri otomatik gönderiyor
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Backend offline hatası ise sessizce geç
    if (error.message === 'Backend offline') {
      return Promise.reject(error);
    }
    
    // Sadece belirli sayfalarda 401 hatası alındığında yönlendirme yap
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const protectedRoutes = ['/profile', '/orders', '/admin', '/seller-panel'];
      
      // Eğer korumalı bir sayfadaysa yönlendirme yap
      if (protectedRoutes.some(route => currentPath.startsWith(route))) {
      window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { api };
export default api; 