import React, { useState, useEffect } from 'react';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaCalendarAlt,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaTimes
} from 'react-icons/fa';
import './SellerOrders.css';

const SellerOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [customerName, setCustomerName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pageSize] = useState(10);

  // Component mount olduğunda tüm verileri çek
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Filtreleme değişikliklerinde anlık filtreleme
  useEffect(() => {
    if (allOrders.length > 0) {
      filterOrders();
    }
  }, [searchTerm, selectedStatus, customerName, allOrders]);

  // Sayfa dışına tıklandığında önerileri kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-group')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = 'http://localhost:8080/api/seller/orders?page=0&size=1000';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Tüm sipariş verileri:', data);
      
      setAllOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
      setTotalOrders(data.totalElements || 0);
    } catch (err) {
      console.error('Sipariş veri hatası:', err);
      setError('Sipariş verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount || 0);
  };

  // Anlık filtreleme fonksiyonu
  const filterOrders = () => {
    let filtered = [...allOrders];

    // Arama terimi ile filtreleme
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items?.some(item => 
          item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Müşteri adı ile filtreleme
    if (customerName) {
      filtered = filtered.filter(order =>
        order.user?.username?.toLowerCase().includes(customerName.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(customerName.toLowerCase())
      );
    }

    // Durum ile filtreleme
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Arama terimine göre sıralama (eşleşenler üstte)
    if (searchTerm) {
      filtered.sort((a, b) => {
        const aId = a.id?.toLowerCase() || '';
        const bId = b.id?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();

        const aStartsWith = aId.startsWith(searchLower);
        const bStartsWith = bId.startsWith(searchLower);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        return aId.localeCompare(bId);
      });
    }

    setFilteredOrders(filtered);
    setTotalOrders(filtered.length);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Beklemede';
      case 'processing': return 'İşleniyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status || 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FaClock />;
      case 'processing': return <FaBox />;
      case 'shipped': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      case 'cancelled': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/seller/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Sipariş durumunu güncelle
        setAllOrders(allOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        console.error('Sipariş durumu güncellenemedi');
      }
    } catch (error) {
      console.error('Sipariş durumu güncelleme hatası:', error);
    }
  };

  const handleSearch = () => {
    filterOrders();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setCustomerName('');
    setFilteredOrders(allOrders);
    setTotalOrders(allOrders.length);
  };



  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };



  if (loading) {
    return (
      <div className="seller-orders">
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <h3>Siparişler Yükleniyor...</h3>
          <p>Verileriniz hazırlanıyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-orders">
        <div className="orders-error">
          <div className="error-icon">⚠️</div>
          <h3>Bir Hata Oluştu</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchAllOrders}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-orders">
      {/* Header */}
      <div className="orders-header">
        <div className="header-content">
          <h2>Siparişler</h2>
        </div>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="search-filters">
        <div className="search-row">
          <div className="search-group">
            <input
              type="text"
              placeholder="Sipariş ID veya ürün adı ara..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
            />
            {/* Öneriler */}
            {showSuggestions && searchTerm && (
              <div className="search-suggestions">
                {allOrders
                  .filter(order =>
                    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    order.items?.some(item => 
                      item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  )
                  .slice(0, 5)
                  .map(order => (
                    <div
                      key={order.id}
                      className="suggestion-item"
                      onClick={() => {
                        setSearchTerm(order.id);
                        setShowSuggestions(false);
                      }}
                    >
                      <FaSearch className="suggestion-icon" />
                      <span>Sipariş #{order.id.slice(-8)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="search-group">
            <input
              type="text"
              placeholder="Müşteri adı"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
              }}
            />
          </div>
          <div className="search-group">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
              }}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="PENDING">Beklemede</option>
              <option value="PROCESSING">İşleniyor</option>
              <option value="SHIPPED">Kargoda</option>
              <option value="DELIVERED">Teslim Edildi</option>
              <option value="CANCELLED">İptal Edildi</option>
            </select>
          </div>
          <button className="search-btn" onClick={handleSearch}>
            <FaSearch /> Ara
          </button>
          <button className="clear-btn" onClick={handleClearFilters}>
            <FaTimes /> Temizle
          </button>
        </div>
      </div>



      {/* Orders Table */}
      <div className="orders-table-container">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h3>Henüz Sipariş Yok</h3>
            <p>Mağazanızda henüz sipariş bulunmuyor.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Sipariş #{order.id.slice(-8)}</h3>
                    <div className="order-meta">
                      <span className="order-date">
                        <FaCalendarAlt />
                        {formatDate(order.createdAt)}
                      </span>
                      <span className={`order-status ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                  <div className="order-total">
                    {formatCurrency(order.totalPrice)}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="customer-info">
                  <div className="customer-details">
                    <div className="customer-item">
                      <FaUser />
                      <span>{order.user?.username || 'Anonim'}</span>
                    </div>
                    <div className="customer-item">
                      <FaEnvelope />
                      <span>{order.user?.email || 'Email yok'}</span>
                    </div>
                    {order.user?.phone && (
                      <div className="customer-item">
                        <FaPhone />
                        <span>{order.user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items">
                  <h4>Sipariş Ürünleri</h4>
                  <div className="items-list">
                    {order.items?.map((item) => (
                      <div key={item.id} className="item-card">
                        <img 
                          src={item.product?.imageUrl || 'https://via.placeholder.com/50x50?text=No+Image'} 
                          alt={item.product?.name}
                          className="item-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                          }}
                        />
                        <div className="item-details">
                          <h5>{item.product?.name || 'Ürün Adı'}</h5>
                          <p className="item-category">{item.product?.category?.name || 'Kategori yok'}</p>
                        </div>
                        <div className="item-quantity">
                          {item.quantity} adet
                        </div>
                        <div className="item-price">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="order-actions">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`status-select ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Beklemede</option>
                    <option value="processing">İşleniyor</option>
                    <option value="shipped">Kargoda</option>
                    <option value="delivered">Teslim Edildi</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                  
                  <div className="action-buttons">
                    <button className="action-btn view-btn" title="Detayları Görüntüle">
                      <FaEye />
                    </button>
                    <button className="action-btn edit-btn" title="Düzenle">
                      <FaEdit />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>Toplam {totalOrders} sipariş, {totalPages} sayfa</span>
            <span>Sayfa {currentPage + 1} / {totalPages}</span>
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
            >
              Önceki
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`pagination-btn ${currentPage === index ? 'active' : ''}`}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders; 