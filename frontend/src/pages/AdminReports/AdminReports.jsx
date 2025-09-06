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
  Filter,
  RefreshCw
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
    totalCustomers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
    productGrowth: 0
  });

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Simulated API calls - replace with actual API endpoints
      const [salesResponse, revenueResponse, categoryResponse, statsResponse] = await Promise.all([
        fetch(`http://localhost:8082/api/admin/reports/sales?period=${timeRange}`, {
          credentials: 'include'
        }),
        fetch(`http://localhost:8082/api/admin/reports/revenue?period=${timeRange}`, {
          credentials: 'include'
        }),
        fetch(`http://localhost:8082/api/admin/reports/categories?period=${timeRange}`, {
          credentials: 'include'
        }),
        fetch(`http://localhost:8082/api/admin/reports/stats?period=${timeRange}`, {
          credentials: 'include'
        })
      ]);

      // Mock data for demonstration
      const mockSalesData = {
        labels: getTimeLabels(),
        datasets: [{
          label: 'Satışlar',
          data: [12, 19, 3, 5, 2, 3, 8, 15, 12, 18, 25, 30],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          tension: 0.4
        }]
      };

      const mockRevenueData = {
        labels: getTimeLabels(),
        datasets: [{
          label: 'Gelir (₺)',
          data: [12000, 19000, 3000, 5000, 2000, 3000, 8000, 15000, 12000, 18000, 25000, 30000],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.4
        }]
      };

      const mockCategoryData = {
        labels: ['Elektronik', 'Giyim', 'Ev & Yaşam', 'Kitap', 'Spor', 'Kozmetik'],
        datasets: [{
          data: [30, 25, 20, 10, 8, 7],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderWidth: 2
        }]
      };

      const mockStats = {
        totalRevenue: 125000,
        totalOrders: 1250,
        totalCustomers: 850,
        totalProducts: 125,
        revenueGrowth: 15.5,
        orderGrowth: 12.3,
        customerGrowth: 8.7,
        productGrowth: 5.2
      };

      setSalesData(mockSalesData);
      setRevenueData(mockRevenueData);
      setCategoryData(mockCategoryData);
      setStats(mockStats);

    } catch (error) {
      console.error('Rapor verileri yüklenirken hata:', error);
      toast.error('Rapor verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getTimeLabels = () => {
    switch (timeRange) {
      case 'week':
        return ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
      case 'month':
        return ['1', '5', '10', '15', '20', '25', '30'];
      case 'quarter':
        return ['Ocak', 'Şubat', 'Mart'];
      case 'year':
        return ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
      default:
        return [];
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const exportReport = () => {
    toast.success('Rapor dışa aktarılıyor...');
    // Implement export functionality
  };

  // StatCard component
  const StatCard = ({ title, value, icon: Icon, change, changeType, isPrice = false }) => (
    <div className="bg-white/80 backdrop-blur-lg rounded-xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {isPrice ? formatPrice(value) : value.toLocaleString()}
          </p>
          {change && (
            <div className={`flex items-center text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="font-medium">%{change}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Raporlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PageTitle title="Raporlar" />
      <MetaTags 
        title="Raporlar"
        description="Detaylı sistem raporları. Satış analizi ve performans metrikleri."
        keywords="raporlar, satış analizi, performans metrikleri, grafikler"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Raporlar</h1>
                  <p className="text-gray-600 mt-1">Detaylı sistem raporları ve analizler</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchReportData}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Yenile"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={exportReport}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Dışa Aktar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
          <StatCard
            title="Toplam Gelir"
            value={stats.totalRevenue}
            icon={DollarSign}
            change={stats.revenueGrowth}
            changeType="positive"
            isPrice={true}
          />
          <StatCard
            title="Toplam Sipariş"
            value={stats.totalOrders}
            icon={ShoppingCart}
            change={stats.orderGrowth}
            changeType="positive"
          />
          <StatCard
            title="Toplam Müşteri"
            value={stats.totalCustomers}
            icon={Users}
            change={stats.customerGrowth}
            changeType="positive"
          />
          <StatCard
            title="Toplam Ürün"
            value={stats.totalProducts}
            icon={Package}
            change={stats.productGrowth}
            changeType="positive"
          />
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm mx-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Zaman Aralığı:</span>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  <option value="week">Son Hafta</option>
                  <option value="month">Son Ay</option>
                  <option value="quarter">Son Çeyrek</option>
                  <option value="year">Son Yıl</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
          {/* Sales Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Satış Trendi</h3>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="h-64">
              <Line data={salesData} options={chartOptions} />
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Gelir Trendi</h3>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="h-64">
              <Bar data={revenueData} options={chartOptions} />
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Kategori Dağılımı</h3>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="h-64">
              <Doughnut data={categoryData} options={doughnutOptions} />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performans Metrikleri</h3>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Ortalama Sipariş Değeri</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(stats.totalRevenue / stats.totalOrders)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Müşteri Başına Ortalama</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(stats.totalRevenue / stats.totalCustomers)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Ürün Başına Ortalama</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(stats.totalRevenue / stats.totalProducts)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Dönüşüm Oranı</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  %{((stats.totalOrders / stats.totalCustomers) * 100).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;