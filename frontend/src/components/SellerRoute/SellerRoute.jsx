import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SellerRoute = ({ children }) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext);

  console.log('SellerRoute - isLoggedIn:', isLoggedIn, 'user:', user, 'role:', user?.role);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400 mx-auto mb-4"></div>
          <p className="text-text-primary">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Seller rolü kontrolü - role string olarak geliyor
  if (!user || user.role !== 'SELLER') {
    console.log('SellerRoute - Yetkisiz erişim. User role:', user?.role);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-text-primary mb-4">Satıcı Paneli</h1>
          <p className="text-text-secondary mb-6">
            Bu sayfaya erişim için satıcı hesabına sahip olmalısınız.
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => window.history.back()}
              className="bg-accent-400 hover:bg-accent-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Geri Dön
            </button>
            <button 
              onClick={() => window.location.href = '/seller/register'}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors ml-2"
            >
              Satıcı Ol
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('SellerRoute - Erişim izni verildi');
  return children;
};

export default SellerRoute; 