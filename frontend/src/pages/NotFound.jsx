import React from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import { Home, Search, ShoppingCart, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const funnyMessages = [
    "Bu sayfa galiba tatilde! 🏖️",
    "404 - Sayfa kayboldu, ama umudumuz kaybolmadı! 🕵️",
    "Bu sayfa çok utangaç, saklanıyor! 🙈",
    "404 - Sayfa bulunamadı, ama güzel bir 404 sayfası buldunuz! 🎉",
    "Bu sayfa galiba başka bir evrene ışınlandı! 🚀",
    "404 - Sayfa yok, ama bu sayfa var! 😄",
    "Bu sayfa çok meşgul, şu anda müsait değil! 📱",
    "404 - Sayfa kayıp, ama siz kaybolmadınız! 🧭"
  ];

  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4">
      <PageTitle title="404 - Sayfa Bulunamadı" />
      <MetaTags 
        title="404 - Sayfa Bulunamadı"
        description="Aradığınız sayfa bulunamadı, ama güzel bir 404 sayfası buldunuz!"
        keywords="404, sayfa bulunamadı, hata"
      />
      
      <div className="text-center max-w-2xl mx-auto">
        {/* Ana İçerik */}
        <div className="mb-8">
          {/* Büyük 404 */}
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700 mb-4">
            404
          </div>
          
          {/* Espirili Mesaj */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Sayfa Bulunamadı
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {randomMessage}
          </p>
          
          {/* Eğlenceli Görsel */}
          <div className="mb-8">
            <div className="text-8xl mb-4 animate-bounce">
              🤖
            </div>
            <p className="text-gray-500 text-sm">
              Robot arkadaşımız da şaşırdı! 🤔
            </p>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Home size={20} />
              Ana Sayfaya Dön
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <ArrowLeft size={20} />
              Geri Git
            </button>
            
          </div>
        </div>

        {/* Eğlenceli İstatistikler */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🎯 Eğlenceli Bilgiler
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">404</div>
              <div className="text-gray-600">Bu sayfayı bulan kişi sayısı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">∞</div>
              <div className="text-gray-600">Keşfedilecek sayfa sayısı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">100%</div>
              <div className="text-gray-600">Bu sayfayı beğenme oranı</div>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>
            Eğer bu bir hata olduğunu düşünüyorsanız,{' '}
            <Link to="/contact" className="text-orange-600 hover:underline">
              bizimle iletişime geçin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
