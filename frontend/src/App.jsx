import React, { useState, useEffect } from 'react';
import './App.css';
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
import AdminOrders from './pages/AdminOrders/AdminOrders.jsx';
import AdminFinancial from './pages/AdminFinancial/AdminFinancial.jsx';
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
import StorePage from './pages/StorePage.jsx';
import Favorites from './pages/Favorites.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Contact from './pages/Contact.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import ReturnExchange from './pages/ReturnExchange.jsx';
import FAQ from './pages/FAQ.jsx';
import DiscountedProducts from './pages/DiscountedProducts.jsx';
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
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-text-primary">Backend bağlantısı kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (backendStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🔌</div>
          <h1 className="text-2xl font-bold text-text-primary mb-4">Backend Bağlantısı Yok</h1>
          <p className="text-text-secondary mb-6">
            Backend sunucusu çalışmıyor. Lütfen backend'i başlatın ve sayfayı yenileyin.
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => setRetryCount(prev => prev + 1)}
              className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Tekrar Dene
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg transition-colors ml-2"
            >
              Sayfayı Yenile
            </button>
          </div>
          <div className="mt-6 p-4 bg-background-secondary rounded-lg">
            <p className="text-sm text-text-secondary">
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
                   <>
                     <Header />
                     <main className="min-h-screen bg-background-primary">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <div className="mt-0">
                           <Banner />
                         </div>
                         <ProductList />
                       </div>
                     </main>
                     <Footer />
                   </>
                 } />
                
                <Route path="/register" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <Register />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                                                  <Route path="/login" element={
                   <>
                     <Header />
                     <main className="min-h-screen bg-background-primary">
                       <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                         <Login />
                       </div>
                     </main>
                     <Footer />
                   </>
                 } />
                
                <Route path="/seller/login" element={
                  <main className="min-h-screen bg-background-primary">
                    <SellerLogin />
                  </main>
                } />
                
                <Route path="/seller/register" element={
                  <main className="min-h-screen bg-background-primary">
                    <SellerRegister />
                  </main>
                } />
                
                <Route path="/cart" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <CartPage />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/checkout" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <CheckoutPage />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/product/:id" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <ProductDetail />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/category/:id" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <CategoryProducts />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/discounted-products" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <DiscountedProducts />
                      </div>
                    </main>
                    <Footer />
                  </>
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
                  
                  <Route path="/admin/financial" element={
                    <AdminRoute>
                      <AdminLayout>
                        <AdminFinancial />
                      </AdminLayout>
                    </AdminRoute>
                  } />
                
                <Route path="/search" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <SearchResults />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/elastic-search" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <ElasticSearch />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/profile" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <Profile />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/orders" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <Orders />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/store/:id" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <StorePage />
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/favorites" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <Favorites />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/about" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <AboutUs />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/contact" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <Contact />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/order-tracking" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <OrderTracking />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/return-exchange" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <ReturnExchange />
                      </div>
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/faq" element={
                  <>
                    <Header />
                    <main className="min-h-screen bg-background-primary">
                      <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                        <FAQ />
                      </div>
                    </main>
                    <Footer />
                  </>
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
