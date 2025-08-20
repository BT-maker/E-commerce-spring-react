import React, { useState, useEffect } from "react";
import { 
  Store, 
  Search, 
  UserCheck, 
  UserX, 
  Eye,
  Calendar,
  Package,
  DollarSign
} from "lucide-react";
import "./AdminSellers.css";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    filterSellers();
  }, [sellers, searchQuery, statusFilter]);

  const fetchSellers = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/admin/sellers", {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSellers(data);
      }
    } catch (error) {
      console.error("Satıcılar yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSellers = () => {
    let filtered = sellers;

    // Arama filtresi
    if (searchQuery) {
      filtered = filtered.filter(seller => 
        seller.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Durum filtresi
    if (statusFilter !== "all") {
      filtered = filtered.filter(seller => seller.status === statusFilter);
    }

    setFilteredSellers(filtered);
  };

  const handleSellerAction = async (sellerId, action) => {
    try {
      const response = await fetch(`http://localhost:8082/api/admin/sellers/${sellerId}/${action}`, {
        method: 'PUT',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchSellers(); // Listeyi yenile
      }
    } catch (error) {
      console.error("Satıcı işlemi hatası:", error);
    }
  };

  const SellerCard = ({ seller }) => (
    <div className="seller-card">
      <div className="seller-header">
        <div className="seller-avatar">
          <Store size={24} />
        </div>
        <div className="seller-info">
          <h3 className="seller-name">{seller.firstName} {seller.lastName}</h3>
          <p className="seller-email">{seller.email}</p>
        </div>
        <div className="seller-status">
          <span className={`status-badge ${seller.status?.toLowerCase() || 'pending'}`}>
            {seller.status === 'ACTIVE' ? 'Aktif' : 
             seller.status === 'INACTIVE' ? 'Pasif' : 'Beklemede'}
          </span>
        </div>
      </div>
      
      <div className="seller-details">
        <div className="detail-item">
          <Calendar size={16} />
          <span className="detail-label">Kayıt:</span>
          <span className="detail-value">
            {new Date(seller.createdAt).toLocaleDateString('tr-TR')}
          </span>
        </div>
        
        <div className="detail-item">
          <Package size={16} />
          <span className="detail-label">Ürün Sayısı:</span>
          <span className="detail-value">0</span>
        </div>
        
        <div className="detail-item">
          <DollarSign size={16} />
          <span className="detail-label">Toplam Satış:</span>
          <span className="detail-value">₺0</span>
        </div>
      </div>
      
      <div className="seller-actions">
        <button className="action-btn-secondary">
          <Eye size={16} />
          Detayları Gör
        </button>
        
        {seller.status === 'ACTIVE' ? (
          <button 
            className="action-btn-danger"
            onClick={() => handleSellerAction(seller.id, 'deactivate')}
          >
            <UserX size={16} />
            Pasifleştir
          </button>
        ) : (
          <button 
            className="action-btn-success"
            onClick={() => handleSellerAction(seller.id, 'activate')}
          >
            <UserCheck size={16} />
            Aktifleştir
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="admin-sellers">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Satıcılar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-sellers">
      <PageTitle title="Satıcı Yönetimi" />
      <MetaTags 
        title="Satıcı Yönetimi"
        description="E-Ticaret platformu satıcı yönetimi sayfası."
        keywords="admin, satıcı yönetimi, satıcılar"
      />

      <div className="page-header">
        <div className="header-content">
          <h1>Satıcı Yönetimi</h1>
          <p>Platform satıcılarını yönetin ve izleyin</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-icon total">
              <Store size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{sellers.length}</span>
              <span className="stat-label">Toplam Satıcı</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon active">
              <UserCheck size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{sellers.filter(s => s.status === 'ACTIVE').length}</span>
              <span className="stat-label">Aktif Satıcı</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="filters-section">
        <div className="search-filter">
          <div className="search-input-wrapper">
            <Search size={20} />
            <input
              type="text"
              placeholder="Satıcı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-controls">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="ACTIVE">Aktif</option>
            <option value="INACTIVE">Pasif</option>
            <option value="PENDING">Beklemede</option>
          </select>
        </div>
      </div>

      {/* Satıcı Listesi */}
      <div className="sellers-grid">
        {filteredSellers.length > 0 ? (
          filteredSellers.map((seller) => (
            <SellerCard key={seller.id} seller={seller} />
          ))
        ) : (
          <div className="empty-state">
            <Store size={48} />
            <p>Satıcı bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSellers;
