import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';
import webSocketService from '../../services/webSocketService';
import toast from 'react-hot-toast';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react";
import "./AdminDashboard.css";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [notificationsPagination, setNotificationsPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalNotifications: 0,
    hasNext: false,
    hasPrevious: false
  });
  const [quickStats, setQuickStats] = useState({
    weeklyOrders: 0,
    monthlyRevenue: 0,
    newUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // WebSocket bildirimleri için useEffect
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      // Admin bildirimlerini dinle
      webSocketService.subscribe('/user/queue/notifications', (notification) => {
        console.log('Yeni admin bildirimi:', notification);
        
        // Toast bildirimi göster
        toast.success(notification.title + ': ' + notification.message, {
          duration: 5000,
          position: 'top-right'
        });
        
        // Bildirimleri yenile
        fetchDashboardData();
      });

      // Genel admin bildirimlerini dinle
      webSocketService.subscribe('/topic/admin-notifications', (notification) => {
        console.log('Genel admin bildirimi:', notification);
        
        // Toast bildirimi göster
        toast.success(notification.title + ': ' + notification.message, {
          duration: 5000,
          position: 'top-right'
        });
        
        // Bildirimleri yenile
        fetchDashboardData();
      });

      return () => {
        webSocketService.unsubscribe('/user/queue/notifications');
        webSocketService.unsubscribe('/topic/admin-notifications');
      };
    }
  }, [user]);

  const fetchDashboardData = async (page = 0, showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      // Dashboard istatistiklerini getir
      const statsResponse = await fetch("http://localhost:8082/api/admin/dashboard/stats", {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log("Stats data received:", statsData);
        setStats(statsData);
      } else {
        console.error("Stats response not ok:", statsResponse.status);
        const errorText = await statsResponse.text();
        console.error("Error response:", errorText);
      }

      // Bildirimleri getir (sayfalama ile)
      const notificationsResponse = await fetch(`http://localhost:8082/api/admin/dashboard/notifications?page=${page}&size=6`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        console.log("Notifications data received:", notificationsData);
        setNotifications(notificationsData.notifications || []);
        setNotificationsPagination({
          currentPage: notificationsData.currentPage || 0,
          totalPages: notificationsData.totalPages || 0,
          totalNotifications: notificationsData.totalNotifications || 0,
          hasNext: notificationsData.hasNext || false,
          hasPrevious: notificationsData.hasPrevious || false
        });
      } else {
        console.error("Notifications response not ok:", notificationsResponse.status);
        const errorText = await notificationsResponse.text();
        console.error("Notifications error response:", errorText);
        // Fallback: Boş bildirim listesi
        setNotifications([]);
        setNotificationsPagination({
          currentPage: 0,
          totalPages: 0,
          totalNotifications: 0,
          hasNext: false,
          hasPrevious: false
        });
      }

      // Hızlı istatistikleri getir
      const quickStatsResponse = await fetch("http://localhost:8082/api/admin/dashboard/quick-stats", {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (quickStatsResponse.ok) {
        const quickStatsData = await quickStatsResponse.json();
        console.log("Quick stats data received:", quickStatsData);
        setQuickStats(quickStatsData);
      } else {
        console.error("Quick stats response not ok:", quickStatsResponse.status);
        const errorText = await quickStatsResponse.text();
        console.error("Quick stats error response:", errorText);
      }
    } catch (error) {
      console.error("Dashboard veri yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchDashboardData(newPage);
  };

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'success':
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
      case 'rejected':
        return <X size={16} className="text-red-500" />;
      case 'warning':
        return <AlertCircle size={16} className="text-yellow-500" />;
      default:
        return <Bell size={16} className="text-blue-500" />;
    }
  };

  const getNotificationClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'success':
      case 'approved':
        return 'notification-success';
      case 'error':
      case 'rejected':
        return 'notification-error';
      case 'warning':
        return 'notification-warning';
      default:
        return 'notification-info';
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
    <div className="stat-card">
      <div className="card-icon">
        <Icon size={24} />
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{value.toLocaleString()}</p>
        {change && (
          <span className={`growth ${changeType}`}>
            {changeType === 'positive' ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  );

  const NotificationCard = ({ notification }) => {
    const navigate = useNavigate();
    
    const handleNotificationClick = () => {
      if (notification.categoryRequestId) {
        // Kategori isteği bildirimi ise kategori yönetimi sayfasına yönlendir
        navigate('/admin/categories');
      } else if (notification.orderId) {
        // Sipariş bildirimi ise sipariş yönetimi sayfasına yönlendir
        navigate('/admin/orders');
      } else if (notification.sellerId) {
        // Satıcı bildirimi ise satıcı yönetimi sayfasına yönlendir
        navigate('/admin/sellers');
      }
    };
    
    return (
      <div 
        className={`notification-card ${getNotificationClass(notification.type)} ${notification.categoryRequestId || notification.orderId || notification.sellerId ? 'clickable' : ''}`}
        onClick={handleNotificationClick}
      >
        <div className="notification-icon">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="notification-content">
          <div className="notification-title">{notification.title || 'Bildirim'}</div>
          <div className="notification-message">{notification.message || 'Bildirim mesajı'}</div>
          <div className="notification-time">
            {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString('tr-TR') : 'Yeni'}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <PageTitle title="Admin Dashboard" />
      <MetaTags 
        title="Admin Dashboard"
        description="E-Ticaret platformu admin paneli ana sayfası."
        keywords="admin, dashboard, yönetim paneli, istatistikler"
      />

      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Platform genel durumu ve istatistikler</p>
        </div>
        <div className="header-actions">
          <button 
            className="refresh-btn" 
            onClick={() => {
              fetchDashboardData(0, true);
              toast.success('Dashboard yenileniyor...', {
                duration: 2000,
                position: 'top-right'
              });
            }}
            disabled={loading}
          >
            <Activity size={20} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Yenileniyor...' : 'Yenile'}
          </button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers}
          icon={Users}
          change={12}
          changeType="positive"
        />
        <StatCard
          title="Toplam Satıcı"
          value={stats.totalSellers}
          icon={Store}
          change={8}
          changeType="positive"
        />
        <StatCard
          title="Toplam Ürün"
          value={stats.totalProducts}
          icon={Package}
          change={15}
          changeType="positive"
        />
        <StatCard
          title="Toplam Sipariş"
          value={stats.totalOrders}
          icon={ShoppingCart}
          change={-3}
          changeType="negative"
        />
        <StatCard
          title="Toplam Gelir"
          value={stats.totalRevenue}
          icon={DollarSign}
          change={25}
          changeType="positive"
        />
        <StatCard
          title="Aylık Büyüme"
          value={stats.monthlyGrowth}
          icon={TrendingUp}
          change={18}
          changeType="positive"
        />
      </div>

      {/* Grafikler ve Detaylar */}
      <div className="dashboard-content">
        <div className="content-grid">
                     {/* Bildirimler */}
           <div className="content-card">
             <div className="card-header">
               <h3>Bildirimler</h3>
               <div className="header-info">
                 <span className="notifications-count">Toplam {notificationsPagination.totalNotifications} bildirim</span>
                 <button 
                   className="view-all-btn"
                   onClick={() => navigate('/admin/notifications')}
                 >
                   Tümünü Gör
                 </button>
               </div>
             </div>
             <div className="notifications-list">
               {notifications.length > 0 ? (
                 notifications.map((notification, index) => (
                   <NotificationCard key={notification.id || index} notification={notification} />
                 ))
               ) : (
                 <div className="empty-state">
                   <Bell size={48} />
                   <p>Henüz bildirim bulunmuyor</p>
                 </div>
               )}
             </div>
             
             {/* Sayfalama */}
             {notificationsPagination.totalPages > 1 && (
               <div className="pagination">
                 <button 
                   className={`pagination-btn ${!notificationsPagination.hasPrevious ? 'disabled' : ''}`}
                   onClick={() => handlePageChange(notificationsPagination.currentPage - 1)}
                   disabled={!notificationsPagination.hasPrevious}
                 >
                   Önceki
                 </button>
                 
                 <div className="page-info">
                   Sayfa {notificationsPagination.currentPage + 1} / {notificationsPagination.totalPages}
                 </div>
                 
                 <button 
                   className={`pagination-btn ${!notificationsPagination.hasNext ? 'disabled' : ''}`}
                   onClick={() => handlePageChange(notificationsPagination.currentPage + 1)}
                   disabled={!notificationsPagination.hasNext}
                 >
                   Sonraki
                 </button>
               </div>
             )}
           </div>

          {/* Hızlı İstatistikler */}
          <div className="quick-stats-card">
            <div className="card-header">
              <h3>Hızlı İstatistikler</h3>
              <Calendar size={20} />
            </div>
            <div className="quick-stats">
              <div className="quick-stat">
                <div className="quick-stat-icon">
                  <BarChart3 size={20} />
                </div>
                <div className="quick-stat-content">
                  <span className="quick-stat-value">{quickStats.weeklyOrders.toLocaleString()}</span>
                  <span className="quick-stat-label">Bu Hafta Sipariş</span>
                </div>
              </div>
              <div className="quick-stat">
                <div className="quick-stat-icon">
                  <PieChart size={20} />
                </div>
                <div className="quick-stat-content">
                  <span className="quick-stat-value">₺{quickStats.monthlyRevenue.toLocaleString()}</span>
                  <span className="quick-stat-label">Bu Ay Gelir</span>
                </div>
              </div>
              <div className="quick-stat">
                <div className="quick-stat-icon">
                  <Users size={20} />
                </div>
                <div className="quick-stat-content">
                  <span className="quick-stat-value">{quickStats.newUsers.toLocaleString()}</span>
                  <span className="quick-stat-label">Yeni Kullanıcı</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
