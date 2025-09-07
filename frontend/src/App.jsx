import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header.jsx';
import Banner from './components/Banner/Banner.jsx';
import ProductList from './components/ProductList/ProductList.jsx';
import Footer from './components/Footer/Footer.jsx';
import Register from './components/Register/Register.jsx';
import Login from './components/Login/Login.jsx';
import SellerLogin from './components/SellerLogin/SellerLogin.jsx';
import SellerRegister from './components/SellerRegister/SellerRegister.jsx';
import CartPage from './components/CartPage/CartPage.jsx';
import CheckoutPage from './components/CheckoutPage/CheckoutPage.jsx';
import ProductDetail from './components/ProductDetail/ProductDetail.jsx';
import CategoryProducts from './components/CategoryProducts/CategoryProducts.jsx';
import AdminPanel from './components/AdminPanel/AdminPanel.jsx';
import AdminLogin from './components/AdminLogin/AdminLogin.jsx';
import AdminLayout from './components/AdminLayout/AdminLayout.jsx';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers/AdminUsers.jsx';
import AdminSellers from './pages/AdminSellers/AdminSellers.jsx';
import AdminProducts from './pages/AdminProducts/AdminProducts.jsx';
import AdminCategories from './pages/AdminCategories/AdminCategories.jsx';

import AdminOrders from './pages/AdminOrders/AdminOrders.jsx';
import AdminReports from './pages/AdminReports/AdminReports.jsx';
import AdminFinancial from './pages/AdminFinancial/AdminFinancial.jsx';
import AdminEmail from './pages/AdminEmail/AdminEmail.jsx';
import AdminSystemSettings from './pages/AdminSystemSettings/AdminSystemSettings.jsx';
import AdminNotifications from './pages/AdminNotifications/AdminNotifications.jsx';
import SearchResults from './components/SearchResults/SearchResults.jsx';
import ElasticSearch from './components/ElasticSearch/ElasticSearch.jsx';
import AdminRoute from './components/AdminRoute/AdminRoute.jsx';
import SellerRoute from './components/SellerRoute/SellerRoute.jsx';
import SellerLayout from './components/SellerLayout/SellerLayout.jsx';
import Profile from './pages/Profile.jsx';
import Orders from './pages/Orders.jsx';
import SellerPanel from './pages/SellerPanel/SellerPanel.jsx';
import SellerProducts from './pages/SellerProducts/SellerProducts.jsx';
import SellerStatistics from './pages/SellerStatistics/SellerStatistics.jsx';
import SellerOrders from './pages/SellerOrders/SellerOrders.jsx';
import SellerStock from './pages/SellerStock/SellerStock.jsx';
import SellerCampaigns from './pages/SellerCampaigns/SellerCampaigns.jsx';
import SellerSettings from './pages/SellerSettings/SellerSettings.jsx';
import SellerNotifications from './pages/SellerNotifications/SellerNotifications.jsx';
import StorePage from './pages/StorePage.jsx';
import Favorites from './pages/Favorites.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Contact from './pages/Contact.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import ReturnExchange from './pages/ReturnExchange.jsx';
import FAQ from './pages/FAQ.jsx';
import DiscountedProducts from './pages/DiscountedProducts.jsx';
import TrendingProducts from './pages/TrendingProducts.jsx';
import NotFound from './pages/NotFound.jsx';
import VerifyAccount from './pages/VerifyAccount.jsx';
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword/ResetPassword.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';

import { NotificationProvider } from './context/NotificationContext.jsx';
import { Toaster } from 'react-hot-toast';

// Global backend offline flag'ini tanımla
// Başlangıçta backend offline olarak işaretle
window.BACKEND_OFFLINE = false;

