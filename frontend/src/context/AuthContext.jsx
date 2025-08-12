import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

      const checkAuth = async () => {
        console.log('Auth kontrol ediliyor...');
    
    // Backend offline ise auth kontrolü yapma
    if (window.BACKEND_OFFLINE) {
      console.log('Backend offline, auth kontrolü atlandı');
      setIsLoggedIn(false);
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
        const response = await api.get('/auth/me', { withCredentials: true });
      console.log('Auth başarılı:', response.data);
        setIsLoggedIn(true);
        setUser(response.data);
      } catch (error) {
      console.log('Auth hatası:', error.response?.status, error.response?.data);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    checkAuth();
  }, []); // Sadece component mount olduğunda çalışsın

  const login = async (userData = null) => {
    console.log('Login fonksiyonu çağrıldı, userData:', userData);
    if (userData) {
      // Eğer user data verilmişse direkt set et
      console.log('User data ile login yapılıyor:', userData);
      setIsLoggedIn(true);
      setUser(userData);
      setLoading(false);
      console.log('Login state güncellendi - isLoggedIn: true, user:', userData);
      
      // Seller login için checkAuth çağırma, direkt user data kullan
      console.log('Seller login - checkAuth atlandı, direkt user data kullanılıyor');
    } else {
      // Verilmemişse auth kontrolü yap
      console.log('User data yok, auth kontrolü yapılıyor');
      await checkAuth();
    }
    };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.log('Logout hatası:', error);
    }
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    setLoading(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/me', profileData, { withCredentials: true });
      setUser(response.data); // Direkt user'ı güncelle, checkAuth çağırma
      return { success: true };
    } catch (error) {
      console.log('Profil güncelleme hatası:', error);
      return { success: false, message: error.response?.data || "Sunucu hatası" };
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

import { useContext } from "react";
export const useAuth = () => useContext(AuthContext);

/**
 * Bu context şu işlevleri sağlar:
 * 
 * 1. Kullanıcı Authentication: Kullanıcı giriş/çıkış durumu yönetimi
 * 2. Kullanıcı Bilgileri: Giriş yapmış kullanıcının bilgilerini saklama
 * 3. Otomatik Kontrol: Sayfa yüklendiğinde otomatik authentication kontrolü
 * 4. Login/Logout: Kullanıcı giriş ve çıkış işlemleri
 * 5. Profil Güncelleme: Kullanıcı profil bilgilerini güncelleme
 * 6. Loading States: Authentication işlemleri sırasında loading durumu
 * 7. Global State: Tüm uygulamada kullanıcı durumunu paylaşma
 * 
 * Bu context sayesinde kullanıcı authentication sistemi tüm uygulamada tutarlı şekilde çalışır!
 */