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
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
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
                          <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="Görüntüle">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200" title="Düzenle">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200" title="Sil">
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
    </div>
  );
};

export default AdminUsers;
