import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaChartLine, FaExclamationTriangle, FaStar, FaPlus, FaList, FaBoxes, FaComments } from 'react-icons/fa';
import SellerCategoryRequest from '../../components/SellerCategoryRequest/SellerCategoryRequest';
import './SellerPanel.css';

const SellerPanel = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        <span key={i} className={i <= rating ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="seller-dashboard">
        <div className="seller-dashboard-loading">
          <div className="loading-spinner"></div>
          <h3>Dashboard Yükleniyor...</h3>
          <p>Verileriniz hazırlanıyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-dashboard">
        <div className="seller-dashboard-error">
          <div className="error-icon">⚠️</div>
          <h3>Bir Hata Oluştu</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchDashboardData}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="seller-dashboard">
        <div className="seller-dashboard-error">
          <div className="error-icon">❌</div>
          <h3>Veri Bulunamadı</h3>
          <p>Dashboard verileri yüklenemedi.</p>
          <button className="retry-btn" onClick={fetchDashboardData}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      {/* Welcome Header */}
      <div className="welcome-header">
        <div className="welcome-content">
          <h1>{dashboardData.welcomeMessage}</h1>
          <div className="store-name">{dashboardData.storeName}</div>
          <div className="today-date">{dashboardData.today}</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats-grid">
        <div className="quick-stat-card">
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <h3>Bugünkü Siparişler</h3>
          <div className="stat-number">{dashboardData.quickStats?.todayOrders || 0}</div>
          <div className="stat-amount">{formatCurrency(dashboardData.quickStats?.todayRevenue || 0)}</div>
        </div>

        <div className="quick-stat-card">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <h3>Bu Hafta</h3>
          <div className="stat-number">{dashboardData.quickStats?.weekOrders || 0}</div>
          <div className="stat-amount">{formatCurrency(dashboardData.quickStats?.weekRevenue || 0)}</div>
        </div>

        <div className="quick-stat-card">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <h3>Düşük Stok</h3>
          <div className="stat-number">{dashboardData.lowStockProducts?.length || 0}</div>
          <div className="stat-label">Ürün Dikkat Gerektiriyor</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Hızlı İşlemler</h2>
        <div className="quick-actions-grid">
          <a href="/seller-panel/products" className="quick-action-card">
            <div className="action-icon blue">
              <FaPlus />
            </div>
            <h3>Yeni Ürün Ekle</h3>
          </a>

          <a href="/seller-panel/orders" className="quick-action-card">
            <div className="action-icon green">
              <FaList />
            </div>
            <h3>Siparişleri Görüntüle</h3>
          </a>

          <a href="/seller-panel/stock" className="quick-action-card">
            <div className="action-icon orange">
              <FaBoxes />
            </div>
            <h3>Stok Yönetimi</h3>
          </a>


        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content-grid">


        {/* Low Stock Alerts */}
        <div className="dashboard-section">
          <h2>Düşük Stok Uyarıları</h2>
          <div className="low-stock-list">
            {dashboardData.lowStockProducts && dashboardData.lowStockProducts.length > 0 ? (
              dashboardData.lowStockProducts.map((product) => (
                <div key={product.id} className="low-stock-item">
                  <img 
                    src={product.imageUrl1 || product.imageUrl || '/img/default-product.png'} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = '/img/default-product.png';
                    }}
                  />
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <div className="stock-warning">
                      Stok: {product.stock} adet kaldı
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">
                <FaBoxes style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }} />
                <p>Düşük stok uyarısı yok</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="dashboard-section">
          <h2>Son Müşteri Yorumları</h2>
          <div className="reviews-list">
            {dashboardData.recentReviews && dashboardData.recentReviews.length > 0 ? (
              dashboardData.recentReviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <h4>{review.product?.name || 'Ürün Adı'}</h4>
                    <div className="rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <div className="review-comment">
                    "{review.comment || 'Yorum bulunamadı'}"
                  </div>
                  <div className="review-footer">
                    <span className="reviewer">{review.user?.username || 'Anonim'}</span>
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">
                <FaComments style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }} />
                <p>Henüz yorum bulunmuyor</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Requests */}
        <div className="dashboard-section">
          <h2>Kategori İstekleri</h2>
          <SellerCategoryRequest />
        </div>
      </div>
    </div>
  );
};

export default SellerPanel; 