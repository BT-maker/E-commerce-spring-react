import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    console.log('=== CHECK AUTH BAŞLADI ===');
    setLoading(true);

    try {
      console.log('API isteği gönderiliyor...');
      const response = await api.get('/auth/me', { withCredentials: true });
      console.log('API response:', response.data);
      
      if (response.data) {
        console.log('Kullanıcı bulundu, login yapılıyor...');
        setIsLoggedIn(true);
        setUser(response.data);
      } else {
        console.log('Kullanıcı bulunamadı');
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.log('Auth check hatası:', error.response?.status, error.response?.data);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      console.log('Loading false yapılıyor');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('=== AUTH CONTEXT USEEFFECT ===');
    console.log('Cookie kontrolü:', document.cookie.includes('jwt_token='));
    console.log('Tüm cookie\'ler:', document.cookie);
    
    // Sadece sayfa ilk yüklendiğinde kontrol et, sürekli kontrol etme
    const token = document.cookie.includes('jwt_token=');
    if (token) {
      console.log('Token bulundu, checkAuth çağrılıyor...');
      checkAuth();
    } else {
      console.log('Token bulunamadı, loading false yapılıyor');
      setLoading(false);
    }
  }, []);

  const login = async (userData = null) => {
    console.log('=== LOGIN FONKSİYONU ===');
    console.log('userData:', userData);
    
    if (userData) {
      // Backend'den gelen AuthResponse'u user objesine dönüştür
      const user = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        email: userData.email || null
      };
      console.log('Oluşturulan user objesi:', user);
      setIsLoggedIn(true);
      setUser(user);
      setLoading(false);
    } else {
      console.log('userData yok, checkAuth çağrılıyor...');
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