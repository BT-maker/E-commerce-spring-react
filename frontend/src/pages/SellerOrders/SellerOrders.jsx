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
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Component mount olduğunda tüm verileri çek
  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Sipariş detaylarını aç/kapat
  const toggleOrderDetails = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  // Filtreleme değişikliklerinde anlık filtreleme
  useEffect(() => {
    // if (allOrders.length > 0) { // Fetch sonrası ilk filtreleme için fetchAllOrders içinde yapılıyor
      filterOrders();
    // }
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
      
      const url = 'http://localhost:8082/api/seller/orders?page=0&size=1000';
      
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
      
      const orders = (data.orders || []).map(order => {
        if (order.status && order.status.toUpperCase() === 'BEKLIYOR') {
          return { ...order, status: 'PENDING' };
        }
        return order;
      });
      
      setAllOrders(orders);
      setFilteredOrders(orders);
      setTotalOrders(orders.length); // Use the length of the fetched and normalized orders
      setTotalPages(Math.ceil(orders.length / pageSize));

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
      filtered = filtered.filter(order => order.status?.toUpperCase() === selectedStatus.toUpperCase());
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
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setCurrentPage(0); // Reset to first page after filtering
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
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'Beklemede';
      case 'PROCESSING': return 'İşleniyor';
      case 'SHIPPED': return 'Kargoda';
      case 'DELIVERED': return 'Teslim Edildi';
      case 'CANCELLED': return 'İptal Edildi';
      default: return status || 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return <FaClock />;
      case 'PROCESSING': return <FaBox />;
      case 'SHIPPED': return <FaTruck />;
      case 'DELIVERED': return <FaCheckCircle />;
      case 'CANCELLED': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8082/api/seller/orders/${orderId}/status`, {
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
  
  const paginatedOrders = filteredOrders.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Siparişler Yükleniyor...</h3>
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
            onClick={fetchAllOrders}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Siparişlerim</h1>
          <p className="text-orange-100">Mağazanızdaki tüm siparişleri yönetin</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Toplam Sipariş</p>
              <p className="text-2xl font-bold text-blue-900">{totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <FaBox className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Beklemede</p>
              <p className="text-2xl font-bold text-yellow-900">
                {allOrders.filter(o => o.status === 'PENDING').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <FaClock className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Kargoda</p>
              <p className="text-2xl font-bold text-purple-900">
                {allOrders.filter(o => o.status === 'SHIPPED').length}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <FaTruck className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Teslim Edildi</p>
              <p className="text-2xl font-bold text-green-900">
                {allOrders.filter(o => o.status === 'DELIVERED').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <FaCheckCircle className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Sipariş ID veya ürün adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Müşteri adı"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="PENDING">Beklemede</option>
              <option value="PROCESSING">İşleniyor</option>
              <option value="SHIPPED">Kargoda</option>
              <option value="DELIVERED">Teslim Edildi</option>
              <option value="CANCELLED">İptal Edildi</option>
            </select>
          </div>

          <button 
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            onClick={handleSearch}
          >
            <FaSearch />
            <span>Ara</span>
          </button>

          <button 
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            onClick={handleClearFilters}
          >
            <FaTimes />
            <span>Temizle</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {paginatedOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sipariş Bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinize uygun sipariş bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {paginatedOrders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
              
              return (
                <div key={order.id} className="border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                  {/* Kompakt Sipariş Başlığı */}
                  <div className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">Sipariş #{order.id.slice(-8)}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            <span className="mr-1">{getStatusIcon(order.status)}</span>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <FaCalendarAlt className="text-gray-400" />
                            <span>{formatDate(order.createdAt)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <FaBox className="text-gray-400" />
                            <span>{totalItems} ürün</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <FaUser className="text-gray-400" />
                            <span>{order.user?.username || 'Anonim'}</span>
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 lg:mt-0 lg:ml-4 flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-600">{formatCurrency(order.totalPrice)}</div>
                        </div>
                        <button
                          onClick={() => toggleOrderDetails(order.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <FaEye className="text-sm" />
                          <span className="text-sm font-medium">
                            {isExpanded ? 'Detayları Gizle' : 'Detayları Göster'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Genişletilmiş Detaylar */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      {/* Müşteri Bilgileri */}
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Müşteri Bilgileri</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <FaUser className="text-gray-400" />
                            <span className="text-gray-700">{order.user?.username || 'Anonim'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaEnvelope className="text-gray-400" />
                            <span className="text-gray-700">{order.user?.email || 'Email yok'}</span>
                          </div>
                          {order.user?.phone && (
                            <div className="flex items-center space-x-2">
                              <FaPhone className="text-gray-400" />
                              <span className="text-gray-700">{order.user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sipariş Ürünleri */}
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Sipariş Ürünleri</h4>
                        <div className="space-y-3">
                          {order.items?.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                              <img 
                                src={item.product?.imageUrl1 || item.product?.imageUrl || '/img/default-product.png'} 
                                alt={item.product?.name}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.src = '/img/default-product.png';
                                }}
                              />
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 text-sm">{item.product?.name || 'Ürün Adı'}</h5>
                                <p className="text-xs text-gray-600">{item.product?.category?.name || 'Kategori yok'}</p>
                                {item.product?.stock !== undefined && (
                                  <div className="text-xs mt-1">
                                    {item.product.stock <= 0 ? (
                                      <span className="text-red-600 font-medium">Stokta yok</span>
                                    ) : item.product.stock <= 5 ? (
                                      <span className="text-red-600 font-medium">Kritik stok: {item.product.stock} adet</span>
                                    ) : item.product.stock <= 10 ? (
                                      <span className="text-yellow-600 font-medium">Düşük stok: {item.product.stock} adet</span>
                                    ) : null}
                                  </div>
                                )}
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600">Adet</div>
                                <div className="font-semibold text-gray-900">{item.quantity}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-600">Fiyat</div>
                                <div className="font-semibold text-gray-900">{formatCurrency(item.price)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Actions - Kompakt */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t border-gray-200">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${getStatusColor(order.status)}`}
                    >
                      <option value="PENDING">Beklemede</option>
                      <option value="PROCESSING">İşleniyor</option>
                      <option value="SHIPPED">Kargoda</option>
                      <option value="DELIVERED">Teslim Edildi</option>
                      <option value="CANCELLED">İptal Edildi</option>
                    </select>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                        title="Düzenle"
                      >
                        <FaEdit size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              <span>Toplam {filteredOrders.length} sonuç, {totalPages} sayfa</span>
              <span className="mx-2">•</span>
              <span>Sayfa {currentPage + 1} / {totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
              >
                Önceki
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === index 
                      ? 'bg-orange-600 text-white' 
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handlePageChange(index)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
              >
                Sonraki
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;