import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // LocalStorage'dan tema tercihini al
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Sistem temasını kontrol et
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Tema değiştiğinde localStorage'a kaydet
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // HTML elementine tema class'ı ekle/çıkar
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const value = {
    isDark,
    toggleTheme,
    theme: isDark ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Bu context şu işlevleri sağlar:
 * 
 * 1. Tema Yönetimi: Açık/koyu tema durumunun global state yönetimi
 * 2. Tema Değiştirme: Tema arası geçiş işlemi
 * 3. LocalStorage: Kullanıcı tema tercihini localStorage'da saklama
 * 4. Sistem Teması: Sistem tema tercihini algılama
 * 5. CSS Class Yönetimi: HTML elementine tema class'ı ekleme/çıkarma
 * 6. Global State: Tüm uygulamada tema durumunu paylaşma
 * 7. Persistence: Sayfa yenilendiğinde tema tercihini koruma
 * 
 * Bu context sayesinde tema sistemi tüm uygulamada tutarlı şekilde çalışır!
 */ 