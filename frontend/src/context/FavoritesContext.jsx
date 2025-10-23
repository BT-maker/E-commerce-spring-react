import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const FavoritesContext = createContext();

export { FavoritesContext };

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const { isLoggedIn, loading: authLoading } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (window.BACKEND_OFFLINE || !isLoggedIn) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get('/favorites', { withCredentials: true });
      setFavorites(response.data);
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]); // Depends on isLoggedIn

  useEffect(() => {
    // We wait for the authentication to be resolved
    if (!authLoading) {
      fetchFavorites();
    }
  }, [isLoggedIn, authLoading, fetchFavorites]);

  const addToFavorites = async (productId) => {
    if (!isLoggedIn) {
      toast.error('Favorilere eklemek için giriş yapmalısınız!');
      return;
    }

    try {
      const response = await api.post(`/favorites/${productId}`, {}, { withCredentials: true });
      
      if (response.data && response.data.product) {
        const newFavorite = {
          id: response.data.id,
          createdAt: response.data.createdAt,
          product: response.data.product
        };
        setFavorites(prev => [newFavorite, ...prev]);
        toast.success('Ürün favorilere eklendi!');
      } else {
        // Fallback to refetch all favorites if response is not as expected
        await fetchFavorites();
        toast.success('Ürün favorilere eklendi!');
      }
    } catch (error) {
      console.error('Favorilere ekleme hatası:', error);
      if (error.response?.status === 400) {
        toast.error('Bu ürün zaten favorilerinizde olabilir!');
      } else {
        toast.error('Favorilere eklenirken hata oluştu!');
      }
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      await api.delete(`/favorites/${productId}`, { withCredentials: true });
      setFavorites(prev => prev.filter(fav => fav.product && fav.product.id !== productId));
      toast.success('Ürün favorilerden çıkarıldı!');
    } catch (error) {
      console.error('Favorilerden çıkarma hatası:', error);
      if (error.response?.status === 400) {
        toast.error('Bu ürün favorilerinizde bulunamadı!');
      } else {
        toast.error('Favorilerden çıkarılırken hata oluştu!');
      }
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.product && fav.product.id === productId);
  };

  const getFavoriteCount = () => {
    return favorites.length;
  };

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteCount,
    fetchFavorites // Keep it for pull-to-refresh or manual refresh scenarios
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

/**
 * Bu context şu işlevleri sağlar:
 * 
 * 1. Favori Yönetimi: Kullanıcı favori ürünlerinin global state yönetimi
 * 2. Favori İşlemleri: Ürün ekleme, çıkarma ve kontrol işlemleri
 * 3. Backend Senkronizasyon: Favori verilerini backend ile senkronize etme
 * 4. Otomatik Güncelleme: Favori değişikliklerinde otomatik yenileme
 * 5. Loading States: Favori işlemleri sırasında loading durumu
 * 6. Toast Bildirimleri: Favori işlemleri için kullanıcı bildirimleri
 * 7. Global State: Tüm uygulamada favori durumunu paylaşma
 * 8. Authentication Kontrolü: Giriş yapmış kullanıcılar için favori sistemi
 * 
 * Bu context sayesinde favori işlemleri tüm uygulamada tutarlı şekilde çalışır!
 */