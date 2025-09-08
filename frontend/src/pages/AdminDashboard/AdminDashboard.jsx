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

  const StatCard = ({ title, value, icon: Icon, change, changeType, iconColor }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</p>
          {change && (
            <div className="flex items-center space-x-1">
              {changeType === 'positive' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {changeType === 'positive' ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
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
        className={`bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 hover:bg-white/80 transition-all duration-200 cursor-pointer ${
          notification.categoryRequestId || notification.orderId || notification.sellerId ? 'hover:shadow-md' : ''
        }`}
        onClick={handleNotificationClick}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 mb-1">
              {notification.title || 'Bildirim'}
            </div>
            <div className="text-sm text-gray-600 mb-2 line-clamp-2">
              {notification.message || 'Bildirim mesajı'}
            </div>
            <div className="text-xs text-gray-500">
              {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString('tr-TR') : 'Yeni'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500/30 border-t-orange-500 mx-auto mb-6"></div>
          <div className="text-xl font-semibold text-gray-900 mb-2">Dashboard Yükleniyor</div>
          <p className="text-gray-600">Veriler getiriliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Admin Dashboard" />
      <MetaTags 
        title="Admin Dashboard"
        description="E-Ticaret platformu admin paneli ana sayfası."
        keywords="admin, dashboard, yönetim paneli, istatistikler"
      />

      {/* Header */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Platform genel durumu ve istatistikler</p>
            </div>
          </div>
          <button 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
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
            <span>{loading ? 'Yenileniyor...' : 'Yenile'}</span>
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
          iconColor="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Toplam Satıcı"
          value={stats.totalSellers}
          icon={Store}
          change={8}
          changeType="positive"
          iconColor="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          title="Toplam Ürün"
          value={stats.totalProducts}
          icon={Package}
          change={15}
          changeType="positive"
          iconColor="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          title="Toplam Sipariş"
          value={stats.totalOrders}
          icon={ShoppingCart}
          change={-3}
          changeType="negative"
          iconColor="bg-gradient-to-r from-orange-500 to-orange-600"
        />
        <StatCard
          title="Toplam Gelir"
          value={stats.totalRevenue}
          icon={DollarSign}
          change={25}
          changeType="positive"
          iconColor="bg-gradient-to-r from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Aylık Büyüme"
          value={stats.monthlyGrowth}
          icon={TrendingUp}
          change={18}
          changeType="positive"
          iconColor="bg-gradient-to-r from-pink-500 to-pink-600"
        />
      </div>

      {/* Grafikler ve Detaylar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bildirimler */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Toplam {notificationsPagination.totalNotifications} bildirim
                </span>
                <button 
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
                  onClick={() => navigate('/admin/notifications')}
                >
                  Tümünü Gör
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <NotificationCard key={notification.id || index} notification={notification} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Henüz bildirim bulunmuyor</p>
                </div>
              )}
            </div>
            
            {/* Sayfalama */}
            {notificationsPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200/50">
                <button 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !notificationsPagination.hasPrevious 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                  onClick={() => handlePageChange(notificationsPagination.currentPage - 1)}
                  disabled={!notificationsPagination.hasPrevious}
                >
                  Önceki
                </button>
                
                <div className="text-sm text-gray-600">
                  Sayfa {notificationsPagination.currentPage + 1} / {notificationsPagination.totalPages}
                </div>
                
                <button 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !notificationsPagination.hasNext 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                  onClick={() => handlePageChange(notificationsPagination.currentPage + 1)}
                  disabled={!notificationsPagination.hasNext}
                >
                  Sonraki
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hızlı İstatistikler */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Hızlı İstatistikler</h3>
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bu Hafta Sipariş</p>
                    <p className="text-xl font-bold text-gray-900">{quickStats.weeklyOrders.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bu Ay Gelir</p>
                    <p className="text-xl font-bold text-gray-900">₺{quickStats.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Yeni Kullanıcı</p>
                    <p className="text-xl font-bold text-gray-900">{quickStats.newUsers.toLocaleString()}</p>
                  </div>
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
