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
      console.log('Email kontrolü:', response.data.email);
      console.log('FirstName kontrolü:', response.data.firstName);
      console.log('LastName kontrolü:', response.data.lastName);
        setIsLoggedIn(true);
        setUser(response.data);
      } catch (error) {
        // 401 hatası normal bir durum (kullanıcı giriş yapmamış)
        if (error.response?.status === 401) {
          console.log('Kullanıcı giriş yapmamış (normal durum)');
        } else {
          console.log('Auth hatası:', error.response?.status, error.response?.data);
        }
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    // Her zaman auth kontrolü yap (cookie'den token okunacak)
    checkAuth();
  }, []); // Sadece component mount olduğunda çalışsın

  const login = async (userData = null) => {
    console.log('Login fonksiyonu çağrıldı, userData:', userData);
    if (userData) {
      // Backend'den gelen veriyi doğru formata çevir
      const formattedUserData = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        phone: userData.phone,
        birthDate: userData.birthDate,
        address1: userData.address1,
        address2: userData.address2
      };
      
      console.log('User data ile login yapılıyor:', formattedUserData);
      setIsLoggedIn(true);
      setUser(formattedUserData);
      setLoading(false);
      console.log('Login state güncellendi - isLoggedIn: true, user:', formattedUserData);
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
    setIsLoggedIn(false);
    setUser(null);
    setLoading(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/me', profileData, { withCredentials: true });
      
      // Güncellenmiş kullanıcı bilgilerini state'e kaydet
      if (response.data && response.data.user) {
        setUser(response.data.user);
        console.log('Kullanıcı bilgileri güncellendi:', response.data.user);
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