// Arka plan animasyonları için component
const AnimatedBackground = ({ children }) => {
  // Rastgele pozisyonlar ve boyutlar için fonksiyon
  const generateRandomElement = (index) => {
    const positions = [
      // Sol taraf - üst kısım
      { top: '8%', left: '12%' },
      { top: '15%', left: '25%' },
      { top: '22%', left: '8%' },
      { top: '28%', left: '35%' },
      
      // Sağ taraf - üst kısım
      { top: '8%', right: '12%' },
      { top: '15%', right: '25%' },
      { top: '22%', right: '8%' },
      { top: '28%', right: '35%' },
      
      // Sol taraf - orta kısım
      { top: '38%', left: '15%' },
      { top: '45%', left: '30%' },
      { top: '52%', left: '8%' },
      { top: '58%', left: '40%' },
      
      // Sağ taraf - orta kısım
      { top: '38%', right: '15%' },
      { top: '45%', right: '30%' },
      { top: '52%', right: '8%' },
      { top: '58%', right: '40%' },
      
      // Sol taraf - alt kısım
      { top: '68%', left: '20%' },
      { top: '75%', left: '10%' },
      { top: '82%', left: '35%' },
      { top: '88%', left: '15%' },
      
      // Sağ taraf - alt kısım
      { top: '68%', right: '20%' },
      { top: '75%', right: '10%' },
      { top: '82%', right: '35%' },
      { top: '88%', right: '15%' },
    ];

    const sizes = ['w-8 h-8', 'w-12 h-12', 'w-16 h-16', 'w-20 h-20', 'w-24 h-24', 'w-28 h-28', 'w-32 h-32', 'w-36 h-36', 'w-40 h-40', 'w-44 h-44', 'w-48 h-48'];
    const colors = [
      'bg-orange-100/15', 'bg-orange-200/20', 'bg-orange-300/25', 'bg-orange-400/30',
      'bg-orange-100/10', 'bg-orange-200/15', 'bg-orange-300/20', 'bg-orange-400/25',
      'bg-gradient-to-r from-orange-100/15 to-orange-200/20', 'bg-gradient-to-r from-orange-200/20 to-orange-300/25'
    ];
    const shapes = ['rounded-full', 'rounded-lg', 'rounded-xl', 'rounded-2xl'];
    const animations = ['animate-float-slow', 'animate-float-medium', 'animate-float-fast', 'animate-pulse-slow', 'animate-pulse-medium', 'animate-spin-slow', 'animate-bounce-slow'];
    const rotations = ['rotate-0', 'rotate-12', 'rotate-45', 'rotate-90', 'rotate-180', 'rotate-270'];

    const position = positions[index % positions.length];
    const size = sizes[index % sizes.length];
    const color = colors[index % colors.length];
    const shape = shapes[index % shapes.length];
    const animation = animations[index % animations.length];
    const rotation = rotations[index % rotations.length];

    return { position, size, color, shape, animation, rotation };
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
      {/* Animasyonlu Arka Plan Elementleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 25 adet rastgele dağıtılmış animasyonlu element */}
        {Array.from({ length: 25 }, (_, index) => {
          const element = generateRandomElement(index);
          return (
            <div
              key={index}
              className={`absolute ${element.size} ${element.color} ${element.shape} ${element.animation} ${element.rotation}`}
              style={element.position}
            ></div>
          );
        })}
        
        {/* Parçacık Efektleri */}
        {Array.from({ length: 15 }, (_, index) => {
          const particleSizes = ['w-1 h-1', 'w-1.5 h-1.5', 'w-2 h-2', 'w-2.5 h-2.5'];
          const particleColors = ['bg-orange-200/40', 'bg-orange-300/50', 'bg-orange-400/60', 'bg-orange-500/30'];
          const particleAnimations = ['animate-twinkle', 'animate-twinkle-delay-1', 'animate-twinkle-delay-2', 'animate-twinkle-delay-3', 'animate-twinkle-delay-4', 'animate-twinkle-delay-5'];
          
          const particlePositions = [
            { top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` },
            { top: `${Math.random() * 100}%`, right: `${Math.random() * 100}%` },
            { bottom: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` },
            { bottom: `${Math.random() * 100}%`, right: `${Math.random() * 100}%` }
          ];

          const size = particleSizes[index % particleSizes.length];
          const color = particleColors[index % particleColors.length];
          const animation = particleAnimations[index % particleAnimations.length];
          const position = particlePositions[index % particlePositions.length];

          return (
            <div
              key={`particle-${index}`}
              className={`absolute ${size} ${color} rounded-full ${animation}`}
              style={position}
            ></div>
          );
        })}
      </div>
      
      {/* İçerik */}
      <div className="relative z-10">
        {children}
      </div>

      <style jsx="true">{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-medium {
          animation: pulse-medium 5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-twinkle-delay-1 {
          animation: twinkle 2s ease-in-out infinite 0.3s;
        }
        
        .animate-twinkle-delay-2 {
          animation: twinkle 2s ease-in-out infinite 0.6s;
        }
        
        .animate-twinkle-delay-3 {
          animation: twinkle 2s ease-in-out infinite 0.9s;
        }
        
        .animate-twinkle-delay-4 {
          animation: twinkle 2s ease-in-out infinite 1.2s;
        }
        
        .animate-twinkle-delay-5 {
          animation: twinkle 2s ease-in-out infinite 1.5s;
        }
      `}</style>
    </div>
  );
};

// Backend bağlantı kontrolü için component
const BackendStatus = ({ children }) => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [retryCount, setRetryCount] = useState(0);

  const checkBackend = async () => {
    try {
      console.log('Backend kontrol ediliyor...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('http://localhost:8082/api/products?page=0&size=1', {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors',
        credentials: 'include'
      });
      
      clearTimeout(timeoutId);
      
      console.log('Backend response status:', response.status);
      if (response.ok) {
        setBackendStatus('connected');
        console.log('Backend bağlantısı başarılı');
      } else {
        setBackendStatus('error');
        console.log('Backend bağlantısı başarısız');
      }
    } catch (error) {
      console.log('Backend bağlantı hatası:', error.message);
      setBackendStatus('error');
    }
  };

  useEffect(() => {
    checkBackend();
  }, [retryCount]);

  // Backend bağlantısı yokken global bir flag set et
  useEffect(() => {
    if (backendStatus === 'error') {
      window.BACKEND_OFFLINE = true;
    } else if (backendStatus === 'connected') {
      window.BACKEND_OFFLINE = false;
    }
  }, [backendStatus]);

  if (backendStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-900">Backend bağlantısı kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (backendStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🔌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Backend Bağlantısı Yok</h1>
          <p className="text-gray-600 mb-6">
            Backend sunucusu çalışmıyor. Lütfen backend'i başlatın ve sayfayı yenileyin.
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => setRetryCount(prev => prev + 1)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Tekrar Dene
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors ml-2"
            >
              Sayfayı Yenile
            </button>
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Backend'i başlatmak için:</strong><br/>
              <code className="bg-gray-200 px-2 py-1 rounded text-xs">
                cd backend && mvn spring-boot:run
              </code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <NotificationProvider>
            <BackendStatus>
            <BrowserRouter>
                                            <Routes>
                 {/* Customer Routes - Normal Layout */}
                                  <Route path="/" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container py-8">
                         <div className="mt-0">
                           <Banner />
                         </div>
                         <ProductList />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                
                                 <Route path="/register" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container py-8">
                         <Register />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                
                                                                   <Route path="/login" element={
                  <AnimatedBackground>
                    <Header />
                    <main className="min-h-screen">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <Login />
                      </div>
                    </main>
                    <Footer />
                  </AnimatedBackground>
                } />
                
                <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
                
                                 <Route path="/seller/login" element={
                   <AnimatedBackground>
                     <main className="min-h-screen">
                       <SellerLogin />
                     </main>
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/seller/register" element={
                   <AnimatedBackground>
                     <main className="min-h-screen">
                       <SellerRegister />
                     </main>
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/cart" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <CartPage />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/checkout" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <CheckoutPage />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/product/:id" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <ProductDetail />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/category/:id" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container py-8">
                         <CategoryProducts />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/discounted-products" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <DiscountedProducts />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/trending" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <TrendingProducts />
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                                 <Route path="/admin" element={
                   <AdminRoute>
                     <AdminLayout>
                       <AdminDashboard />
                     </AdminLayout>
                   </AdminRoute>
                 } />
                 
                 <Route path="/admin/dashboard" element={
                   <AdminRoute>
                     <AdminLayout>
                       <AdminDashboard />
                     </AdminLayout>
                   </AdminRoute>
                 } />
                 
                 <Route path="/admin/users" element={
                   <AdminRoute>
                     <AdminLayout>
                       <AdminUsers />
                     </AdminLayout>
                   </AdminRoute>
                 } />
                 
                                  <Route path="/admin/sellers" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminSellers />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/categories" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminCategories />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                  

                  
                  <Route path="/admin/products" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminProducts />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/orders" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminOrders />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/reports" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminReports />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/financial" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminFinancial />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/email" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminEmail />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/notifications" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminNotifications />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                  
                  <Route path="/admin/settings" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminSystemSettings />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                
                                 <Route path="/search" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <SearchResults />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/elastic-search" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <ElasticSearch />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/profile" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <Profile />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/orders" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <Orders />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/store/:id" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <StorePage />
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/favorites" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <Favorites />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/about" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <AboutUs />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/contact" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <Contact />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/order-tracking" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <OrderTracking />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/return-exchange" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <ReturnExchange />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                 
                 <Route path="/faq" element={
                   <AnimatedBackground>
                     <Header />
                     <main className="min-h-screen">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <FAQ />
                       </div>
                     </main>
                     <Footer />
                   </AnimatedBackground>
                 } />
                
                {/* Seller Routes - Seller Layout */}
                <Route path="/seller-panel" element={
                  <SellerRoute>
                    <SellerLayout>
                      <SellerPanel />
                    </SellerLayout>
                  </SellerRoute>
                } />
                
                <Route path="/seller-panel/products" element={
                  <SellerRoute>
                    <SellerLayout>
                      <SellerProducts />
                    </SellerLayout>
                  </SellerRoute>
                } />
                
                <Route path="/seller-panel/statistics" element={
                  <SellerRoute>
                    <SellerLayout>
                      <SellerStatistics />
                    </SellerLayout>
                  </SellerRoute>
                } />
                
                <Route path="/seller-panel/orders" element={
                  <SellerRoute>
                    <SellerLayout>
                      <SellerOrders />
                    </SellerLayout>
                  </SellerRoute>
                } />
                
                <Route path="/seller-panel/stock" element={
                  <SellerRoute>
                    <SellerLayout>
                      <SellerStock />
                    </SellerLayout>
                  </SellerRoute>
                } />
                
                <Route path="/seller-panel/campaigns" element={
                  <SellerRoute>
                    <SellerLayout>
                      <SellerCampaigns />
                    </SellerLayout>
                  </SellerRoute>
                } />
                
                <Route path="/seller-panel/settings" element={
                  <SellerRoute>
                    <SellerLayout>
                      <SellerSettings />
                    </SellerLayout>
                  </SellerRoute>
                } />
                
                <Route path="/seller-panel/notifications" element={
                  <SellerRoute>
                    <SellerLayout>
                      <SellerNotifications />
                    </SellerLayout>
                  </SellerRoute>
                } />
                
                 {/* 404 - Catch All Route */}
                 <Route path="*" element={<NotFound />} />
               </Routes>
              <Toaster position="top-right" />
            </BrowserRouter>
            </BackendStatus>
            </NotificationProvider>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
