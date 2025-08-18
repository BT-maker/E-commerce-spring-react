import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import "./AdminReports.css";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';
import toast from 'react-hot-toast';

// Chart.js'yi kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: []
  });
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: []
  });
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: []
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    growthRate: 0
  });

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Satış verilerini getir
      const salesResponse = await fetch(`http://localhost:8082/api/admin/reports/sales?range=${timeRange}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setSalesData(salesData);
      }

      // Gelir verilerini getir
      const revenueResponse = await fetch(`http://localhost:8082/api/admin/reports/revenue?range=${timeRange}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (revenueResponse.ok) {
        const revenueData = await revenueResponse.json();
        setRevenueData(revenueData);
      }

      // Kategori verilerini getir
      const categoryResponse = await fetch(`http://localhost:8082/api/admin/reports/categories`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        setCategoryData(categoryData);
      }

      // İstatistikleri getir
      const statsResponse = await fetch(`http://localhost:8082/api/admin/reports/stats`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Rapor verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    toast.success('Rapor dışa aktarılıyor...');
    // PDF export işlemi burada yapılacak
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-reports">
        <div className="loading">Raporlar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="admin-reports">
      <PageTitle title="Raporlar" />
      <MetaTags 
        title="Raporlar - Admin Panel"
        description="E-ticaret platformu raporları"
        keywords="admin, raporlar, grafikler, e-ticaret"
      />

      <div className="admin-reports-header">
        <div className="header-content">
          <div className="header-title">
            <BarChart3 className="header-icon" />
            <h1>Raporlar</h1>
          </div>
          <p>Platform performansını analiz edin ve raporları görüntüleyin</p>
        </div>
        
        <div className="header-actions">
          <div className="filter-controls">
            <Filter className="filter-icon" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Bu Hafta</option>
              <option value="month">Bu Ay</option>
              <option value="quarter">Bu Çeyrek</option>
              <option value="year">Bu Yıl</option>
            </select>
          </div>
          
          <button className="export-btn" onClick={exportReport}>
            <Download />
            Dışa Aktar
          </button>
        </div>
      </div>

      <div className="admin-reports-content">
        {/* İstatistik Kartları */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon revenue">
              <DollarSign />
            </div>
            <div className="stat-content">
              <h3>Toplam Gelir</h3>
              <p>{formatCurrency(stats.totalRevenue)}</p>
              <span className={`growth ${stats.growthRate >= 0 ? 'positive' : 'negative'}`}>
                {stats.growthRate >= 0 ? '+' : ''}{stats.growthRate}%
              </span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon orders">
              <ShoppingCart />
            </div>
            <div className="stat-content">
              <h3>Toplam Sipariş</h3>
              <p>{stats.totalOrders.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon users">
              <Users />
            </div>
            <div className="stat-content">
              <h3>Toplam Kullanıcı</h3>
              <p>{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon products">
              <Package />
            </div>
            <div className="stat-content">
              <h3>Toplam Ürün</h3>
              <p>{stats.totalProducts.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Grafikler */}
        <div className="charts-grid">
          {/* Satış Grafiği */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Satış Trendi</h3>
              <TrendingUp className="chart-icon" />
            </div>
            <div className="chart-container">
              <Line 
                data={salesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Gelir Grafiği */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Gelir Analizi</h3>
              <DollarSign className="chart-icon" />
            </div>
            <div className="chart-container">
              <Bar 
                data={revenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Kategori Dağılımı */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Kategori Dağılımı</h3>
              <Package className="chart-icon" />
            </div>
            <div className="chart-container">
              <Doughnut 
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    title: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Detaylı Tablolar */}
        <div className="tables-section">
          <div className="table-card">
            <div className="table-header">
              <h3>En Çok Satan Ürünler</h3>
            </div>
            <div className="table-content">
              <table>
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Kategori</th>
                    <th>Satış Adedi</th>
                    <th>Toplam Gelir</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>iPhone 15 Pro</td>
                    <td>Elektronik</td>
                    <td>1,234</td>
                    <td>₺2,468,000</td>
                  </tr>
                  <tr>
                    <td>MacBook Air</td>
                    <td>Bilgisayar</td>
                    <td>856</td>
                    <td>₺1,712,000</td>
                  </tr>
                  <tr>
                    <td>AirPods Pro</td>
                    <td>Aksesuar</td>
                    <td>2,156</td>
                    <td>₺1,078,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h3>En Aktif Müşteriler</h3>
            </div>
            <div className="table-content">
              <table>
                <thead>
                  <tr>
                    <th>Müşteri</th>
                    <th>Sipariş Sayısı</th>
                    <th>Toplam Harcama</th>
                    <th>Son Sipariş</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ahmet Yılmaz</td>
                    <td>45</td>
                    <td>₺12,450</td>
                    <td>2 gün önce</td>
                  </tr>
                  <tr>
                    <td>Ayşe Demir</td>
                    <td>32</td>
                    <td>₺8,920</td>
                    <td>1 hafta önce</td>
                  </tr>
                  <tr>
                    <td>Mehmet Kaya</td>
                    <td>28</td>
                    <td>₺7,680</td>
                    <td>3 gün önce</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
