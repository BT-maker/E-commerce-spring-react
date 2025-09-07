import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter,
  FaPercent,
  FaCalendarAlt,
  FaTag,
  FaBox,
  FaSave,
  FaTimes,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const SellerCampaigns = () => {
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaignType, setSelectedCampaignType] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage', // percentage, fixed
    discountValue: '',
    campaignType: 'product', // product, category
    targetId: '', // product ID or category ID
    startDate: '',
    endDate: '',
    isActive: true
  });

  // Component mount olduğunda tüm verileri çek
  useEffect(() => {
    fetchAllCampaigns();
    fetchProducts();
    fetchCategories();
  }, []);

  // Filtreleme değişikliklerinde anlık filtreleme
  useEffect(() => {
    if (allCampaigns.length > 0) {
      filterCampaigns();
    }
  }, [searchTerm, selectedCampaignType, allCampaigns]);

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

  const fetchAllCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = 'http://localhost:8082/api/seller/campaigns';
      
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
      
      setAllCampaigns(data.campaigns || []);
      setFilteredCampaigns(data.campaigns || []);
    } catch (err) {
      console.error('Kampanya veri hatası:', err);
      setError('Kampanya verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // Tüm ürünleri çekmek için büyük bir sayfa boyutu kullan
      const response = await fetch('http://localhost:8082/api/seller/products?page=0&size=1000', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data || []);
        console.log('Çekilen ürün sayısı:', (data.products || data || []).length);
      }
    } catch (err) {
      console.error('Ürün veri hatası:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data || []);
      }
    } catch (err) {
      console.error('Kategori veri hatası:', err);
    }
  };

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setFormData({
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      campaignType: 'product',
      targetId: '',
      startDate: '',
      endDate: '',
      isActive: true
    });
    setProductSearchTerm('');
    setShowModal(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name || '',
      description: campaign.description || '',
      discountType: campaign.discountType || 'percentage',
      discountValue: campaign.discountValue || '',
      campaignType: campaign.campaignType || 'product',
      targetId: campaign.targetId || '',
      startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
      endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
      isActive: campaign.isActive !== false
    });
    
    // Seçilen ürünün adını arama terimine set et
    if (campaign.campaignType === 'product' && campaign.targetId) {
      const selectedProduct = products.find(p => p.id === campaign.targetId);
      setProductSearchTerm(selectedProduct ? selectedProduct.name : '');
    } else {
      setProductSearchTerm('');
    }
    
    setShowModal(true);
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8082/api/seller/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        setAllCampaigns(prev => prev.filter(c => c.id !== campaignId));
        setFilteredCampaigns(prev => prev.filter(c => c.id !== campaignId));
      } else {
        alert('Kampanya silinirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Kampanya silme hatası:', err);
      alert('Kampanya silinirken bir hata oluştu.');
    }
  };

  const handleSearch = () => {
    filterCampaigns();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCampaignType('all');
    setFilteredCampaigns(allCampaigns);
  };

  // Helper functions - getStats'den ÖNCE tanımlanmalı
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getCampaignStatus = (campaign) => {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);

    if (!campaign.isActive) return 'inactive';
    if (now < startDate) return 'pending';
    if (now > endDate) return 'expired';
    return 'active';
  };

  const getCampaignStatusText = (campaign) => {
    const status = getCampaignStatus(campaign);
    switch (status) {
      case 'active': return 'Aktif';
      case 'pending': return 'Beklemede';
      case 'expired': return 'Süresi Dolmuş';
      case 'inactive': return 'Pasif';
      default: return 'Bilinmiyor';
    }
  };

  const getTargetName = (campaign) => {
    if (campaign.campaignType === 'product') {
      const product = products.find(p => p.id === campaign.targetId);
      return product ? product.name : 'Ürün bulunamadı';
    } else {
      const category = categories.find(c => c.id === campaign.targetId);
      return category ? category.name : 'Kategori bulunamadı';
    }
  };

  // Anlık filtreleme fonksiyonu
  const filterCampaigns = () => {
    let filtered = [...allCampaigns];

    // Arama terimi ile filtreleme
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Kampanya tipi ile filtreleme
    if (selectedCampaignType !== 'all') {
      filtered = filtered.filter(campaign =>
        campaign.campaignType === selectedCampaignType
      );
    }

    // Arama terimine göre sıralama (eşleşenler üstte)
    if (searchTerm) {
      filtered.sort((a, b) => {
        const aName = a.name?.toLowerCase() || '';
        const bName = b.name?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();

        const aStartsWith = aName.startsWith(searchLower);
        const bStartsWith = bName.startsWith(searchLower);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        return aName.localeCompare(bName);
      });
    }

    setFilteredCampaigns(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingCampaign 
        ? `http://localhost:8082/api/seller/campaigns/${editingCampaign.id}`
        : 'http://localhost:8082/api/seller/campaigns';
      
      const method = editingCampaign ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          campaignType: formData.campaignType,
          targetId: formData.targetId,
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          startDate: formData.startDate,
          endDate: formData.endDate,
          isActive: formData.isActive
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(editingCampaign ? 'Kampanya başarıyla güncellendi!' : 'Kampanya başarıyla oluşturuldu!');
        setShowModal(false);
        fetchAllCampaigns(); // Kampanyaları yeniden yükle
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Bir hata oluştu!');
      }
    } catch (err) {
      console.error('Kampanya işlemi hatası:', err);
      alert('Bir hata oluştu!');
    }
  };

  const getStats = () => {
    const totalCampaigns = allCampaigns.length;
    const activeCampaigns = allCampaigns.filter(c => getCampaignStatus(c) === 'active').length;
    const pendingCampaigns = allCampaigns.filter(c => getCampaignStatus(c) === 'pending').length;
    
    return { totalCampaigns, activeCampaigns, pendingCampaigns };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <FaExclamationTriangle className="mx-auto text-red-500 text-4xl mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Bir Hata Oluştu</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchAllCampaigns}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Kampanyalarım</h1>
              <p className="text-purple-100">Mağazanızın kampanyalarını yönetin</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={handleCreateCampaign}
                className="bg-white hover:bg-gray-100 text-purple-600 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <FaPlus />
                <span>Yeni Kampanya</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Toplam Kampanya</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalCampaigns}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <FaBox className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Aktif Kampanya</p>
                  <p className="text-2xl font-bold text-green-900">{stats.activeCampaigns}</p>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Bekleyen Kampanya</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pendingCampaigns}</p>
                </div>
                <div className="p-3 bg-yellow-500 rounded-lg">
                  <FaClock className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Kampanya adı veya açıklaması ara..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
              {/* Suggestions */}
              {showSuggestions && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {allCampaigns
                    .filter(campaign =>
                      campaign.name?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .slice(0, 5)
                    .map(campaign => (
                      <div
                        key={campaign.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                        onClick={() => {
                          setSearchTerm(campaign.name);
                          setShowSuggestions(false);
                        }}
                      >
                        <FaSearch className="text-gray-400 text-sm" />
                        <span className="text-gray-700">{campaign.name}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Campaign Type Filter */}
            <select
              value={selectedCampaignType}
              onChange={(e) => setSelectedCampaignType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              <option value="all">Tüm Tipler</option>
              <option value="product">Ürün Kampanyası</option>
              <option value="category">Kategori Kampanyası</option>
            </select>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <FaSearch />
              <span>Ara</span>
            </button>

            {/* Clear Button */}
            <button
              onClick={handleClearFilters}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <FaTimes />
              <span>Temizle</span>
            </button>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="p-6">
          {filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Kampanya Yok</h3>
              <p className="text-gray-600 mb-6">İlk kampanyanızı oluşturmak için "Yeni Kampanya" butonuna tıklayın.</p>
              <button 
                onClick={handleCreateCampaign}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto"
              >
                <FaPlus />
                <span>İlk Kampanyanızı Oluşturun</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                          <p className="text-gray-600 text-sm">{campaign.description}</p>
                        </div>
                        <span 
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            getCampaignStatus(campaign) === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : getCampaignStatus(campaign) === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {getCampaignStatusText(campaign)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <FaTag className="text-gray-400" />
                          <span className="text-sm text-gray-600">Hedef:</span>
                          <span className="text-sm font-medium text-gray-900">{getTargetName(campaign)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <FaPercent className="text-gray-400" />
                          <span className="text-sm text-gray-600">İndirim:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {campaign.discountType === 'percentage' 
                              ? `%${campaign.discountValue}` 
                              : formatCurrency(campaign.discountValue)
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-gray-400" />
                          <span className="text-sm text-gray-600">Başlangıç:</span>
                          <span className="text-sm font-medium text-gray-900">{formatDate(campaign.startDate)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-gray-400" />
                          <span className="text-sm text-gray-600">Bitiş:</span>
                          <span className="text-sm font-medium text-gray-900">{formatDate(campaign.endDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                      <button
                        onClick={() => handleEditCampaign(campaign)}
                        className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Düzenle"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Sil"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Yeni Kampanya Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingCampaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya Oluştur'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Kampanya Adı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kampanya Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Kampanya adını girin"
                    required
                  />
                </div>

                {/* Açıklama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Kampanya açıklamasını girin"
                    rows={3}
                  />
                </div>

                {/* Kampanya Tipi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kampanya Tipi *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        value="product"
                        checked={formData.campaignType === 'product'}
                        onChange={(e) => setFormData({...formData, campaignType: e.target.value, targetId: ''})}
                        className="mr-3 text-purple-600 focus:ring-purple-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Tek Ürün</div>
                        <div className="text-sm text-gray-500">Belirli bir ürün için indirim</div>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        value="category"
                        checked={formData.campaignType === 'category'}
                        onChange={(e) => setFormData({...formData, campaignType: e.target.value, targetId: ''})}
                        className="mr-3 text-purple-600 focus:ring-purple-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Kategori</div>
                        <div className="text-sm text-gray-500">Tüm kategori için indirim</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Hedef Seçimi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.campaignType === 'product' ? 'Ürün Seçin *' : 'Kategori Seçin *'}
                  </label>
                  
                  {formData.campaignType === 'product' ? (
                    <div className="relative">
                      {/* Ürün Arama */}
                      <input
                        type="text"
                        placeholder="Ürün ara..."
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors mb-2"
                      />
                      
                      {/* Ürün Listesi */}
                      <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg">
                        {products
                          .filter(product => 
                            product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
                          )
                          .map(product => (
                            <div
                              key={product.id}
                              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors ${
                                formData.targetId === product.id ? 'bg-purple-100 text-purple-800' : ''
                              }`}
                              onClick={() => {
                                setFormData({...formData, targetId: product.id});
                                setProductSearchTerm(product.name);
                              }}
                            >
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">
                                {product.price ? `₺${product.price}` : 'Fiyat belirtilmemiş'}
                              </div>
                            </div>
                          ))
                        }
                        {products.filter(product => 
                          product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-2 text-gray-500 text-center">
                            Ürün bulunamadı
                          </div>
                        )}
                      </div>
                      
                      {/* Seçilen Ürün */}
                      {formData.targetId && (
                        <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="text-sm text-purple-800">
                            Seçilen: {products.find(p => p.id === formData.targetId)?.name}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <select
                      value={formData.targetId}
                      onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      required
                    >
                      <option value="">Seçin...</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* İndirim Tipi ve Değeri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İndirim Tipi *
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    >
                      <option value="percentage">Yüzde (%)</option>
                      <option value="fixed">Sabit Tutar (₺)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İndirim Değeri *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                        min="0"
                        max={formData.discountType === 'percentage' ? '100' : undefined}
                        step={formData.discountType === 'percentage' ? '1' : '0.01'}
                        required
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {formData.discountType === 'percentage' ? '%' : '₺'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tarih Aralığı */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlangıç Tarihi *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bitiş Tarihi *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Aktif Durumu */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="mr-3 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Kampanyayı aktif olarak başlat
                    </span>
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <FaSave />
                    <span>{editingCampaign ? 'Güncelle' : 'Oluştur'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerCampaigns; 