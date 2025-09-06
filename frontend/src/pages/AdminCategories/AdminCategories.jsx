import React, { useState, useEffect, useContext } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package, CheckCircle, X, Clock, Eye, AlertCircle, FolderOpen, Bell } from 'lucide-react';
import api from '../../services/api';
import categoryRequestApi from '../../services/categoryRequestApi';
import webSocketService from '../../services/webSocketService';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';


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
    imageUrl: '',
    priority: 0
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
      setFormData({ name: '', description: '', imageUrl: '', priority: 0 });
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
      imageUrl: category.imageUrl || '',
      priority: category.priority || 0
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-sm rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <FolderOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kategori Yönetimi</h1>
            <p className="text-gray-600 mt-1">Ürün kategorilerini ve kategori isteklerini yönetin</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Submenü */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm mb-8">
          <div className="flex space-x-1 p-2">
            <button
              className={`flex items-center space-x-3 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'categories' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-[1.02]' 
                  : 'text-gray-600 hover:bg-gray-100/80 hover:scale-[1.01]'
              }`}
              onClick={() => setActiveTab('categories')}
            >
              <FolderOpen size={20} />
              <span>Kategoriler</span>
            </button>
            <button
              className={`flex items-center space-x-3 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === 'requests' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-[1.02]' 
                  : 'text-gray-600 hover:bg-gray-100/80 hover:scale-[1.01]'
              }`}
              onClick={() => setActiveTab('requests')}
            >
              <Bell size={20} />
              <span>Kategori İstekleri</span>
            </button>
          </div>
        </div>

        {/* Kategoriler Tab */}
        {activeTab === 'categories' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Kategori Listesi</h2>
                <p className="text-gray-600">Mevcut kategorileri görüntüleyin ve yönetin</p>
              </div>
              <button 
                className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                <Plus size={20} />
                <span>Yeni Kategori</span>
              </button>
            </div>

            {/* Arama */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6 mb-8">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Kategori ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Kategori Listesi */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-3 text-gray-600">Kategoriler yükleniyor...</span>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Kategori bulunamadı</h3>
                  <p className="text-gray-500">Arama kriterlerinize uygun kategori bulunmuyor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                      <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        {category.imageUrl ? (
                          <img 
                            src={category.imageUrl} 
                            alt={category.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-48 flex items-center justify-center" style={{display: category.imageUrl ? 'none' : 'flex'}}>
                          <Package size={48} className="text-gray-400" />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{category.name}</h3>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              Öncelik: {category.priority || 0}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {category.description || 'Bu kategori için henüz açıklama eklenmemiş.'}
                        </p>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            onClick={() => handleEdit(category)}
                            title="Düzenle"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            onClick={() => handleDelete(category.id)}
                            title="Sil"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Kategori İstekleri</h2>
                <p className="text-gray-600">Satıcıların kategori isteklerini yönetin</p>
              </div>
            </div>

            {/* Filtre */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6 mb-8">
              <div className="flex items-center space-x-4">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="ALL">Tüm İstekler</option>
                  <option value="PENDING">Bekleyen</option>
                  <option value="APPROVED">Onaylanan</option>
                  <option value="REJECTED">Reddedilen</option>
                </select>
              </div>
            </div>

            {/* İstekler Listesi */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
              {requestsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-3 text-gray-600">İstekler yükleniyor...</span>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Kategori isteği bulunamadı</h3>
                  <p className="text-gray-500">Seçilen filtrelere uygun istek bulunmuyor.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-200/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satıcı</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori Adı</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50">
                      {requests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {(request.sellerName || request.seller?.firstName || 'S').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {request.sellerName || (request.seller?.firstName && request.seller?.lastName 
                                    ? `${request.seller.firstName} ${request.seller.lastName}`
                                    : request.seller?.email || 'Bilinmeyen Satıcı')}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {request.sellerEmail || request.seller?.email || 'Email bilgisi yok'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{request.categoryName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {request.description || 'Açıklama yok'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              (request.status || request.statusText) === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              (request.status || request.statusText) === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              (request.status || request.statusText) === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {getStatusIcon(request.status || request.statusText)}
                              <span className="ml-1">{getStatusText(request.status || request.statusText)}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                onClick={() => handleViewDetails(request)}
                                title="Detayları Görüntüle"
                              >
                                <Eye size={16} />
                              </button>
                              {request.status === 'PENDING' && (
                                <>
                                  <button
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                    onClick={() => handleApprove(request.id)}
                                    disabled={processingRequest === request.id}
                                    title="Onayla"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <button
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
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
              <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6 mt-8">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Sayfa {currentPage + 1} / {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      Önceki
                    </button>
                    <button
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                    >
                      Sonraki
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Kategori Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
              </h2>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Kategori adını girin"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="Kategori açıklaması"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik Sırası</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value) || 0})}
                  placeholder="0-100 arası değer girin"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">Yüksek sayı = Yüksek öncelik (önce görünür)</p>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105"
                >
                  {editingCategory ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* İstek Detay Modal */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Kategori İsteği Detayları</h2>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsDetailModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Satıcı</label>
                  <p className="text-gray-900">
                    {selectedRequest.sellerName || (selectedRequest.seller?.firstName && selectedRequest.seller?.lastName 
                      ? `${selectedRequest.seller.firstName} ${selectedRequest.seller.lastName}`
                      : selectedRequest.seller?.email || 'Bilinmeyen Satıcı')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900">{selectedRequest.sellerEmail || selectedRequest.seller?.email || 'Email bilgisi yok'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Adı</label>
                  <p className="text-gray-900">{selectedRequest.categoryName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <p className="text-gray-900">{selectedRequest.description || 'Açıklama yok'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    (selectedRequest.status || selectedRequest.statusText) === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    (selectedRequest.status || selectedRequest.statusText) === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    (selectedRequest.status || selectedRequest.statusText) === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusIcon(selectedRequest.status || selectedRequest.statusText)}
                    <span className="ml-2">{getStatusText(selectedRequest.status || selectedRequest.statusText)}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Oluşturulma Tarihi</label>
                  <p className="text-gray-900">{new Date(selectedRequest.createdAt).toLocaleString('tr-TR')}</p>
                </div>
                {selectedRequest.rejectionReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Red Sebebi</label>
                    <p className="text-red-600 bg-red-50 p-3 rounded-lg">{selectedRequest.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Red Modal */}
      {isRejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">İsteği Reddet</h2>
              <button 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={() => setIsRejectModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleReject(); }} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Red Sebebi *</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Red sebebini yazın..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsRejectModalOpen(false)} 
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
                >
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
