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
import './SellerCampaigns.css';

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
      console.log('Tüm kampanya verileri:', data);
      
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
      const response = await fetch('http://localhost:8082/api/seller/products?page=0&size=1000', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        } else {
          setProducts(data);
        }
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
        setCategories(data);
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
    setShowModal(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description,
      discountType: campaign.discountType,
      discountValue: campaign.discountValue.toString(),
      campaignType: campaign.campaignType,
      targetId: campaign.targetId,
      startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
      endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
      isActive: campaign.isActive
    });
    setShowModal(true);
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('Bu kampanyayı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`http://localhost:8082/api/seller/campaigns/${campaignId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          await fetchAllCampaigns();
        } else {
          console.error('Kampanya silinemedi');
        }
      } catch (error) {
        console.error('Kampanya silme hatası:', error);
      }
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
          ...formData,
          discountValue: parseFloat(formData.discountValue)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchAllCampaigns();
      setShowModal(false);
      setEditingCampaign(null);
    } catch (err) {
      console.error('Kampanya kaydetme hatası:', err);
      alert('Kampanya kaydedilirken bir hata oluştu.');
    }
  };

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

  const getCampaignStatusColor = (campaign) => {
    const status = getCampaignStatus(campaign);
    switch (status) {
      case 'active': return '#059669';
      case 'pending': return '#d97706';
      case 'expired': return '#dc2626';
      case 'inactive': return '#6b7280';
      default: return '#6b7280';
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

  const getStats = () => {
    const totalCampaigns = allCampaigns.length;
    const activeCampaigns = allCampaigns.filter(c => getCampaignStatus(c) === 'active').length;
    const pendingCampaigns = allCampaigns.filter(c => getCampaignStatus(c) === 'pending').length;
    
    return { totalCampaigns, activeCampaigns, pendingCampaigns };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="seller-campaigns">
        <div className="campaigns-loading">
          <div className="loading-spinner"></div>
          <h3>Kampanya Verileri Yükleniyor...</h3>
          <p>Verileriniz hazırlanıyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-campaigns">
        <div className="campaigns-error">
          <div className="error-icon">⚠️</div>
          <h3>Bir Hata Oluştu</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchAllCampaigns}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-campaigns">
      {/* Header */}
      <div className="campaigns-header">
        <div className="header-content">
          <h2>Kampanyalarım</h2>
        </div>
        <button className="create-campaign-btn" onClick={handleCreateCampaign}>
          <FaPlus /> Yeni Kampanya
        </button>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="search-filters">
        <div className="search-row">
          <div className="search-group">
            <input
              type="text"
              placeholder="Kampanya adı veya açıklaması ara..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
            />
            {/* Öneriler */}
            {showSuggestions && searchTerm && (
              <div className="search-suggestions">
                {allCampaigns
                  .filter(campaign =>
                    campaign.name?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 5)
                  .map(campaign => (
                    <div
                      key={campaign.id}
                      className="suggestion-item"
                      onClick={() => {
                        setSearchTerm(campaign.name);
                        setShowSuggestions(false);
                      }}
                    >
                      <FaSearch className="suggestion-icon" />
                      <span>{campaign.name}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="search-group">
            <select
              value={selectedCampaignType}
              onChange={(e) => {
                setSelectedCampaignType(e.target.value);
              }}
            >
              <option value="all">Tüm Tipler</option>
              <option value="product">Ürün Kampanyası</option>
              <option value="category">Kategori Kampanyası</option>
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



      {/* Campaigns Grid */}
      <div className="campaigns-container">
        {filteredCampaigns.length === 0 ? (
          <div className="no-campaigns">
            <div className="no-campaigns-icon">🎯</div>
            <h3>Henüz Kampanya Yok</h3>
            <p>İlk kampanyanızı oluşturmak için "Yeni Kampanya" butonuna tıklayın.</p>
          </div>
        ) : (
          <div className="campaigns-grid">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-header">
                  <div className="campaign-info">
                    <h3>{campaign.name}</h3>
                    <p>{campaign.description}</p>
                  </div>
                  <div className="campaign-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getCampaignStatusColor(campaign) }}
                    >
                      {getCampaignStatusText(campaign)}
                    </span>
                  </div>
                </div>

                <div className="campaign-details">
                  <div className="detail-item">
                    <FaTag />
                    <span className="detail-label">Hedef:</span>
                    <span className="detail-value">{getTargetName(campaign)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FaPercent />
                    <span className="detail-label">İndirim:</span>
                    <span className="detail-value">
                      {campaign.discountType === 'percentage' 
                        ? `%${campaign.discountValue}` 
                        : formatCurrency(campaign.discountValue)
                      }
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <span className="detail-label">Başlangıç:</span>
                    <span className="detail-value">{formatDate(campaign.startDate)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <span className="detail-label">Bitiş:</span>
                    <span className="detail-value">{formatDate(campaign.endDate)}</span>
                  </div>
                </div>

                <div className="campaign-actions">
                  <button 
                    className="action-btn edit-btn" 
                    onClick={() => handleEditCampaign(campaign)}
                    title="Düzenle"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    title="Sil"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCampaign ? 'Kampanya Düzenle' : 'Yeni Kampanya'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-content">
              <div className="form-group">
                <label htmlFor="name">Kampanya Adı *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Açıklama</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="campaignType">Kampanya Türü *</label>
                  <select
                    id="campaignType"
                    value={formData.campaignType}
                    onChange={(e) => setFormData({...formData, campaignType: e.target.value, targetId: ''})}
                    required
                    className="form-select"
                  >
                    <option value="product">Ürün İndirimi</option>
                    <option value="category">Kategori İndirimi</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="targetId">Hedef {formData.campaignType === 'product' ? 'Ürün' : 'Kategori'} *</label>
                  <select
                    id="targetId"
                    value={formData.targetId}
                    onChange={(e) => setFormData({...formData, targetId: e.target.value})}
                    required
                    className="form-select"
                  >
                    <option value="">Seçiniz</option>
                    {formData.campaignType === 'product' 
                      ? products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))
                      : categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                    }
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="discountType">İndirim Türü *</label>
                  <select
                    id="discountType"
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    required
                    className="form-select"
                  >
                    <option value="percentage">Yüzde (%)</option>
                    <option value="fixed">Sabit Tutar (₺)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="discountValue">İndirim Değeri *</label>
                  <input
                    type="number"
                    id="discountValue"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    required
                    min="0"
                    step={formData.discountType === 'percentage' ? '1' : '0.01'}
                    className="form-input"
                    placeholder={formData.discountType === 'percentage' ? '10' : '50.00'}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Başlangıç Tarihi *</label>
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">Bitiş Tarihi *</label>
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="form-checkbox"
                  />
                  <span>Kampanya Aktif</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  <FaSave />
                  {editingCampaign ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerCampaigns; 