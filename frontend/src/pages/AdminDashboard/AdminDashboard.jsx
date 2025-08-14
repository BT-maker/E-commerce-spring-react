import React, { useState, useEffect } from "react";
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
  ArrowDownRight
} from "lucide-react";
import "./AdminDashboard.css";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Dashboard istatistiklerini getir
      const statsResponse = await fetch("http://localhost:8080/api/admin/dashboard/stats", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Son siparişleri getir
      const ordersResponse = await fetch("http://localhost:8080/api/admin/dashboard/recent-orders", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setRecentOrders(ordersData);
      }
    } catch (error) {
      console.error("Dashboard veri yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon">
          <Icon size={24} />
        </div>
        {change && (
          <div className={`stat-change ${changeType}`}>
            {changeType === 'positive' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{change}%</span>
          </div>
        )}
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value.toLocaleString()}</h3>
        <p className="stat-title">{title}</p>
      </div>
    </div>
  );

  const OrderCard = ({ order }) => (
    <div className="order-card">
      <div className="order-header">
        <span className="order-id">#{order.id?.substring(0, 8) || 'N/A'}</span>
        <span className={`order-status ${order.status?.toLowerCase() || 'unknown'}`}>
          {order.status || 'UNKNOWN'}
        </span>
      </div>
      <div className="order-details">
        <p className="customer-name">
          {order.user?.firstName} {order.user?.lastName} ({order.user?.email})
        </p>
        <p className="order-amount">₺{order.totalPrice?.toLocaleString() || '0'}</p>
        <p className="order-date">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
      </div>
    </div>
  );

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
          <button className="refresh-btn" onClick={fetchDashboardData}>
            <Activity size={20} />
            Yenile
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
          {/* Son Siparişler */}
          <div className="content-card">
            <div className="card-header">
              <h3>Son Siparişler</h3>
              <button className="view-all-btn">Tümünü Gör</button>
            </div>
            <div className="orders-list">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="empty-state">
                  <ShoppingCart size={48} />
                  <p>Henüz sipariş bulunmuyor</p>
                </div>
              )}
            </div>
          </div>

          {/* Hızlı İstatistikler */}
          <div className="content-card">
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
                  <span className="quick-stat-value">1,234</span>
                  <span className="quick-stat-label">Bu Hafta Sipariş</span>
                </div>
              </div>
              <div className="quick-stat">
                <div className="quick-stat-icon">
                  <PieChart size={20} />
                </div>
                <div className="quick-stat-content">
                  <span className="quick-stat-value">₺45,678</span>
                  <span className="quick-stat-label">Bu Ay Gelir</span>
                </div>
              </div>
              <div className="quick-stat">
                <div className="quick-stat-icon">
                  <Users size={20} />
                </div>
                <div className="quick-stat-content">
                  <span className="quick-stat-value">89</span>
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
