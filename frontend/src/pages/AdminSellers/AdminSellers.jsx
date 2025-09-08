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
  Filter,
  Mail,
  Phone,
  MapPin,
  TrendingUp
} from "lucide-react";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';
import api from "../../services/api";
import toast from 'react-hot-toast';

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

  // Stats
  const [stats, setStats] = useState({
    totalSellers: 0,
    activeSellers: 0,
    pendingSellers: 0,
    rejectedSellers: 0
  });

  useEffect(() => {
    fetchSellers();
    fetchSellerStats();
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
      toast.error('Satıcılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerStats = async () => {
    try {
      const response = await api.get("/admin/sellers/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Satıcı istatistikleri yüklenirken hata:", error);
    }
  };

  const filterSellers = () => {
    let filtered = sellers;

    if (searchQuery) {
      filtered = filtered.filter(seller =>
        seller.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.storeName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(seller => seller.status === statusFilter);
    }

    setFilteredSellers(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      case 'SUSPENDED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Aktif';
      case 'PENDING':
        return 'Beklemede';
      case 'REJECTED':
        return 'Reddedildi';
      case 'SUSPENDED':
        return 'Askıya Alındı';
      default:
        return status;
    }
  };

  const openDetailModal = (seller) => {
    setSelectedSeller(seller);
    setShowDetailModal(true);
  };

  const openRejectModal = (seller) => {
    setSelectedSeller(seller);
    setShowRejectModal(true);
  };

  const closeModals = () => {
    setShowDetailModal(false);
    setShowRejectModal(false);
    setSelectedSeller(null);
    setRejectionReason("");
  };

  const approveSeller = async (sellerId) => {
    try {
      await api.put(`/admin/sellers/${sellerId}/approve`);
      toast.success('Satıcı onaylandı');
      fetchSellers();
      fetchSellerStats();
    } catch (error) {
      console.error("Satıcı onaylanırken hata:", error);
      toast.error('Satıcı onaylanırken hata oluştu');
    }
  };

  const rejectSeller = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Red sebebi gerekli');
      return;
    }

    try {
      await api.put(`/admin/sellers/${selectedSeller.id}/reject`, {
        rejectionReason: rejectionReason
      });
      toast.success('Satıcı reddedildi');
      closeModals();
      fetchSellers();
      fetchSellerStats();
    } catch (error) {
      console.error("Satıcı reddedilirken hata:", error);
      toast.error('Satıcı reddedilirken hata oluştu');
    }
  };

  // StatCard component
  const StatCard = ({ title, value, icon: Icon, change, changeType, iconColor }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</p>
          {change && (
            <div className={`flex items-center text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Satıcılar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageTitle title="Satıcı Yönetimi" />
      <MetaTags 
        title="Satıcı Yönetimi"
        description="Satıcı hesap yönetimi. Satıcı onayları ve durum takibi."
        keywords="satıcı yönetimi, satıcı onayı, satıcı durumları"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-sm rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Store className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Satıcı Yönetimi</h1>
              <p className="text-gray-600 mt-1">Satıcı hesap yönetimi ve onayları</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
          <StatCard
            title="Toplam Satıcı"
            value={stats.totalSellers || 0}
            icon={Store}
            change="+8%"
            changeType="positive"
            iconColor="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            title="Aktif Satıcı"
            value={stats.activeSellers || 0}
            icon={UserCheck}
            change="+12%"
            changeType="positive"
            iconColor="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Bekleyen"
            value={stats.pendingSellers || 0}
            icon={Clock}
            change="+3%"
            changeType="positive"
            iconColor="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
          <StatCard
            title="Reddedilen"
            value={stats.rejectedSellers || 0}
            icon={UserX}
            change="-2%"
            changeType="negative"
            iconColor="bg-gradient-to-r from-red-500 to-red-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm mx-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Satıcı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  <option value="all">Tüm Durumlar</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="PENDING">Beklemede</option>
                  <option value="REJECTED">Reddedildi</option>
                  <option value="SUSPENDED">Askıya Alındı</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sellers Table */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm mx-6 overflow-hidden">
          {filteredSellers.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-200/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Satıcı
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Mağaza
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        İletişim
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Kayıt Tarihi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50">
                    {filteredSellers.map((seller) => (
                      <tr key={seller.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {(seller.firstName || 'S').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {seller.firstName} {seller.lastName}
                              </p>
                              <p className="text-xs text-gray-500">{seller.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Store className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {seller.storeName || 'Mağaza Adı Yok'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{seller.email}</span>
                            </div>
                            {seller.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{seller.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatDate(seller.createdAt)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(seller.status)}`}>
                            {getStatusIcon(seller.status)}
                            <span className="ml-1">{getStatusText(seller.status)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openDetailModal(seller)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                              title="Detayları Görüntüle"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {seller.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => approveSeller(seller.id)}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                                  title="Onayla"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openRejectModal(seller)}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                  title="Reddet"
                                >
                                  <XCircle className="w-4 h-4" />
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
            </>
          ) : (
            <div className="text-center py-12">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Satıcı Bulunamadı</h3>
              <p className="text-gray-500">Arama kriterlerinize uygun satıcı bulunamadı.</p>
            </div>
          )}
        </div>
      </div>

      {/* Seller Detail Modal */}
      {showDetailModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Satıcı Detayları</h2>
                <button
                  onClick={closeModals}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Seller Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                  <p className="text-gray-900 font-semibold">{selectedSeller.firstName} {selectedSeller.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900">{selectedSeller.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <p className="text-gray-900">{selectedSeller.phone || 'Telefon yok'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedSeller.status)}`}>
                    {getStatusIcon(selectedSeller.status)}
                    <span className="ml-1">{getStatusText(selectedSeller.status)}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mağaza Adı</label>
                  <p className="text-gray-900">{selectedSeller.storeName || 'Mağaza adı yok'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kayıt Tarihi</label>
                  <p className="text-gray-900">{formatDate(selectedSeller.createdAt)}</p>
                </div>
              </div>

              {/* Address */}
              {selectedSeller.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-gray-900">{selectedSeller.address}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedSeller.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Red Sebebi</label>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-800">{selectedSeller.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeModals}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                Kapat
              </button>
              {selectedSeller.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => approveSeller(selectedSeller.id)}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => {
                      closeModals();
                      openRejectModal(selectedSeller);
                    }}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Reddet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedSeller && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Satıcıyı Reddet</h2>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Red Sebebi
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Red sebebini açıklayın..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={4}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeModals}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                İptal
              </button>
              <button
                onClick={rejectSeller}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSellers;