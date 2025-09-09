import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  User,
  Store,
  Shield
} from "lucide-react";

import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalUsers: 0,
    hasNext: false,
    hasPrevious: false
  });
  const [stats, setStats] = useState({
    totalUserCount: 0,
    totalSellerCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchUsersWithRole();
  }, []);



  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsersWithRole(0);
  };

  const handleRoleFilter = (role) => {
    console.log("=== FRONTEND ROLE FILTER DEBUG ===");
    console.log("Selected role:", role);
    console.log("Previous roleFilter:", roleFilter);
    setRoleFilter(role);
    // Yeni rol değeri ile fetchUsers çağır
    fetchUsersWithRole(0, role);
  };

  const fetchUsersWithRole = async (page = 0, roleParam = null) => {
    try {
      setLoading(true);
      
      let url = `http://localhost:8082/api/admin/users?page=${page}&size=10`;
      
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      
      // roleParam parametresi varsa onu kullan, yoksa roleFilter state'ini kullan
      const roleToUse = roleParam !== null ? roleParam : roleFilter;
      if (roleToUse) {
        console.log("Adding role filter to URL:", roleToUse);
        url += `&role=${encodeURIComponent(roleToUse)}`;
      }
      console.log("Final URL:", url);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Users data received:", data);
        
        setUsers(data.users);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalUsers: data.totalUsers,
          hasNext: data.hasNext,
          hasPrevious: data.hasPrevious
        });
        setStats({
          totalUserCount: data.totalUserCount,
          totalSellerCount: data.totalSellerCount
        });
      } else {
        console.error("Users response not ok:", response.status);
        const errorText = await response.text();
        console.error("Users error response:", errorText);
      }
    } catch (error) {
      console.error("Kullanıcı veri yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchUsersWithRole(newPage);
  };

  // Kullanıcı görüntüle
  const handleViewUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8082/api/admin/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setSelectedUser(userData);
        setShowViewModal(true);
      } else {
        console.error("Kullanıcı bilgileri alınamadı:", response.status);
      }
    } catch (error) {
      console.error("Kullanıcı görüntüleme hatası:", error);
    }
  };

  // Kullanıcı düzenle
  const handleEditUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8082/api/admin/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setSelectedUser(userData);
        setEditFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          address1: userData.address1 || '',
          address2: userData.address2 || '',
          birthDate: userData.birthDate || ''
        });
        setShowEditModal(true);
      } else {
        console.error("Kullanıcı bilgileri alınamadı:", response.status);
      }
    } catch (error) {
      console.error("Kullanıcı düzenleme hatası:", error);
    }
  };

  // Kullanıcı güncelle
  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(editFormData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Kullanıcı güncellendi:", result);
        setShowEditModal(false);
        setSelectedUser(null);
        setEditFormData({});
        // Kullanıcı listesini yenile
        fetchUsersWithRole(pagination.currentPage);
      } else {
        console.error("Kullanıcı güncellenemedi:", response.status);
      }
    } catch (error) {
      console.error("Kullanıcı güncelleme hatası:", error);
    }
  };

  // Kullanıcıyı aktifleştir
  const handleActivateUser = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/admin/users/${selectedUser.id}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Kullanıcı aktifleştirildi:", result);
        setShowDeleteModal(false);
        setSelectedUser(null);
        // Kullanıcı listesini yenile
        fetchUsersWithRole(pagination.currentPage);
        alert("Kullanıcı başarıyla aktifleştirildi!");
      } else {
        const errorData = await response.json();
        console.error("Kullanıcı aktifleştirilemedi:", response.status, errorData);
        alert(`Hata: ${errorData.error || 'Kullanıcı aktifleştirilemedi'}`);
      }
    } catch (error) {
      console.error("Kullanıcı aktifleştirme hatası:", error);
      alert("Kullanıcı aktifleştirilirken bir hata oluştu!");
    }
  };

  // Kullanıcıyı pasifleştir
  const handleDeactivateUser = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/admin/users/${selectedUser.id}/deactivate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Kullanıcı pasifleştirildi:", result);
        setShowDeleteModal(false);
        setSelectedUser(null);
        // Kullanıcı listesini yenile
        fetchUsersWithRole(pagination.currentPage);
        alert("Kullanıcı başarıyla pasifleştirildi!");
      } else {
        const errorData = await response.json();
        console.error("Kullanıcı pasifleştirilemedi:", response.status, errorData);
        alert(`Hata: ${errorData.error || 'Kullanıcı pasifleştirilemedi'}`);
      }
    } catch (error) {
      console.error("Kullanıcı pasifleştirme hatası:", error);
    }
  };


  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
        return <Shield size={16} className="text-red-500" />;
      case 'SELLER':
        return <Store size={16} className="text-blue-500" />;
      case 'USER':
        return <User size={16} className="text-green-500" />;
      default:
        return <User size={16} className="text-gray-500" />;
    }
  };

  // Kullanıcının pasif olup olmadığını kontrol et
  const isUserDeactivated = (user) => {
    return user.email && user.email.includes('_DEACTIVATED_');
  };

  const getRoleBadge = (role) => {
    if (!role) return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">BİLİNMİYOR</span>;
    
    // Role string olarak geliyor, object değil
    const roleName = typeof role === 'string' ? role : role.name;
    
    switch (roleName) {
      case 'ADMIN':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">ADMİN</span>;
      case 'SELLER':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">SATICI</span>;
      case 'USER':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">KULLANICI</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">BİLİNMİYOR</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500/30 border-t-orange-500 mx-auto mb-6"></div>
          <div className="text-xl font-semibold text-gray-900 mb-2">Kullanıcılar Yükleniyor</div>
          <p className="text-gray-600">Veriler getiriliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Kullanıcı Yönetimi" />
      <MetaTags 
        title="Kullanıcı Yönetimi"
        description="Platform kullanıcılarını yönetin ve izleyin."
        keywords="admin, kullanıcı yönetimi, kullanıcı listesi"
      />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-sm rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
            <p className="text-gray-600 mt-1">Platform kullanıcılarını yönetin ve izleyin</p>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Toplam Kullanıcı</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUserCount}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Toplam Satıcı</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSellerCount}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Arama ve Filtre */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200"
              >
                Ara
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value="">Tüm Roller</option>
              <option value="USER">Kullanıcı</option>
              <option value="SELLER">Satıcı</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
        {users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-200/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {users.map((user) => (
                    <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors duration-200 ${
                      isUserDeactivated(user) ? "opacity-60 bg-gray-50/30" : ""
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                              <span>{user.email}</span>
                              {isUserDeactivated(user) && (
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                                  PASİF
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.registrationDate 
                          ? new Date(user.registrationDate).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewUser(user.id)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200" 
                            title="Görüntüle"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleEditUser(user.id)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200" 
                            title="Düzenle"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              isUserDeactivated(user) 
                                ? "text-green-600 hover:text-green-800 hover:bg-green-50" 
                                : "text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                            }`}
                            title={isUserDeactivated(user) ? "Aktifleştir" : "Pasifleştir"}
                          >
                            <User size={16} />
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
              <div className="px-6 py-4 border-t border-gray-200/50 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <button 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !pagination.hasPrevious 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevious}
                  >
                    <ChevronLeft size={16} />
                    <span>Önceki</span>
                  </button>
                  
                  <div className="text-sm text-gray-600">
                    Sayfa {pagination.currentPage + 1} / {pagination.totalPages}
                    <span className="ml-2 text-gray-500">({pagination.totalUsers} kullanıcı)</span>
                  </div>
                  
                  <button 
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !pagination.hasNext 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                    }`}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                  >
                    <span>Sonraki</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Kullanıcı bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinize uygun kullanıcı bulunmuyor.</p>
          </div>
        )}
      </div>

      {/* Kullanıcı Görüntüleme Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Detayları</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                  <p className="text-gray-900">{selectedUser.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                  <p className="text-gray-900">{selectedUser.lastName}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <p className="text-gray-900">{selectedUser.phone || '-'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <p className="text-gray-900">{selectedUser.role}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kayıt Tarihi</label>
                <p className="text-gray-900">
                  {selectedUser.registrationDate 
                    ? new Date(selectedUser.registrationDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '-'
                  }
                </p>
              </div>
              
              {selectedUser.address1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres 1</label>
                  <p className="text-gray-900">{selectedUser.address1}</p>
                </div>
              )}
              
              {selectedUser.address2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres 2</label>
                  <p className="text-gray-900">{selectedUser.address2}</p>
                </div>
              )}
              
              {selectedUser.birthDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                  <p className="text-gray-900">{selectedUser.birthDate}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kullanıcı Düzenleme Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Düzenle</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres 1</label>
                <input
                  type="text"
                  value={editFormData.address1}
                  onChange={(e) => setEditFormData({...editFormData, address1: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adres 2</label>
                <input
                  type="text"
                  value={editFormData.address2}
                  onChange={(e) => setEditFormData({...editFormData, address2: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                <input
                  type="date"
                  value={editFormData.birthDate}
                  onChange={(e) => setEditFormData({...editFormData, birthDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kullanıcı Pasifleştirme/Aktifleştirme Onay Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isUserDeactivated(selectedUser) ? "Kullanıcı Aktifleştir" : "Kullanıcı Pasifleştir"}
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className={`border rounded-lg p-4 mb-4 ${
                isUserDeactivated(selectedUser) 
                  ? "bg-green-50 border-green-200" 
                  : "bg-blue-50 border-blue-200"
              }`}>
                <div className="flex items-center">
                  <svg className={`w-5 h-5 mr-2 ${
                    isUserDeactivated(selectedUser) ? "text-green-600" : "text-blue-600"
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className={`font-medium ${
                    isUserDeactivated(selectedUser) ? "text-green-800" : "text-blue-800"
                  }`}>
                    {isUserDeactivated(selectedUser) ? "Kullanıcı Aktifleştirme" : "Kullanıcı Pasifleştirme"}
                  </p>
                </div>
                <p className={`text-sm mt-2 ${
                  isUserDeactivated(selectedUser) ? "text-green-700" : "text-blue-700"
                }`}>
                  {isUserDeactivated(selectedUser) 
                    ? "Kullanıcı aktifleştirildiğinde tekrar giriş yapabilir ve tüm özelliklerini kullanabilir."
                    : "Kullanıcı pasifleştirildiğinde giriş yapamaz ancak tüm verileri korunur."
                  }
                </p>
              </div>
              
              <p className="text-gray-700 mb-4">
                <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> kullanıcısını {isUserDeactivated(selectedUser) ? "aktifleştirmek" : "pasifleştirmek"} istediğinizden emin misiniz?
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <p className="font-medium mb-2">
                  {isUserDeactivated(selectedUser) ? "Aktifleştirme sonrası:" : "Pasifleştirme sonrası:"}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {isUserDeactivated(selectedUser) ? (
                    <>
                      <li>Kullanıcı tekrar giriş yapabilir</li>
                      <li>Tüm özellikler aktif olur</li>
                      <li>Email adresi orijinal haline döner</li>
                      <li>Tüm veriler korunur</li>
                    </>
                  ) : (
                    <>
                      <li>Kullanıcı giriş yapamaz</li>
                      <li>Tüm siparişler korunur</li>
                      <li>Sepet bilgileri korunur</li>
                      <li>Favoriler korunur</li>
                      <li>Email adresi değiştirilir</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={isUserDeactivated(selectedUser) ? handleActivateUser : handleDeactivateUser}
                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center space-x-2 ${
                  isUserDeactivated(selectedUser) 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                <User size={16} />
                <span>{isUserDeactivated(selectedUser) ? "Aktifleştir" : "Pasifleştir"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
