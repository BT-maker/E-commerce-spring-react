import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      title={isDark ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'}
      aria-label={isDark ? 'Aydınlık temaya geç' : 'Karanlık temaya geç'}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Tema Değiştirme: Açık/koyu tema arası geçiş
 * 2. Context Integration: ThemeContext ile tema durumu yönetimi
 * 3. Icon Toggle: Tema durumuna göre güneş/ay ikonu
 * 4. Accessibility: Erişilebilirlik için title ve aria-label
 * 5. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 6. User Preference: Kullanıcı tema tercihini kaydetme
 * 
 * Bu component sayesinde kullanıcılar tercih ettikleri temayı seçebilir!
 */ 