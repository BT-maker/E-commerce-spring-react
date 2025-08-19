import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext);
  const location = useLocation();
  
  console.log('=== ADMIN ROUTE DEBUG ===');
  console.log('isLoggedIn:', isLoggedIn);
  console.log('loading:', loading);
  console.log('user:', user);
  console.log('user.role:', user?.role);
  console.log('location.pathname:', location.pathname);

  // Eğer zaten admin/login sayfasındaysak, AdminRoute'u bypass et
  if (location.pathname === '/admin/login') {
    return children;
  }

  // Loading durumunda loading göster
  if (loading) {
    console.log('Loading durumunda, loading component gösteriliyor');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400 mx-auto mb-4"></div>
          <p className="text-text-primary">Yükleniyor...</p>
          <p className="text-sm text-gray-500 mt-2">Auth kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  // Admin rolü kontrolü
  if (user && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-text-primary mb-4">Erişim Reddedildi</h1>
          <p className="text-text-secondary mb-6">
            Bu sayfaya erişim için admin yetkisine sahip olmalısınız.
          </p>
          <p className="text-sm text-red-500 mb-4">
            Mevcut rol: {user?.role || 'Rol bulunamadı'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-accent-400 hover:bg-accent-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;