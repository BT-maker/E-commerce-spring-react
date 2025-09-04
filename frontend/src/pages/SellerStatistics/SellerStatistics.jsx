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

    const labels = statsData.dailySales?.map(item => item[0]) || [];
    const salesData = statsData.dailySales?.map(item => item[1]) || [];
    const revenueData = statsData.dailySales?.map(item => item[2]) || [];

    switch (selectedChart) {
      case 'sales':
        return {
          labels,
          datasets: [
            {
              label: 'Satış Adedi',
              data: salesData,
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        };
      case 'revenue':
        return {
          labels,
          datasets: [
            {
              label: 'Gelir (₺)',
              data: revenueData,
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        };
      case 'orders':
        return {
          labels,
          datasets: [
            {
              label: 'Sipariş Sayısı',
              data: salesData,
              backgroundColor: 'rgba(251, 146, 60, 0.8)',
              borderColor: 'rgb(251, 146, 60)',
              borderWidth: 1
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
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${getPeriodLabel()} - ${selectedChart === 'sales' ? 'Satış Adedi' : selectedChart === 'revenue' ? 'Gelir' : 'Sipariş Sayısı'}`
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  };

  const getCategoryData = () => {
    if (!statsData?.categoryStats) return null;

    return {
      labels: statsData.categoryStats.map(item => item[0]),
      datasets: [
        {
          data: statsData.categoryStats.map(item => item[1]),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(236, 72, 153, 0.8)'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
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
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Toplam Satış</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatNumber(statsData?.totalSold || 0)}
                  </p>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <FaShoppingCart className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Toplam Gelir */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(statsData?.totalRevenue || 0)}
                  </p>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <FaMoneyBillWave className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Ortalama Sipariş */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Ortalama Sipariş</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatCurrency(statsData?.averageOrderValue || 0)}
                  </p>
                </div>
                <div className="p-3 bg-orange-500 rounded-lg">
                  <FaBoxes className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Müşteri Sayısı */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Müşteri Sayısı</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatNumber(statsData?.uniqueCustomers || 0)}
                  </p>
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
                {selectedChart === 'orders' ? (
                  <Bar data={getChartData()} options={getChartOptions()} />
                ) : (
                  <Line data={getChartData()} options={getChartOptions()} />
                )}
              </div>
            </div>

            {/* Category Chart */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Dağılımı</h3>
              <div className="h-80">
                {getCategoryData() && (
                  <Doughnut 
                    data={getCategoryData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        }
                      }
                    }} 
                  />
                )}
              </div>
            </div>
          </div>

          {/* Top Products */}
          {statsData?.bestSellers && statsData.bestSellers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sıra</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ürün</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Satış Adedi</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Gelir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {statsData.bestSellers.map((product, index) => (
                        <tr key={index} className="hover:bg-gray-100 transition-colors">
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">{product[0]}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                              {formatNumber(product[1])}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-medium text-gray-900">
                            {formatCurrency(product[2])}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Daily Sales Table */}
          {statsData?.dailySales && statsData.dailySales.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Günlük Satışlar</h3>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tarih</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Satış Adedi</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Gelir</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {statsData.dailySales.map((day, index) => {
                        const [date, sales, revenue] = day;
                        const prevSales = index > 0 ? statsData.dailySales[index - 1][1] : sales;
                        const trend = sales > prevSales ? 'up' : sales < prevSales ? 'down' : 'stable';
                        
                        return (
                          <tr key={index} className="hover:bg-gray-100 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{date}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                {formatNumber(sales)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center font-medium text-gray-900">
                              {formatCurrency(revenue)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {trend === 'up' ? (
                                <FaArrowUp className="text-green-500 mx-auto" />
                              ) : trend === 'down' ? (
                                <FaArrowDown className="text-red-500 mx-auto" />
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerStatistics; 