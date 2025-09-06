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
  FaArrowDown,
  FaExclamationTriangle
} from 'react-icons/fa';

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
      
      const response = await fetch(`http://localhost:8082/api/seller/stats?period=${selectedPeriod}`, {
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

  const getChartData = () => {
    if (!statsData) return null;

    // Backend'den gelen veri yapısına göre güncelleme
    const salesData = statsData.salesData || [];
    const revenueData = statsData.revenueData || [];
    
    const labels = salesData.map(item => item.date) || [];
    const salesValues = salesData.map(item => item.count) || [];
    const revenueValues = revenueData.map(item => item.amount) || [];

    switch (selectedChart) {
      case 'sales':
        return {
          labels,
          datasets: [
            {
              label: 'Satış Adedi',
              data: salesValues,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgb(59, 130, 246)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7
            }
          ]
        };
      case 'revenue':
        return {
          labels,
          datasets: [
            {
              label: 'Gelir (₺)',
              data: revenueValues,
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgb(34, 197, 94)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7
            }
          ]
        };
      case 'orders':
        return {
          labels,
          datasets: [
            {
              label: 'Sipariş Sayısı',
              data: salesValues,
              backgroundColor: 'rgba(251, 146, 60, 0.8)',
              borderColor: 'rgb(251, 146, 60)',
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false,
            }
          ]
        };
      default:
        return null;
    }
  };

  const getChartOptions = () => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: '500'
            }
          }
        },
        title: {
          display: true,
          text: `${getPeriodLabel()} - ${selectedChart === 'sales' ? 'Satış Adedi' : selectedChart === 'revenue' ? 'Gelir' : 'Sipariş Sayısı'}`,
          font: {
            size: 16,
            weight: 'bold'
          },
          color: '#374151',
          padding: 20
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              if (selectedChart === 'revenue') {
                return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
              }
              return `${context.dataset.label}: ${formatNumber(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
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
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#6B7280',
            font: {
              size: 11
            },
            callback: function(value) {
              if (selectedChart === 'revenue') {
                return formatCurrency(value);
              }
              return formatNumber(value);
            }
          }
        }
      },
      elements: {
        point: {
          hoverRadius: 8
        }
      }
    };
  };

  const getCategoryData = () => {
    if (!statsData?.categoryData || statsData.categoryData.length === 0) return null;

    return {
      labels: statsData.categoryData.map(item => item.categoryName),
      datasets: [
        {
          data: statsData.categoryData.map(item => item.salesCount),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <FaExclamationTriangle className="mx-auto text-red-500 text-4xl mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Hata</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Satış İstatistikleri</h1>
              <p className="text-blue-100">Mağazanızın performansını takip edin</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm">
                <FaChartLine className="text-blue-200" />
                <span>{getPeriodLabel()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bu Hafta
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bu Ay
              </button>
              <button
                onClick={() => setSelectedPeriod('year')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === 'year'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bu Yıl
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedChart('sales')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedChart === 'sales'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Satış Adedi
              </button>
              <button
                onClick={() => setSelectedChart('revenue')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedChart === 'revenue'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Gelir
              </button>
              <button
                onClick={() => setSelectedChart('orders')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedChart === 'orders'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sipariş Sayısı
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Toplam Satış */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Toplam Satış</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatNumber(statsData?.totalSales || 0)}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">Adet</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <FaShoppingCart className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Toplam Gelir */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(statsData?.totalRevenue || 0)}
                  </p>
                  <p className="text-xs text-green-500 mt-1">₺</p>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <FaMoneyBillWave className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Ortalama Sipariş */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Ortalama Sipariş</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatCurrency(statsData?.averageOrderValue || 0)}
                  </p>
                  <p className="text-xs text-orange-500 mt-1">₺/sipariş</p>
                </div>
                <div className="p-3 bg-orange-500 rounded-lg">
                  <FaBoxes className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Müşteri Sayısı */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Müşteri Sayısı</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatNumber(statsData?.totalCustomers || 0)}
                  </p>
                  <p className="text-xs text-purple-500 mt-1">Benzersiz</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-lg">
                  <FaUsers className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Chart */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Satış Trendi</h3>
              <div className="h-80">
                {getChartData() && getChartData().labels.length > 0 ? (
                  selectedChart === 'orders' ? (
                    <Bar data={getChartData()} options={getChartOptions()} />
                  ) : (
                    <Line data={getChartData()} options={getChartOptions()} />
                  )
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FaChartLine className="mx-auto text-gray-300 text-4xl mb-4" />
                      <p className="text-gray-500 text-lg font-medium">Henüz veri yok</p>
                      <p className="text-gray-400 text-sm">Satış yapmaya başladığınızda grafik burada görünecek</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Chart */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Dağılımı</h3>
              <div className="h-80">
                {getCategoryData() && getCategoryData().labels.length > 0 ? (
                  <Doughnut 
                    data={getCategoryData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '60%',
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                              size: 12,
                              weight: '500'
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: '#fff',
                          bodyColor: '#fff',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          borderWidth: 1,
                          cornerRadius: 8,
                          callbacks: {
                            label: function(context) {
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = ((context.parsed / total) * 100).toFixed(1);
                              return `${context.label}: ${formatNumber(context.parsed)} (${percentage}%)`;
                            }
                          }
                        }
                      },
                      elements: {
                        arc: {
                          borderWidth: 2,
                          borderColor: '#ffffff'
                        }
                      }
                    }} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FaBoxes className="mx-auto text-gray-300 text-4xl mb-4" />
                      <p className="text-gray-500 text-lg font-medium">Kategori verisi yok</p>
                      <p className="text-gray-400 text-sm">Ürün kategorilerinizde satış yapmaya başladığınızda burada görünecek</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Products */}
          {statsData?.topProduct && statsData.topProduct.name !== "Veri yok" && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürün</h3>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-500 rounded-lg">
                      <FaStar className="text-white text-xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{statsData.topProduct.name}</h4>
                      <p className="text-sm text-gray-600">En çok satan ürün</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">
                      {formatNumber(statsData.topProduct.salesCount || 0)}
                    </p>
                    <p className="text-sm text-gray-500">Satış Adedi</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Category */}
            {statsData?.topCategory && statsData.topCategory.name !== "Veri yok" && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">En Popüler Kategori</p>
                    <p className="text-lg font-bold text-indigo-900">{statsData.topCategory.name}</p>
                    <p className="text-xs text-indigo-500 mt-1">
                      {formatNumber(statsData.topCategory.salesCount || 0)} satış
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-500 rounded-lg">
                    <FaBoxes className="text-white text-xl" />
                  </div>
                </div>
              </div>
            )}

            {/* Total Products */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Toplam Ürün</p>
                  <p className="text-lg font-bold text-emerald-900">
                    {formatNumber(statsData?.totalProducts || 0)}
                  </p>
                  <p className="text-xs text-emerald-500 mt-1">Aktif ürün</p>
                </div>
                <div className="p-3 bg-emerald-500 rounded-lg">
                  <FaBoxes className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">Ortalama Puan</p>
                  <p className="text-lg font-bold text-amber-900">
                    {statsData?.averageRating ? statsData.averageRating.toFixed(1) : '0.0'}
                  </p>
                  <p className="text-xs text-amber-500 mt-1">5 üzerinden</p>
                </div>
                <div className="p-3 bg-amber-500 rounded-lg">
                  <FaStar className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerStatistics; 