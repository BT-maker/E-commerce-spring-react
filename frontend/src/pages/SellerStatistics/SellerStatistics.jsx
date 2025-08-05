import React, { useState, useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  FaChartLine, 
  FaShoppingCart, 
  FaUsers, 
  FaStar, 
  FaBoxes, 
  FaMoneyBillWave,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import './SellerStatistics.css';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SellerStatistics = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year
  const [selectedChart, setSelectedChart] = useState('sales'); // sales, orders, revenue

  useEffect(() => {
    fetchStatisticsData();
  }, [selectedPeriod]);

  const fetchStatisticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8080/api/seller/stats?period=${selectedPeriod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('İstatistik verileri:', data);
      setStatsData(data);
    } catch (err) {
      console.error('İstatistik veri hatası:', err);
      setError('İstatistik verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('tr-TR').format(num || 0);
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week': return 'Bu Hafta';
      case 'month': return 'Bu Ay';
      case 'year': return 'Bu Yıl';
      default: return 'Bu Hafta';
    }
  };

  // Satış grafiği verileri
  const getSalesChartData = () => {
    if (!statsData?.salesData) return null;

    return {
      labels: statsData.salesData.map(item => item.date),
      datasets: [
        {
          label: 'Satış Adedi',
          data: statsData.salesData.map(item => item.count),
          borderColor: 'rgb(255, 96, 0)',
          backgroundColor: 'rgba(255, 96, 0, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(255, 96, 0)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  };

  // Gelir grafiği verileri
  const getRevenueChartData = () => {
    if (!statsData?.revenueData) return null;

    return {
      labels: statsData.revenueData.map(item => item.date),
      datasets: [
        {
          label: 'Gelir (₺)',
          data: statsData.revenueData.map(item => item.amount),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }
      ]
    };
  };

  // Kategori dağılımı grafiği
  const getCategoryChartData = () => {
    if (!statsData?.categoryData) return null;

    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];

    return {
      labels: statsData.categoryData.map(item => item.categoryName),
      datasets: [
        {
          data: statsData.categoryData.map(item => item.salesCount),
          backgroundColor: colors.slice(0, statsData.categoryData.length),
          borderWidth: 2,
          borderColor: '#fff',
          hoverBorderColor: '#fff',
          hoverBorderWidth: 3
        }
      ]
    };
  };

  // Grafik seçenekleri
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            weight: 'bold'
          },
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 96, 0, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 11
          },
          color: '#374151',
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 96, 0, 0.5)',
        borderWidth: 1,
        cornerRadius: 8
      }
    }
  };

  if (loading) {
    return (
      <div className="seller-statistics">
        <div className="statistics-loading">
          <div className="loading-spinner"></div>
          <h3>İstatistikler Yükleniyor...</h3>
          <p>Verileriniz hazırlanıyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-statistics">
        <div className="statistics-error">
          <div className="error-icon">⚠️</div>
          <h3>Bir Hata Oluştu</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchStatisticsData}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-statistics">
      {/* Header */}
      <div className="statistics-header">
        <div className="header-content">
          <h1>İstatistikler</h1>
        </div>
        
        {/* Period Selector */}
        <div className="period-selector">
          <button 
            className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('week')}
          >
            <FaCalendarAlt />
            Hafta
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            <FaCalendarAlt />
            Ay
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('year')}
          >
            <FaCalendarAlt />
            Yıl
          </button>
        </div>

        {/* Rating Display */}
        <div className="header-rating">
          <div className="rating-icon">
            <FaStar />
          </div>
          <div className="rating-content">
            <div className="rating-label">Ortalama Puan</div>
            <div className="rating-value">{statsData?.averageRating?.toFixed(1) || '0.0'}</div>
            <div className="rating-change">
              <FaArrowUp />
              +0.3
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-icon sales">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Toplam Satış</h3>
            <div className="stat-number">{formatNumber(statsData?.totalSales || 0)}</div>
            <div className="stat-change positive">
              <FaArrowUp />
              +12.5%
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Toplam Gelir</h3>
            <div className="stat-number">{formatCurrency(statsData?.totalRevenue || 0)}</div>
            <div className="stat-change positive">
              <FaArrowUp />
              +8.3%
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon customers">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Müşteri Sayısı</h3>
            <div className="stat-number">{formatNumber(statsData?.totalCustomers || 0)}</div>
            <div className="stat-change positive">
              <FaArrowUp />
              +5.2%
            </div>
          </div>
        </div>


      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Chart Type Selector */}
        <div className="chart-selector">
          <button 
            className={`chart-btn ${selectedChart === 'sales' ? 'active' : ''}`}
            onClick={() => setSelectedChart('sales')}
          >
            <FaChartLine />
            Satış Grafiği
          </button>
          <button 
            className={`chart-btn ${selectedChart === 'revenue' ? 'active' : ''}`}
            onClick={() => setSelectedChart('revenue')}
          >
            <FaMoneyBillWave />
            Gelir Grafiği
          </button>
        </div>

        {/* Main Chart */}
        <div className="main-chart-container">
          <div className="chart-header">
            <h2>{selectedChart === 'sales' ? 'Satış Trendi' : 'Gelir Trendi'} - {getPeriodLabel()}</h2>
          </div>
          <div className="chart-wrapper">
            {selectedChart === 'sales' && getSalesChartData() && (
              <Line data={getSalesChartData()} options={chartOptions} />
            )}
            {selectedChart === 'revenue' && getRevenueChartData() && (
              <Bar data={getRevenueChartData()} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="category-chart-container">
          <div className="chart-header">
            <h2>Kategori Dağılımı</h2>
          </div>
          <div className="chart-wrapper">
            {getCategoryChartData() && (
              <Doughnut data={getCategoryChartData()} options={doughnutOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="additional-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>En Çok Satan Ürün</h3>
            <div className="stat-value">{statsData?.topProduct?.name || 'Veri yok'}</div>
            <div className="stat-subtitle">{formatNumber(statsData?.topProduct?.salesCount || 0)} satış</div>
          </div>
          
          <div className="stat-item">
            <h3>En Popüler Kategori</h3>
            <div className="stat-value">{statsData?.topCategory?.name || 'Veri yok'}</div>
            <div className="stat-subtitle">{formatNumber(statsData?.topCategory?.salesCount || 0)} satış</div>
          </div>
          
          <div className="stat-item">
            <h3>Ortalama Sipariş Değeri</h3>
            <div className="stat-value">{formatCurrency(statsData?.averageOrderValue || 0)}</div>
            <div className="stat-subtitle">Sipariş başına</div>
          </div>
          
          <div className="stat-item">
            <h3>Toplam Ürün Sayısı</h3>
            <div className="stat-value">{formatNumber(statsData?.totalProducts || 0)}</div>
            <div className="stat-subtitle">Aktif ürün</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerStatistics; 