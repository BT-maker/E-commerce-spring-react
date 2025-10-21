import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import api from "../services/api";
import webSocketService from "../services/webSocketService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/me', { withCredentials: true });
      if (response.data) {
        setIsLoggedIn(true);
        setUser(response.data);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = document.cookie.includes('jwt_token=');
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [checkAuth]);

  const login = useCallback(async (userData = null) => {
    if (userData) {
      const user = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        email: userData.email || null
      };
      setIsLoggedIn(true);
      setUser(user);
      setLoading(false);
      
      const token = getCookie('jwt_token');
      if (token) {
        webSocketService.connect(token);
      }
    } else {
      await checkAuth();
    }
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout hatası:', error);
    }
    
    webSocketService.disconnect();
    
    setIsLoggedIn(false);
    setUser(null);
    setLoading(false);
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await api.put('/auth/me', profileData, { withCredentials: true });
      
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
      
      return { success: true, message: response.data?.message || "Profil başarıyla güncellendi" };
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      return { success: false, message: error.response?.data || "Sunucu hatası" };
    }
  }, []);

  const authContextValue = useMemo(() => ({
    isLoggedIn,
    user,
    login,
    logout,
    loading,
    updateProfile
  }), [isLoggedIn, user, loading, login, logout, updateProfile]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

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

import { useContext } from "react";
export const useAuth = () => useContext(AuthContext);