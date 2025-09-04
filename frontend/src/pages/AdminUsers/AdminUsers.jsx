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
    if (!role) return <span className="role-badge unknown">BİLİNMİYOR</span>;
    
    // Role string olarak geliyor, object değil
    const roleName = typeof role === 'string' ? role : role.name;
    
    switch (roleName) {
      case 'ADMIN':
        return <span className="role-badge admin">ADMİN</span>;
      case 'SELLER':
        return <span className="role-badge seller">SATICI</span>;
      case 'USER':
        return <span className="role-badge user">KULLANICI</span>;
      default:
        return <span className="role-badge unknown">BİLİNMİYOR</span>;
    }
  };

  if (loading) {
    return (
      <div className="admin-users">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Kullanıcılar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <PageTitle title="Kullanıcı Yönetimi" />
      <MetaTags 
        title="Kullanıcı Yönetimi"
        description="Platform kullanıcılarını yönetin ve izleyin."
        keywords="admin, kullanıcı yönetimi, kullanıcı listesi"
      />

      <div className="users-header">
        <div className="header-content">
          <h1>Kullanıcı Yönetimi</h1>
          <p>Platform kullanıcılarını yönetin ve izleyin</p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalUserCount}</span>
            <span className="stat-label">TOPLAM KULLANICI</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Store size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalSellerCount}</span>
            <span className="stat-label">TOPLAM SATICI</span>
          </div>
        </div>
      </div>

      {/* Arama ve Filtre */}
      <div className="search-filter-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Ara
            </button>
          </div>
        </form>

        <div className="filter-section">
          <Filter size={20} />
          <select
            value={roleFilter}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="role-filter"
          >
            <option value="">Tüm Roller</option>
            <option value="USER">Kullanıcı</option>
            <option value="SELLER">Satıcı</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="users-table-container">
        {users.length > 0 ? (
          <>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Kullanıcı</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Telefon</th>
                  <th>Kayıt Tarihi</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="user-details">
                          <span className="user-name">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="user-username">@{user.username}</span>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{user.phone || '-'}</td>
                    <td>
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
                    <td>
                      <div className="admin-user-action-buttons">
                        <button className="admin-user-action-btn admin-user-view-btn" title="Görüntüle">
                          <Eye size={20} />
                        </button>
                        <button className="admin-user-action-btn admin-user-edit-btn" title="Düzenle">
                          <Edit size={20} />
                        </button>
                        <button className="admin-user-action-btn admin-user-delete-btn" title="Sil">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Sayfalama */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button 
                  className={`pagination-btn ${!pagination.hasPrevious ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevious}
                >
                  <ChevronLeft size={16} />
                  Önceki
                </button>
                
                <div className="page-info">
                  Sayfa {pagination.currentPage + 1} / {pagination.totalPages}
                  <span className="total-users">({pagination.totalUsers} kullanıcı)</span>
                </div>
                
                <button 
                  className={`pagination-btn ${!pagination.hasNext ? 'disabled' : ''}`}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  Sonraki
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Users size={48} />
            <p>Kullanıcı bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
