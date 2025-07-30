/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3B82F6', // Modern pastel mavi birincil
          600: '#2563EB',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#6EE7B7', // Soft zümrüt yeşili ikincil
          500: '#34D399',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#10B981', // Canlı ama soft yeşil vurgu
          500: '#059669', // Vurgu için daha koyu yeşil
          600: '#047857',
          700: '#065f46',
          800: '#064e3b',
          900: '#064e3b',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#EF4444', // Canlı ama yumuşak kırmızı hata
          500: '#DC2626', // Hata için daha koyu kırmızı
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#F59E0B', // Yumuşak sarı uyarı
          500: '#D97706', // Uyarı için daha koyu sarı
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        background: {
          primary: '#F7F9FC', // Daha ferah soft beyaz arka plan
          secondary: '#EDEFF2', // Hafif grimsi beyaz, alternatif
          tertiary: '#F1F5F9', // Daha açık bir gri ton
        },
        text: {
          primary: '#2D3748', // Daha yumuşak koyu gri metin
          secondary: '#4B5563', // Hafif mavimsi gri, okunabilir
          tertiary: '#6B7280', // Daha açık gri, ikincil metin
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
} 