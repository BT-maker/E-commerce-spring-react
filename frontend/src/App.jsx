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
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden">
      {/* Arka plan dekoratif öğeler */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-3000"></div>
      </div>
      
      {/* İçerik */}
      <div className="relative z-10">
        {children}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
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
