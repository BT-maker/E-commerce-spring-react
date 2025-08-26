import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Bell, 
  Search, 
  Filter, 
  Calendar,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  Mail,
  Clock,
  User,
  Package,
  ShoppingCart,
  Settings,
  RefreshCw,
  Download,
  MoreHorizontal
} from "lucide-react";
import "./AdminNotifications.css";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';

const AdminNotifications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0
  });
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false
  });
  
  // Filtreler
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    read: null,
    startDate: "",
    endDate: ""
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchNotifications();
      fetchStats();
    } else {
      navigate('/admin/login');
    }
  }, [user, filters, pagination.currentPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pagination.currentPage,
        size: 20,
        ...(filters.search && { search: filters.search }),
        ...(filters.type && { type: filters.type }),
        ...(filters.read !== null && { read: filters.read }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`http://localhost:8082/api/admin/notifications?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setPagination({
          currentPage: data.currentPage || 0,
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          hasNext: data.hasNext || false,
          hasPrevious: data.hasPrevious || false
        });
      } else {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Bildirimler getirilemedi: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Bildirimler getirme hatası:', error);
      toast.error(`Bildirimler yüklenirken hata oluştu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/admin/notifications/stats', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('İstatistikler getirme hatası:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "",
      read: null,
      startDate: "",
      endDate: ""
    });
    setPagination(prev => ({ ...prev, currentPage: 0 }));
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:8082/api/admin/notifications/${id}/read`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Bildirim okundu olarak işaretlendi');
        fetchNotifications();
        fetchStats();
      } else {
        throw new Error('İşlem başarısız');
      }
    } catch (error) {
      console.error('Bildirim işaretleme hatası:', error);
      toast.error('Bildirim işaretlenirken hata oluştu');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/admin/notifications/read-all', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Tüm bildirimler okundu olarak işaretlendi');
        fetchNotifications();
        fetchStats();
      } else {
        throw new Error('İşlem başarısız');
      }
    } catch (error) {
      console.error('Toplu işaretleme hatası:', error);
      toast.error('Bildirimler işaretlenirken hata oluştu');
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Bu bildirimi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8082/api/admin/notifications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Bildirim başarıyla silindi');
        fetchNotifications();
        fetchStats();
      } else {
        throw new Error('Silme işlemi başarısız');
      }
    } catch (error) {
      console.error('Bildirim silme hatası:', error);
      toast.error('Bildirim silinirken hata oluştu');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_STATUS':
        return <ShoppingCart size={16} />;
      case 'PROMOTION':
        return <Package size={16} />;
      case 'SYSTEM':
        return <Settings size={16} />;
      case 'SECURITY':
        return <AlertCircle size={16} />;
      case 'CATEGORY_REQUEST':
        return <Info size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'ORDER_STATUS':
        return 'bg-blue-100 text-blue-800';
      case 'PROMOTION':
        return 'bg-green-100 text-green-800';
      case 'SYSTEM':
        return 'bg-gray-100 text-gray-800';
      case 'SECURITY':
        return 'bg-red-100 text-red-800';
      case 'CATEGORY_REQUEST':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || user.role !== 'ADMIN') {
    return <div className="flex items-center justify-center min-h-screen">Yetkisiz erişim</div>;
  }

  return (
    <div className="admin-notifications min-h-screen bg-gray-50">
      <PageTitle title="Admin Bildirimler" />
      <MetaTags 
        title="Admin Bildirimler"
        description="Sistem bildirimlerini yönetin ve filtreleyin"
        keywords="admin bildirimler, sistem bildirimleri, yönetim"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bildirimler</h1>
              <p className="text-gray-600 mt-2">Sistem bildirimlerini yönetin ve filtreleyin</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CheckCircle size={16} className="mr-2" />
                Tümünü Okundu İşaretle
              </button>
              <button
                onClick={() => fetchNotifications()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RefreshCw size={16} className="mr-2" />
                Yenile
              </button>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg stats-card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bell-icon">
                  <Bell className="h-6 w-6 text-orange-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Toplam Bildirim</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg stats-card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Okunmuş</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.read}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg stats-card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EyeOff className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Okunmamış</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.unread}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtreler */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Filtreler</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter size={16} className="mr-2" />
                {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Arama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arama</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Bildirim ara..."
                      className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Tip */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tip</label>
                                     <select
                     value={filters.type}
                     onChange={(e) => handleFilterChange('type', e.target.value)}
                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                   >
                     <option value="">Tümü</option>
                     <option value="ORDER_STATUS">Sipariş Durumu</option>
                     <option value="PROMOTION">Promosyon</option>
                     <option value="SYSTEM">Sistem</option>
                     <option value="SECURITY">Güvenlik</option>
                     <option value="CATEGORY_REQUEST">Kategori İsteği</option>
                   </select>
                </div>

                {/* Okundu Durumu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <select
                    value={filters.read === null ? "" : filters.read.toString()}
                    onChange={(e) => handleFilterChange('read', e.target.value === "" ? null : e.target.value === "true")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Tümü</option>
                    <option value="false">Okunmamış</option>
                    <option value="true">Okunmuş</option>
                  </select>
                </div>

                {/* Tarih Aralığı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                  <input
                    type="datetime-local"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Filtreleri Temizle
                </button>
                
                <div className="text-sm text-gray-500">
                  {pagination.totalElements} bildirim bulundu
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bildirimler Listesi */}
        <div className="bg-white shadow rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Bildirimler yükleniyor...</span>
            </div>
          ) : notifications.length > 0 ? (
            <>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bildirim
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tip
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kullanıcı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <tr key={notification.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </div>
                              <div className="text-sm text-gray-500 max-w-md truncate">
                                {notification.message}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                            {notification.type}
                          </span>
                        </td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {notification.userName || '-'}
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(notification.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {notification.read ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Eye size={12} className="mr-1" />
                              Okundu
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <EyeOff size={12} className="mr-1" />
                              Okunmadı
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Okundu olarak işaretle"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Sil"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sayfalama */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevious}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Önceki
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sonraki
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">{pagination.currentPage * 20 + 1}</span> -{' '}
                        <span className="font-medium">
                          {Math.min((pagination.currentPage + 1) * 20, pagination.totalElements)}
                        </span>{' '}
                        arası, toplam{' '}
                        <span className="font-medium">{pagination.totalElements}</span> bildirim
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={!pagination.hasPrevious}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Önceki
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          Sayfa {pagination.currentPage + 1} / {pagination.totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={!pagination.hasNext}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sonraki
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Bildirim bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                Seçilen filtrelere uygun bildirim bulunmuyor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
