import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaChartLine, FaExclamationTriangle, FaStar, FaPlus, FaList, FaBoxes, FaComments } from 'react-icons/fa';
import SellerCategoryRequest from '../../components/SellerCategoryRequest/SellerCategoryRequest';

const SellerPanel = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Sayfalama state'leri
  const [lowStockPage, setLowStockPage] = useState(0);
  const [reviewsPage, setReviewsPage] = useState(0);
  const itemsPerPage = 6; // Her sayfada 6 item göster

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Sayfalama fonksiyonları
  const getPaginatedItems = (items, page) => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items) => {
    return Math.ceil(items.length / itemsPerPage);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cookie'den token'ı al
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };
      
      const token = getCookie('token');
      
      const response = await fetch('/api/seller/welcome-dashboard', {
        credentials: 'include', // Cookie'leri gönder
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { errorMessage: `HTTP ${response.status}: ${errorText}` };
        }
        
        throw new Error(errorData.errorMessage || `HTTP ${response.status}: Dashboard verileri alınamadı`);
      }

      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`JSON parse error: ${e.message}. Response: ${responseText.substring(0, 100)}...`);
      }
      
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard veri hatası:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Yükleniyor...</h3>
          <p className="text-gray-600">Verileriniz hazırlanıyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Bir Hata Oluştu</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            onClick={fetchDashboardData}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <div className="text-gray-500 text-4xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Veri Bulunamadı</h3>
          <p className="text-gray-600 mb-6">Dashboard verileri yüklenemedi.</p>
          <button 
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            onClick={fetchDashboardData}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{dashboardData.welcomeMessage}</h1>
          <div className="text-xl font-semibold mb-1">{dashboardData.storeName}</div>
          <div className="text-orange-100">{dashboardData.today}</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-600 mb-1">Bugünkü Siparişler</h3>
              <div className="text-2xl font-bold text-blue-900">{dashboardData.quickStats?.todayOrders || 0}</div>
              <div className="text-sm text-blue-700">{formatCurrency(dashboardData.quickStats?.todayRevenue || 0)}</div>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <FaShoppingCart className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-600 mb-1">Bu Hafta</h3>
              <div className="text-2xl font-bold text-green-900">{dashboardData.quickStats?.weekOrders || 0}</div>
              <div className="text-sm text-green-700">{formatCurrency(dashboardData.quickStats?.weekRevenue || 0)}</div>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <FaChartLine className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-yellow-600 mb-1">Düşük Stok</h3>
              <div className="text-2xl font-bold text-yellow-900">{dashboardData.lowStockProducts?.length || 0}</div>
              <div className="text-sm text-yellow-700">Ürün Dikkat Gerektiriyor</div>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <FaExclamationTriangle className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/seller-panel/products" className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-6 text-center transition-colors group">
            <div className="bg-blue-500 rounded-lg p-3 w-12 h-12 mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
              <FaPlus className="text-white text-xl" />
            </div>
            <h3 className="font-semibold text-blue-900">Yeni Ürün Ekle</h3>
          </a>

          <a href="/seller-panel/orders" className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl p-6 text-center transition-colors group">
            <div className="bg-green-500 rounded-lg p-3 w-12 h-12 mx-auto mb-4 group-hover:bg-green-600 transition-colors">
              <FaList className="text-white text-xl" />
            </div>
            <h3 className="font-semibold text-green-900">Siparişleri Görüntüle</h3>
          </a>

          <a href="/seller-panel/stock" className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl p-6 text-center transition-colors group">
            <div className="bg-orange-500 rounded-lg p-3 w-12 h-12 mx-auto mb-4 group-hover:bg-orange-600 transition-colors">
              <FaBoxes className="text-white text-xl" />
            </div>
            <h3 className="font-semibold text-orange-900">Stok Yönetimi</h3>
          </a>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Düşük Stok Uyarıları</h2>
            {dashboardData.lowStockProducts && dashboardData.lowStockProducts.length > itemsPerPage && (
              <span className="text-sm text-gray-500">
                {lowStockPage + 1} / {getTotalPages(dashboardData.lowStockProducts)} sayfa
              </span>
            )}
          </div>
          <div className="space-y-4">
            {dashboardData.lowStockProducts && dashboardData.lowStockProducts.length > 0 ? (
              getPaginatedItems(dashboardData.lowStockProducts, lowStockPage).map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <img 
                    src={product.imageUrl1 || product.imageUrl || '/img/default-product.png'} 
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = '/img/default-product.png';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                    <div className="text-sm text-yellow-700 font-medium">
                      Stok: {product.stock} adet kaldı
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FaExclamationTriangle className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">Düşük stok uyarısı yok</p>
              </div>
            )}
          </div>
          
          {/* Düşük Stok Sayfalama */}
          {dashboardData.lowStockProducts && dashboardData.lowStockProducts.length > itemsPerPage && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setLowStockPage(Math.max(0, lowStockPage - 1))}
                disabled={lowStockPage === 0}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Önceki
              </button>
              {Array.from({ length: getTotalPages(dashboardData.lowStockProducts) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setLowStockPage(i)}
                  className={`px-3 py-1 text-sm rounded ${
                    lowStockPage === i 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setLowStockPage(Math.min(getTotalPages(dashboardData.lowStockProducts) - 1, lowStockPage + 1))}
                disabled={lowStockPage === getTotalPages(dashboardData.lowStockProducts) - 1}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki
              </button>
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Son Müşteri Yorumları</h2>
            {dashboardData.recentReviews && dashboardData.recentReviews.length > itemsPerPage && (
              <span className="text-sm text-gray-500">
                {reviewsPage + 1} / {getTotalPages(dashboardData.recentReviews)} sayfa
              </span>
            )}
          </div>
          <div className="space-y-4">
            {dashboardData.recentReviews && dashboardData.recentReviews.length > 0 ? (
              getPaginatedItems(dashboardData.recentReviews, reviewsPage).map((review) => (
                <div key={review.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{review.productName || review.product?.name || 'Ürün Adı'}</h4>
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="text-gray-700 mb-2 italic">
                    "{review.comment || 'Yorum bulunamadı'}"
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{review.userName || review.user?.username || 'Anonim'}</span>
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FaComments className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-500">Henüz yorum bulunmuyor</p>
              </div>
            )}
          </div>
          
          {/* Yorumlar Sayfalama */}
          {dashboardData.recentReviews && dashboardData.recentReviews.length > itemsPerPage && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setReviewsPage(Math.max(0, reviewsPage - 1))}
                disabled={reviewsPage === 0}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Önceki
              </button>
              {Array.from({ length: getTotalPages(dashboardData.recentReviews) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setReviewsPage(i)}
                  className={`px-3 py-1 text-sm rounded ${
                    reviewsPage === i 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setReviewsPage(Math.min(getTotalPages(dashboardData.recentReviews) - 1, reviewsPage + 1))}
                disabled={reviewsPage === getTotalPages(dashboardData.recentReviews) - 1}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Requests */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Kategori İstekleri</h2>
          <SellerCategoryRequest />
        </div>
      </div>
    </div>
  );
};

export default SellerPanel; 