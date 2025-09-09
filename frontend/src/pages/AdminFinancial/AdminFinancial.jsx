import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calendar,
  Download,
  Filter,
  Plus,
  Minus,
  CreditCard,
  Wallet,
  Banknote,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import * as XLSX from 'xlsx';
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

const AdminFinancial = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [financialData, setFinancialData] = useState({
    revenue: 111099.83,
    expenses: 38884.94,
    profit: 72214.89,
    profitMargin: 65,
    growthRate: 12.5
  });
  const [revenueData, setRevenueData] = useState({
    labels: ['1. Hafta', '2. Hafta', '3. Hafta', '4. Hafta'],
    datasets: [{
      label: 'Gelir',
      data: [250000, 280000, 300000, 320000],
      borderColor: 'rgb(20, 184, 166)',
      backgroundColor: 'rgba(20, 184, 166, 0.1)',
      tension: 0.4,
      fill: true
    }]
  });
  const [expenseData, setExpenseData] = useState({
    labels: ['1. Hafta', '2. Hafta', '3. Hafta', '4. Hafta'],
    datasets: [{
      label: 'Gider',
      data: [80000, 85000, 90000, 95000],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true
    }]
  });
  const [expenseCategories, setExpenseCategories] = useState({
    labels: ['Pazarlama', 'Operasyon', 'Teknoloji', 'İnsan Kaynakları', 'Diğer'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ],
      borderWidth: 2
    }]
  });
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      title: 'Sipariş Geliri',
      description: 'Online satış',
      type: 'REVENUE',
      amount: 1500.00,
      date: '2024-01-15',
      status: 'COMPLETED'
    },
    {
      id: 2,
      title: 'Pazarlama Gideri',
      description: 'Google Ads',
      type: 'EXPENSE',
      amount: 500.00,
      date: '2024-01-14',
      status: 'COMPLETED'
    },
    {
      id: 3,
      title: 'İade',
      description: 'Müşteri iadesi',
      type: 'REFUND',
      amount: 200.00,
      date: '2024-01-13',
      status: 'PENDING'
    }
  ]);
  const [budget, setBudget] = useState({
    total: 25000.00,
    used: 18750.00,
    remaining: 6250.00,
    percentage: 75
  });

  useEffect(() => {
    fetchFinancialData();
  }, [timeRange]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Mock data - gerçek API çağrıları burada yapılacak
      // Simulated API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data zaten state'te tanımlı
      console.log('Financial data loaded');
      
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast.error('Finansal veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const exportFinancialReport = () => {
    try {
      // Excel dosyası oluştur
      const workbook = createFinancialReport();
      
      // Dosyayı indir
      const fileName = `finansal-rapor-${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadExcelFile(workbook, fileName);
      
      toast.success('Finansal rapor başarıyla indirildi!');
    } catch (error) {
      console.error('Rapor indirme hatası:', error);
      toast.error('Rapor indirilirken hata oluştu!');
    }
  };

  const createFinancialReport = () => {
    const currentDate = new Date().toLocaleDateString('tr-TR');
    
    // Detaylı Excel verisi oluştur
    const reportData = {
      'Finansal Özet': [
        ['FİNANSAL RAPOR', ''],
        ['Rapor Tarihi', currentDate],
        [''],
        ['Metrik', 'Değer'],
        ['Toplam Gelir', formatCurrency(financialData.revenue)],
        ['Toplam Gider', formatCurrency(financialData.expenses)],
        ['Net Kar', formatCurrency(financialData.profit)],
        ['Kar Marjı', `%${financialData.profitMargin}`],
        ['Büyüme Oranı', `%${financialData.growthRate}`],
        [''],
        ['BÜTÇE DURUMU', ''],
        ['Toplam Bütçe', formatCurrency(budget.total)],
        ['Kullanılan Bütçe', formatCurrency(budget.used)],
        ['Kalan Bütçe', formatCurrency(budget.remaining)],
        ['Bütçe Kullanım Oranı', `%${budget.percentage}`]
      ],
      'Son İşlemler': [
        ['SON FİNANSAL İŞLEMLER', ''],
        ['Rapor Tarihi', currentDate],
        [''],
        ['İşlem', 'Tür', 'Tutar', 'Tarih', 'Durum'],
        ...transactions.map(t => [
          t.title,
          t.type === 'REVENUE' ? 'Gelir' : t.type === 'EXPENSE' ? 'Gider' : 'İade',
          formatCurrency(t.amount),
          formatDate(t.date),
          getStatusText(t.status)
        ])
      ],
      'Gelir Trendi': [
        ['GELİR TRENDİ', ''],
        ['Rapor Tarihi', currentDate],
        [''],
        ['Hafta', 'Gelir (₺)'],
        ...revenueData.labels.map((label, index) => [
          label,
          revenueData.datasets[0].data[index]
        ]),
        [''],
        ['Toplam Gelir', revenueData.datasets[0].data.reduce((sum, val) => sum + val, 0)]
      ],
      'Gider Trendi': [
        ['GİDER TRENDİ', ''],
        ['Rapor Tarihi', currentDate],
        [''],
        ['Hafta', 'Gider (₺)'],
        ...expenseData.labels.map((label, index) => [
          label,
          expenseData.datasets[0].data[index]
        ]),
        [''],
        ['Toplam Gider', expenseData.datasets[0].data.reduce((sum, val) => sum + val, 0)]
      ],
      'Gider Kategorileri': [
        ['GİDER KATEGORİLERİ', ''],
        ['Rapor Tarihi', currentDate],
        [''],
        ['Kategori', 'Yüzde (%)'],
        ...expenseCategories.labels.map((label, index) => [
          label,
          expenseCategories.datasets[0].data[index]
        ])
      ]
    };

    return reportData;
  };

  const downloadExcelFile = (workbook, fileName) => {
    // XLSX kütüphanesi ile gerçek Excel dosyası oluştur
    const wb = XLSX.utils.book_new();
    
    // Her sheet için ayrı worksheet oluştur
    Object.entries(workbook).forEach(([sheetName, data]) => {
      const ws = XLSX.utils.aoa_to_sheet(data);
      
      // Sütun genişliklerini ayarla
      const colWidths = data[0].map((_, index) => ({
        wch: Math.max(...data.map(row => String(row[index] || '').length)) + 2
      }));
      ws['!cols'] = colWidths;
      
      // Sheet'i workbook'a ekle
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
    
    // Excel dosyasını indir
    XLSX.writeFile(wb, fileName);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'REVENUE':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'EXPENSE':
        return <Minus className="w-4 h-4 text-red-500" />;
      case 'REFUND':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      default:
        return <Banknote className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionStatus = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'FAILED':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'PENDING':
        return 'Beklemede';
      case 'FAILED':
        return 'Başarısız';
      default:
        return status;
    }
  };

  // StatCard component
  const StatCard = ({ title, value, icon: Icon, change, changeType, isPrice = false, iconColor }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {isPrice ? formatCurrency(value) : value.toLocaleString()}
          </p>
          {change && (
            <div className={`flex items-center text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span className="font-medium">%{change}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}>
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
          <p className="text-gray-600">Finansal veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageTitle title="Finansal Yönetim" />
      <MetaTags 
        title="Finansal Yönetim"
        description="Finansal raporlar ve ödemeler. Platform finansal durumu."
        keywords="finansal yönetim, gelir, gider, kar, bütçe"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-sm rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Finansal Yönetim</h1>
                <p className="text-gray-600 mt-1">Finansal raporlar ve ödemeler</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchFinancialData}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Yenile"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={exportFinancialReport}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Rapor İndir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
          <StatCard
            title="Toplam Gelir"
            value={financialData.revenue}
            icon={TrendingUp}
            change={financialData.growthRate}
            changeType="positive"
            isPrice={true}
            iconColor="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="Toplam Gider"
            value={financialData.expenses}
            icon={TrendingDown}
            change={financialData.growthRate}
            changeType="negative"
            isPrice={true}
            iconColor="bg-gradient-to-r from-red-500 to-red-600"
          />
          <StatCard
            title="Net Kar"
            value={financialData.profit}
            icon={DollarSign}
            change={financialData.profitMargin}
            changeType="positive"
            isPrice={true}
            iconColor="bg-gradient-to-r from-emerald-500 to-emerald-600"
          />
          <StatCard
            title="Bütçe Durumu"
            value={budget.remaining}
            icon={Wallet}
            change={budget.percentage}
            changeType="positive"
            isPrice={true}
            iconColor="bg-gradient-to-r from-blue-500 to-blue-600"
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
                  <option value="week">Bu Hafta</option>
                  <option value="month">Bu Ay</option>
                  <option value="quarter">Bu Çeyrek</option>
                  <option value="year">Bu Yıl</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
          {/* Revenue Trend Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Gelir Trendi</h3>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="h-64">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>

          {/* Expense Categories Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Gider Kategorileri</h3>
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="h-64">
              <Doughnut data={expenseCategories} options={doughnutOptions} />
            </div>
          </div>

          {/* Expense Trend Chart */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Gider Trendi</h3>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <div className="h-64">
              <Line data={expenseData} options={chartOptions} />
            </div>
          </div>

          {/* Budget Overview */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Bütçe Durumu</h3>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={budget.percentage > 80 ? "#ef4444" : "#10b981"}
                      strokeWidth="3"
                      strokeDasharray={`${budget.percentage}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{budget.percentage}%</div>
                      <div className="text-xs text-gray-500">Kullanıldı</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Toplam Bütçe:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(budget.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kullanılan:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(budget.used)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kalan:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(budget.remaining)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm mx-6">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Son Finansal İşlemler</h2>
              <button className="text-orange-600 hover:text-orange-700 font-medium">
                Tümünü Gör
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b border-gray-200/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      İşlem
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tür
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tutar
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{transaction.title}</p>
                            <p className="text-xs text-gray-500">{transaction.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'REVENUE' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'EXPENSE' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type === 'REVENUE' ? 'Gelir' : 
                           transaction.type === 'EXPENSE' ? 'Gider' : 'İade'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${
                          transaction.type === 'REVENUE' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'REVENUE' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDate(transaction.date)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getTransactionStatus(transaction.status)}
                          <span className="text-sm text-gray-600">{getStatusText(transaction.status)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminFinancial;