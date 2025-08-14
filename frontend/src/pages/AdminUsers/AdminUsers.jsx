import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield
} from "lucide-react";
import "./AdminUsers.css";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/admin/users", {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Arama filtresi
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Durum filtresi - User modelinde status field'ı yok, kaldırıldı
    // if (statusFilter !== "all") {
    //   filtered = filtered.filter(user => user.status === statusFilter);
    // }

    // Rol filtresi
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role?.name === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId, action) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/${action}`, {
        method: 'PUT',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchUsers(); // Listeyi yenile
      }
    } catch (error) {
      console.error("Kullanıcı işlemi hatası:", error);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const UserCard = ({ user }) => (
    <div className="user-card">
      <div className="user-header">
        <div className="user-avatar">
          <Users size={24} />
        </div>
        <div className="user-info">
          <h3 className="user-name">{user.firstName} {user.lastName}</h3>
          <p className="user-email">{user.email}</p>
        </div>
        <div className="user-actions">
          <button 
            className="action-btn"
            onClick={() => handleViewUser(user)}
          >
            <Eye size={16} />
          </button>
          <button className="action-btn">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
      
      <div className="user-details">
        <div className="detail-item">
          <Shield size={16} />
          <span className="detail-label">Rol:</span>
          <span className={`detail-value role-${user.role?.name?.toLowerCase()}`}>
            {user.role?.name === 'ADMIN' ? 'Yönetici' : 
             user.role?.name === 'SELLER' ? 'Satıcı' : 'Müşteri'}
          </span>
        </div>
        
        <div className="detail-item">
          <Calendar size={16} />
          <span className="detail-label">Kayıt:</span>
          <span className="detail-value">
            {new Date(user.createdAt).toLocaleDateString('tr-TR')}
          </span>
        </div>
        
        {/* Status field removed - User model doesn't have status */}
      </div>
      
      <div className="user-actions-bottom">
        <button className="action-btn-secondary">
          <Mail size={16} />
          Mesaj Gönder
        </button>
      </div>
    </div>
  );

  const UserModal = ({ user, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Kullanıcı Detayları</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-content">
          <div className="user-detail-section">
            <h3>Kişisel Bilgiler</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Ad:</span>
                <span className="detail-value">{user.firstName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Soyad:</span>
                <span className="detail-value">{user.lastName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">E-posta:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rol:</span>
                <span className={`detail-value role-${user.role?.name?.toLowerCase()}`}>
                  {user.role?.name === 'ADMIN' ? 'Yönetici' : 
                   user.role?.name === 'SELLER' ? 'Satıcı' : 'Müşteri'}
                </span>
              </div>
              {/* Status field removed - User model doesn't have status */}
              <div className="detail-item">
                <span className="detail-label">Kayıt Tarihi:</span>
                <span className="detail-value">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Kapat
          </button>
          <button className="btn-primary">
            Düzenle
          </button>
        </div>
      </div>
    </div>
  );

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
        description="E-Ticaret platformu kullanıcı yönetimi sayfası."
        keywords="admin, kullanıcı yönetimi, kullanıcılar"
      />

      <div className="page-header">
        <div className="header-content">
          <h1>Kullanıcı Yönetimi</h1>
          <p>Platform kullanıcılarını yönetin ve izleyin</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Toplam Kullanıcı</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{users.filter(u => u.role?.name === 'SELLER').length}</span>
            <span className="stat-label">Toplam Satıcı</span>
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
              placeholder="Kullanıcı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-controls">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tüm Roller</option>
            <option value="USER">Müşteri</option>
            <option value="SELLER">Satıcı</option>
          </select>
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="users-grid">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))
        ) : (
          <div className="empty-state">
            <Users size={48} />
            <p>Kullanıcı bulunamadı</p>
          </div>
        )}
      </div>

      {/* Kullanıcı Detay Modal */}
      {showUserModal && selectedUser && (
        <UserModal 
          user={selectedUser} 
          onClose={() => setShowUserModal(false)} 
        />
      )}
    </div>
  );
};

export default AdminUsers;
