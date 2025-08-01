import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header.jsx';
import Banner from './components/Banner/Banner.jsx';
import ProductList from './components/ProductList/ProductList.jsx';
import Footer from './components/Footer/Footer.jsx';
import Register from './components/Register/Register.jsx';
import Login from './components/Login/Login.jsx';
import CartPage from './components/CartPage/CartPage.jsx';
import ProductDetail from './components/ProductDetail/ProductDetail.jsx';
import CategoryProducts from './components/CategoryProducts/CategoryProducts.jsx';
import AdminPanel from './components/AdminPanel/AdminPanel.jsx';
import SearchResults from './components/SearchResults/SearchResults.jsx';
import ElasticSearch from './components/ElasticSearch/ElasticSearch.jsx';
import AdminRoute from './components/AdminRoute/AdminRoute.jsx';
import SellerRoute from './components/SellerRoute/SellerRoute.jsx';
import Profile from './pages/Profile.jsx';
import Orders from './pages/Orders.jsx';
import SellerPanel from './pages/SellerPanel.jsx';
import StorePage from './pages/StorePage.jsx';
import Favorites from './pages/Favorites.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Contact from './pages/Contact.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import ReturnExchange from './pages/ReturnExchange.jsx';
import FAQ from './pages/FAQ.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
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
      
      const response = await fetch('http://localhost:8080/api/auth/me', {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors',
        credentials: 'include'
      });
      
      clearTimeout(timeoutId);
      
      console.log('Backend response status:', response.status);
      if (response.ok || response.status === 401) {
        // 401 de olsa backend çalışıyor demektir (auth endpoint'i var)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400 mx-auto mb-4"></div>
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
              className="bg-accent-400 hover:bg-accent-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Tekrar Dene
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors ml-2"
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
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <NotificationProvider>
            <BackendStatus>
            <BrowserRouter>
              <Header />
                <main className="min-h-screen bg-background-primary">
                  <div className="container mx-auto px-12 sm:px-16 lg:px-24 py-8">
                <Routes>
                  <Route path="/" element={
                    <>
                          <div className="mt-0">
                        <Banner />
                      </div>
                      <ProductList />
                    </>
                  } />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/category/:id" element={<CategoryProducts />} />
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  } />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/elastic-search" element={<ElasticSearch />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/seller-panel" element={
                    <SellerRoute>
                      <SellerPanel />
                    </SellerRoute>
                  } />
                  <Route path="/store/:name" element={<StorePage />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/order-tracking" element={<OrderTracking />} />
                  <Route path="/return-exchange" element={<ReturnExchange />} />
                  <Route path="/faq" element={<FAQ />} />
                </Routes>
                  </div>
              </main>
              <Footer />
              <Toaster position="top-right" />
            </BrowserRouter>
            </BackendStatus>
            </NotificationProvider>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
