import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);

    try {
      const response = await api.get('/auth/me', { withCredentials: true });
      setIsLoggedIn(true);
      setUser(response.data);
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (userData = null) => {
    if (userData) {
      setIsLoggedIn(true);
      setUser(userData);
      setLoading(false);
    } else {
      await checkAuth();
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.log('Logout hatası:', error);
    }
    setIsLoggedIn(false);
    setUser(null);
    setLoading(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/me', profileData, { withCredentials: true });
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
      
      return { success: true, message: response.data?.message || "Profil başarıyla güncellendi" };
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