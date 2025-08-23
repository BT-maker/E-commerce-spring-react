import React, { useState, useEffect } from "react";
import { 
  Store, 
  Search, 
  UserCheck, 
  UserX, 
  Eye,
  Calendar,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Filter
} from "lucide-react";
import "./AdminSellers.css";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';
import api from "../../services/api";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    filterSellers();
  }, [sellers, searchQuery, statusFilter]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/sellers");
      setSellers(response.data.sellers || []);
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
      filtered = filtered.filter(seller => seller.sellerStatus === statusFilter);
    }

    setFilteredSellers(filtered);
  };

  const handleApprove = async (sellerId) => {
    try {
      await api.post(`/admin/sellers/${sellerId}/approve`, {});
      fetchSellers();
    } catch (error) {
      console.error("Satıcı onaylanamadı:", error);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Red sebebi belirtilmelidir");
      return;
    }

    try {
      await api.post(`/admin/sellers/${selectedSeller.id}/reject`, {
        rejectionReason: rejectionReason
      });
      setShowRejectModal(false);
      setSelectedSeller(null);
      setRejectionReason("");
      fetchSellers();
    } catch (error) {
      console.error("Satıcı reddedilemedi:", error);
    }
  };

  const handleToggleStatus = async (sellerId) => {
    try {
      await api.post(`/admin/sellers/${sellerId}/toggle-status`);
      fetchSellers();
    } catch (error) {
      console.error("Satıcı durumu değiştirilemedi:", error);
    }
  };

  const openRejectModal = (seller) => {
    setSelectedSeller(seller);
    setShowRejectModal(true);
  };

  const openDetailModal = (seller) => {
    setSelectedSeller(seller);
    setShowDetailModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock size={16} />;
      case "APPROVED":
        return <CheckCircle size={16} />;
      case "REJECTED":
        return <XCircle size={16} />;
      case "ACTIVE":
        return <UserCheck size={16} />;
      case "INACTIVE":
        return <UserX size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Beklemede";
      case "APPROVED":
        return "Onaylandı";
      case "REJECTED":
        return "Reddedildi";
      case "ACTIVE":
        return "Aktif";
      case "INACTIVE":
        return "Pasif";
      default:
        return "Bilinmiyor";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <span className={`status-badge ${seller.sellerStatus?.toLowerCase() || 'pending'}`}>
            {getStatusIcon(seller.sellerStatus)}
            {getStatusText(seller.sellerStatus)}
          </span>
        </div>
      </div>
      
      <div className="seller-details">
        <div className="detail-item">
          <Calendar size={16} />
          <span className="detail-label">Kayıt:</span>
          <span className="detail-value">
            {formatDate(seller.registrationDate)}
          </span>
        </div>
        
        <div className="detail-item">
          <Calendar size={16} />
          <span className="detail-label">Başvuru:</span>
          <span className="detail-value">
            {formatDate(seller.sellerApplicationDate)}
          </span>
        </div>
        
        <div className="detail-item">
          <Package size={16} />
          <span className="detail-label">Telefon:</span>
          <span className="detail-value">{seller.phone || '-'}</span>
        </div>
      </div>
      
      <div className="seller-actions">
        <button 
          className="action-btn-secondary"
          onClick={() => openDetailModal(seller)}
        >
          <Eye size={16} />
          Detayları Gör
        </button>
        
        {seller.sellerStatus === "PENDING" && (
          <>
            <button 
              className="action-btn-success"
              onClick={() => handleApprove(seller.id)}
            >
              <CheckCircle size={16} />
              Onayla
            </button>
            <button 
              className="action-btn-danger"
              onClick={() => openRejectModal(seller)}
            >
              <XCircle size={16} />
              Reddet
            </button>
          </>
        )}
        
        {(seller.sellerStatus === "APPROVED" || 
          seller.sellerStatus === "ACTIVE" || 
          seller.sellerStatus === "INACTIVE") && (
          <button 
            className={seller.sellerStatus === "ACTIVE" ? "action-btn-danger" : "action-btn-success"}
            onClick={() => handleToggleStatus(seller.id)}
          >
            {seller.sellerStatus === "ACTIVE" ? <UserX size={16} /> : <UserCheck size={16} />}
            {seller.sellerStatus === "ACTIVE" ? "Pasifleştir" : "Aktifleştir"}
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
           <div className="admin-seller-stat-item admin-seller-stat-item-total">
             <div className="stat-icon total">
               <Store size={24} />
             </div>
             <div className="stat-content">
               <span className="stat-value">{sellers.length}</span>
               <span className="stat-label">Toplam Satıcı</span>
             </div>
           </div>
           <div className="admin-seller-stat-item admin-seller-stat-item-active">
             <div className="stat-icon active">
               <UserCheck size={24} />
             </div>
             <div className="stat-content">
               <span className="stat-value">{sellers.filter(s => s.sellerStatus === 'ACTIVE').length}</span>
               <span className="stat-label">Aktif Satıcı</span>
             </div>
           </div>
           <div className="admin-seller-stat-item admin-seller-stat-item-pending">
             <div className="stat-icon pending">
               <Clock size={24} />
             </div>
             <div className="stat-content">
               <span className="stat-value">{sellers.filter(s => s.sellerStatus === 'PENDING').length}</span>
               <span className="stat-label">Onay Bekleyen</span>
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
          <div className="filter-item">
            <Filter size={16} />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="PENDING">Beklemede</option>
              <option value="APPROVED">Onaylandı</option>
              <option value="REJECTED">Reddedildi</option>
              <option value="ACTIVE">Aktif</option>
              <option value="INACTIVE">Pasif</option>
            </select>
          </div>
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

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Satıcı Başvurusunu Reddet</h3>
              <button 
                className="close-btn"
                onClick={() => setShowRejectModal(false)}
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="seller-info-modal">
                <p><strong>Satıcı:</strong> {selectedSeller?.firstName} {selectedSeller?.lastName}</p>
                <p><strong>Email:</strong> {selectedSeller?.email}</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="rejectionReason">Red Sebebi *</label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Red sebebini belirtin..."
                  rows={4}
                  required
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowRejectModal(false)}
              >
                İptal
              </button>
              <button 
                className="submit-btn reject"
                onClick={handleReject}
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Satıcı Detayları</h3>
              <button 
                className="close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="seller-detail-info">
                <div className="detail-section">
                  <h4>Kişisel Bilgiler</h4>
                  <div className="detail-row">
                    <span className="detail-label">Ad Soyad:</span>
                    <span className="detail-value">{selectedSeller?.firstName} {selectedSeller?.lastName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedSeller?.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Telefon:</span>
                    <span className="detail-value">{selectedSeller?.phone || '-'}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Satıcı Durumu</h4>
                  <div className="detail-row">
                    <span className="detail-label">Durum:</span>
                    <span className={`status-badge ${selectedSeller?.sellerStatus?.toLowerCase() || 'pending'}`}>
                      {getStatusIcon(selectedSeller?.sellerStatus)}
                      {getStatusText(selectedSeller?.sellerStatus)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Kayıt Tarihi:</span>
                    <span className="detail-value">{formatDate(selectedSeller?.registrationDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Başvuru Tarihi:</span>
                    <span className="detail-value">{formatDate(selectedSeller?.sellerApplicationDate)}</span>
                  </div>
                  {selectedSeller?.approvalDate && (
                    <div className="detail-row">
                      <span className="detail-label">Onay Tarihi:</span>
                      <span className="detail-value">{formatDate(selectedSeller?.approvalDate)}</span>
                    </div>
                  )}
                  {selectedSeller?.rejectionReason && (
                    <div className="detail-row">
                      <span className="detail-label">Red Sebebi:</span>
                      <span className="detail-value rejection-reason">{selectedSeller?.rejectionReason}</span>
                    </div>
                  )}
                </div>

                {selectedSeller?.approvedBy && (
                  <div className="detail-section">
                    <h4>Onaylayan Admin</h4>
                    <div className="detail-row">
                      <span className="detail-label">Admin:</span>
                      <span className="detail-value">{selectedSeller?.approvedBy?.firstName} {selectedSeller?.approvedBy?.lastName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Admin Email:</span>
                      <span className="detail-value">{selectedSeller?.approvedBy?.email}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDetailModal(false)}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSellers;
