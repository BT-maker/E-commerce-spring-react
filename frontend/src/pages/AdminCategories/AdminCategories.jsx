import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package, CheckCircle, X, Clock, Eye, AlertCircle, FolderOpen, Bell } from 'lucide-react';
import api from '../../services/api';
import categoryRequestApi from '../../services/categoryRequestApi';
import webSocketService from '../../services/webSocketService';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './AdminCategories.css';

const AdminCategories = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' veya 'requests'
  
  // Kategori state'leri
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });

  // Kategori istekleri state'leri
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingRequest, setProcessingRequest] = useState(null);

  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab]);

  // WebSocket bildirimleri için useEffect
  useEffect(() => {
    if (user && user.role === 'ADMIN' && activeTab === 'requests') {
      // Kategori istek bildirimlerini dinle
      webSocketService.subscribe('/user/queue/category-requests', (notification) => {
        console.log('Yeni kategori istek bildirimi:', notification);
        toast.success(notification.message);
        fetchRequests(); // Listeyi yenile
      });

      // Genel topic'i de dinle
      webSocketService.subscribe('/topic/category-requests', (notification) => {
        console.log('Genel kategori istek bildirimi:', notification);
        toast.success(notification.message);
        fetchRequests(); // Listeyi yenile
      });

      return () => {
        webSocketService.unsubscribe('/user/queue/category-requests');
        webSocketService.unsubscribe('/topic/category-requests');
      };
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [selectedStatus, currentPage, activeTab]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      toast.error('Kategoriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    setRequestsLoading(true);
    try {
      let response;
      if (selectedStatus === 'ALL') {
        response = await categoryRequestApi.getAllRequests(currentPage, 10);
      } else {
        response = await categoryRequestApi.getRequestsByStatus(selectedStatus, currentPage, 10);
      }
      setRequests(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('İstekler alınamadı:', error);
      toast.error('İstekler yüklenirken hata oluştu');
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Güncelleme
        await api.put(`/categories/${editingCategory.id}`, formData);
        toast.success('Kategori başarıyla güncellendi');
      } else {
        // Yeni kategori ekleme
        await api.post('/categories', formData);
        toast.success('Kategori başarıyla eklendi');
      }
      
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', imageUrl: '' });
      fetchCategories();
    } catch (error) {
      console.error('Kategori işlemi hatası:', error);
      toast.error(editingCategory ? 'Kategori güncellenirken hata oluştu' : 'Kategori eklenirken hata oluştu');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/categories/${categoryId}`);
        toast.success('Kategori başarıyla silindi');
        fetchCategories();
      } catch (error) {
        console.error('Kategori silme hatası:', error);
        toast.error('Kategori silinirken hata oluştu');
      }
    }
  };

  const handleApprove = async (requestId) => {
    setProcessingRequest(requestId);
    try {
      await categoryRequestApi.approveRequest(requestId);
      toast.success('İstek başarıyla onaylandı!');
      fetchRequests();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'İstek onaylanamadı';
      toast.error(errorMessage);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Red sebebi gereklidir');
      return;
    }

    setProcessingRequest(selectedRequest.id);
    try {
      await categoryRequestApi.rejectRequest(selectedRequest.id, rejectionReason);
      toast.success('İstek başarıyla reddedildi!');
      setIsRejectModalOpen(false);
      setRejectionReason('');
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'İstek reddedilemedi';
      toast.error(errorMessage);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const getStatusIcon = (status) => {
    if (!status) return <AlertCircle className="w-4 h-4 text-gray-500" />;
    
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Bilinmiyor';
    
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Beklemede';
      case 'APPROVED':
        return 'Onaylandı';
      case 'REJECTED':
        return 'Reddedildi';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusClass = (status) => {
    if (!status) return 'status-unknown';
    
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'status-pending';
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return 'status-unknown';
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({ name: '', description: '', imageUrl: '' });
    setEditingCategory(null);
  };

  return (
    <div className="admin-categories">
      {/* Submenü */}
      <div className="submenu">
        <button
          className={`submenu-item ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <FolderOpen size={20} />
          Kategoriler
        </button>
        <button
          className={`submenu-item ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <Bell size={20} />
          Kategori İstekleri
        </button>
      </div>

      {/* Kategoriler Tab */}
      {activeTab === 'categories' && (
        <>
          <div className="categories-header">
            <div className="header-left">
              <h1>Kategori Yönetimi</h1>
              <p>Ürün kategorilerini yönetin</p>
            </div>
            <button 
              className="add-button"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              <Plus size={20} />
              Yeni Kategori
            </button>
          </div>

          {/* Arama */}
          <div className="search-section">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Kategori Listesi */}
          <div className="categories-list">
            {loading ? (
              <div className="loading">Kategoriler yükleniyor...</div>
            ) : filteredCategories.length === 0 ? (
              <div className="empty-state">
                <Package size={48} />
                <p>Kategori bulunamadı</p>
              </div>
            ) : (
              <div className="categories-grid">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="category-card">
                    <div className="category-image">
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={category.name} />
                      ) : (
                        <Package size={48} color="#64748b" />
                      )}
                    </div>
                    <div className="category-content">
                      <h3>{category.name}</h3>
                      <p>{category.description || 'Bu kategori için henüz açıklama eklenmemiş.'}</p>
                    </div>
                    <div className="category-actions">
                      <button
                        className="admin-category-action-btn admin-category-edit-btn"
                        onClick={() => handleEdit(category)}
                        title="Düzenle"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="admin-category-action-btn admin-category-delete-btn"
                        onClick={() => handleDelete(category.id)}
                        title="Sil"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Kategori İstekleri Tab */}
      {activeTab === 'requests' && (
        <>
          <div className="categories-header">
            <div className="header-left">
              <h1>Kategori İstekleri</h1>
              <p>Satıcıların kategori isteklerini yönetin</p>
            </div>
          </div>

          {/* Filtre */}
          <div className="filter-section">
            <Filter size={20} />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="status-filter"
            >
              <option value="ALL">Tüm İstekler</option>
              <option value="PENDING">Bekleyen</option>
              <option value="APPROVED">Onaylanan</option>
              <option value="REJECTED">Reddedilen</option>
            </select>
          </div>

          {/* İstekler Listesi */}
          <div className="requests-list">
            {requestsLoading ? (
              <div className="loading">İstekler yükleniyor...</div>
            ) : requests.length === 0 ? (
              <div className="empty-state">
                <Bell size={48} />
                <p>Kategori isteği bulunamadı</p>
              </div>
            ) : (
              <div className="requests-table">
                <table>
                  <thead>
                    <tr>
                      <th>Satıcı</th>
                      <th>Kategori Adı</th>
                      <th>Açıklama</th>
                      <th>Durum</th>
                      <th>Tarih</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id}>
                                                 <td>
                           <div className="seller-info">
                             <span className="seller-name">
                               {request.sellerName || request.seller?.firstName && request.seller?.lastName 
                                 ? `${request.seller.firstName} ${request.seller.lastName}`
                                 : request.seller?.email || 'Bilinmeyen Satıcı'}
                             </span>
                             <span className="seller-email">{request.sellerEmail || request.seller?.email || 'Email bilgisi yok'}</span>
                           </div>
                         </td>
                        <td>{request.categoryName}</td>
                        <td>
                          <div className="description-cell">
                            {request.description || 'Açıklama yok'}
                          </div>
                        </td>
                                                 <td>
                           <span className={`status-badge ${getStatusClass(request.status || request.statusText)}`}>
                             {getStatusIcon(request.status || request.statusText)}
                             {getStatusText(request.status || request.statusText)}
                           </span>
                         </td>
                        <td>
                          {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td>
                          <div className="request-actions">
                            <button
                              className="admin-category-action-btn admin-category-view-btn"
                              onClick={() => handleViewDetails(request)}
                              title="Detayları Görüntüle"
                            >
                              <Eye size={16} />
                            </button>
                            {request.status === 'PENDING' && (
                              <>
                                <button
                                  className="admin-category-action-btn admin-category-approve-btn"
                                  onClick={() => handleApprove(request.id)}
                                  disabled={processingRequest === request.id}
                                  title="Onayla"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  className="admin-category-action-btn admin-category-reject-btn"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setIsRejectModalOpen(true);
                                  }}
                                  disabled={processingRequest === request.id}
                                  title="Reddet"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Önceki
              </button>
              <span className="page-info">
                Sayfa {currentPage + 1} / {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      )}

      {/* Kategori Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Kategori Adı</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Görsel URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  İptal
                </button>
                <button type="submit" className="submit-btn">
                  {editingCategory ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* İstek Detay Modal */}
      {isDetailModalOpen && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Kategori İsteği Detayları</h2>
              <button className="close-btn" onClick={() => setIsDetailModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
                         <div className="modal-content">
               <div className="detail-group">
                 <label>Satıcı:</label>
                 <p>
                   {selectedRequest.sellerName || selectedRequest.seller?.firstName && selectedRequest.seller?.lastName 
                     ? `${selectedRequest.seller.firstName} ${selectedRequest.seller.lastName}`
                     : selectedRequest.seller?.email || 'Bilinmeyen Satıcı'}
                 </p>
               </div>
               <div className="detail-group">
                 <label>Email:</label>
                 <p>{selectedRequest.sellerEmail || selectedRequest.seller?.email || 'Email bilgisi yok'}</p>
               </div>
              <div className="detail-group">
                <label>Kategori Adı:</label>
                <p>{selectedRequest.categoryName}</p>
              </div>
              <div className="detail-group">
                <label>Açıklama:</label>
                <p>{selectedRequest.description || 'Açıklama yok'}</p>
              </div>
                             <div className="detail-group">
                 <label>Durum:</label>
                 <span className={`status-badge ${getStatusClass(selectedRequest.status || selectedRequest.statusText)}`}>
                   {getStatusIcon(selectedRequest.status || selectedRequest.statusText)}
                   {getStatusText(selectedRequest.status || selectedRequest.statusText)}
                 </span>
               </div>
              <div className="detail-group">
                <label>Oluşturulma Tarihi:</label>
                <p>{new Date(selectedRequest.createdAt).toLocaleString('tr-TR')}</p>
              </div>
              {selectedRequest.rejectionReason && (
                <div className="detail-group">
                  <label>Red Sebebi:</label>
                  <p className="rejection-reason">{selectedRequest.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Red Modal */}
      {isRejectModalOpen && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>İsteği Reddet</h2>
              <button className="close-btn" onClick={() => setIsRejectModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleReject(); }} className="modal-form">
              <div className="form-group">
                <label>Red Sebebi</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Red sebebini yazın..."
                  rows={4}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsRejectModalOpen(false)} className="cancel-btn">
                  İptal
                </button>
                <button type="submit" className="submit-btn reject">
                  Reddet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
