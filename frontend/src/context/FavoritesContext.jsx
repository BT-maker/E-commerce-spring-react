import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false); // Favoriler yüklendi mi?
  const { user, isLoggedIn } = useAuth();

  // Favorileri getir
  const fetchFavorites = async () => {
    console.log('fetchFavorites çağrıldı - isLoggedIn:', isLoggedIn);
    
    if (!isLoggedIn) {
      console.log('Kullanıcı giriş yapmamış, favoriler boş');
      setFavorites([]);
      setFavoritesLoaded(true);
      return;
    }

    // Eğer favoriler zaten yüklendiyse tekrar yükleme
    if (favoritesLoaded) return;

    // Backend offline ise favorileri yükleme
    if (window.BACKEND_OFFLINE) {
      console.log('Backend offline, favoriler yüklenmedi');
      setFavorites([]);
      setFavoritesLoaded(true);
      return;
    }

    setLoading(true);
    try {
      console.log('Favoriler yükleniyor...');
      const response = await api.get('/favorites', { withCredentials: true });
      console.log('Favoriler yüklendi:', response.data);
      setFavorites(response.data);
      setFavoritesLoaded(true);
    } catch (error) {
      console.error('Favoriler yüklenirken hata:', error);
      setFavorites([]);
      setFavoritesLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  // Favorilere ekle
  const addToFavorites = async (productId) => {
    if (!isLoggedIn) {
      toast.error('Favorilere eklemek için giriş yapmalısınız!');
      return;
    }

    try {
      console.log('Favorilere ekleme denemesi - ProductId:', productId);
      const response = await api.post(`/favorites/${productId}`, {}, { withCredentials: true });
      console.log('Favorilere ekleme response:', response.data);
      
      if (response.data) {
        // Backend'den dönen veriyi frontend formatına dönüştür
        const newFavorite = {
          id: response.data.id,
          createdAt: response.data.createdAt,
          product: response.data.product
        };
        
        console.log('Yeni favori objesi:', newFavorite);
        setFavorites(prev => [newFavorite, ...prev]);
        toast.success('Ürün favorilere eklendi!');
      } else {
        // Eğer response.data yoksa, favorileri yeniden yükle
        console.log('Response.data yok, favorileri yeniden yüklüyor...');
        setFavoritesLoaded(false); // Favorileri yeniden yüklemek için flag'i sıfırla
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

  // Favorilerden çıkar
  const removeFromFavorites = async (productId) => {
    try {
      console.log('Favorilerden çıkarma denemesi - ProductId:', productId);
      await api.delete(`/favorites/${productId}`, { withCredentials: true });
      console.log('Favorilerden çıkarma başarılı!');
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

  // Favori kontrolü
  const isFavorite = (productId) => {
    return favorites.some(fav => fav.product && fav.product.id === productId);
  };

  // Favori sayısı
  const getFavoriteCount = () => {
    return favorites.length;
  };

  // Kullanıcı değiştiğinde favorileri yeniden yükle
  useEffect(() => {
    console.log('FavoritesContext useEffect - isLoggedIn:', isLoggedIn, 'user:', user);
    
    // Kullanıcı çıkış yaptıysa favorileri temizle
    if (!isLoggedIn) {
      setFavorites([]);
      setFavoritesLoaded(false);
      return;
    }
    
    // Kullanıcı giriş yaptıysa ve favoriler yüklenmemişse yükle
    if (isLoggedIn && !favoritesLoaded) {
      fetchFavorites();
    }
  }, [isLoggedIn]); // Sadece isLoggedIn değiştiğinde çalışsın

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoriteCount,
    fetchFavorites
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