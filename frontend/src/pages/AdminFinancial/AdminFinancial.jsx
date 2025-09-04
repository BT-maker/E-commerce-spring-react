import React, { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3, 
  Calendar,
  Download,
  Filter,
  Plus,
  Minus,
  CreditCard,
  Wallet,
  Banknote,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Clock
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

const AdminFinancial = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [financialData, setFinancialData] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    profitMargin: 0,
    growthRate: 0
  });
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: []
  });
  const [expenseData, setExpenseData] = useState({
    labels: [],
    datasets: []
  });
  const [profitData, setProfitData] = useState({
    labels: [],
    datasets: []
  });
  const [expenseCategories, setExpenseCategories] = useState({
    labels: [],
    datasets: []
  });
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState({
    total: 0,
    used: 0,
    remaining: 0,
    percentage: 0
  });

  useEffect(() => {
    fetchFinancialData();
  }, [timeRange]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Finansal verileri getir
      const financialResponse = await fetch(`http://localhost:8082/api/admin/financial/data?range=${timeRange}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (financialResponse.ok) {
        const data = await financialResponse.json();
        setFinancialData(data);
      }

      // Gelir verilerini getir
      const revenueResponse = await fetch(`http://localhost:8082/api/admin/financial/revenue?range=${timeRange}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (revenueResponse.ok) {
        const data = await revenueResponse.json();
        setRevenueData(data);
      }

      // Gider verilerini getir
      const expenseResponse = await fetch(`http://localhost:8082/api/admin/financial/expenses?range=${timeRange}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (expenseResponse.ok) {
        const data = await expenseResponse.json();
        setExpenseData(data);
      }

      // Kar verilerini getir
      const profitResponse = await fetch(`http://localhost:8082/api/admin/financial/profit?range=${timeRange}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (profitResponse.ok) {
        const data = await profitResponse.json();
        setProfitData(data);
      }

      // Gider kategorilerini getir
      const categoriesResponse = await fetch(`http://localhost:8082/api/admin/financial/expense-categories`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (categoriesResponse.ok) {
        const data = await categoriesResponse.json();
        setExpenseCategories(data);
      }

      // İşlemleri getir
      const transactionsResponse = await fetch(`http://localhost:8082/api/admin/financial/transactions`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (transactionsResponse.ok) {
        const data = await transactionsResponse.json();
        setTransactions(data);
      }

      // Bütçe verilerini getir
      const budgetResponse = await fetch(`http://localhost:8082/api/admin/financial/budget`, {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (budgetResponse.ok) {
        const data = await budgetResponse.json();
        setBudget(data);
      }

    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast.error('Finansal veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const exportFinancialReport = () => {
    toast.success('Finansal rapor dışa aktarılıyor...');
    // PDF export işlemi burada yapılacak
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
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
        return <Plus className="text-green-500" />;
      case 'EXPENSE':
        return <Minus className="text-red-500" />;
      case 'REFUND':
        return <CreditCard className="text-blue-500" />;
      default:
        return <Banknote className="text-gray-500" />;
    }
  };

  const getTransactionStatus = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="text-green-500" />;
      case 'PENDING':
        return <Clock className="text-yellow-500" />;
      case 'FAILED':
        return <AlertTriangle className="text-red-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="admin-financial">
        <div className="loading">Finansal veriler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="admin-financial">
      <PageTitle title="Finansal Yönetim" />
      <MetaTags 
        title="Finansal Yönetim - Admin Panel"
        description="E-ticaret platformu finansal yönetimi"
        keywords="admin, finansal, yönetim, gelir, gider, kar, e-ticaret"
      />

      <div className="admin-financial-header">
        <div className="header-content">
          <div className="header-title">
            <DollarSign className="header-icon" />
            <h1>Finansal Yönetim</h1>
          </div>
          <p>Platform finansal durumunu analiz edin ve yönetin</p>
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
          
          <button className="export-btn" onClick={exportFinancialReport}>
            <Download />
            Rapor İndir
          </button>
        </div>
      </div>

      <div className="admin-financial-content">
        {/* Ana Finansal Kartları */}
        <div className="financial-cards">
          <div className="financial-card revenue">
            <div className="card-icon">
              <TrendingUp />
            </div>
            <div className="card-content">
              <h3>Toplam Gelir</h3>
              <p>{formatCurrency(financialData.revenue)}</p>
              <span className="growth positive">
                +{financialData.growthRate}%
              </span>
            </div>
          </div>
          
          <div className="financial-card expense">
            <div className="card-icon">
              <TrendingDown />
            </div>
            <div className="card-content">
              <h3>Toplam Gider</h3>
              <p>{formatCurrency(financialData.expenses)}</p>
              <span className="growth negative">
                -{financialData.growthRate}%
              </span>
            </div>
          </div>
          
          <div className="financial-card profit">
            <div className="card-icon">
              <DollarSign />
            </div>
            <div className="card-content">
              <h3>Net Kar</h3>
              <p>{formatCurrency(financialData.profit)}</p>
              <span className="margin">
                %{financialData.profitMargin} Kar Marjı
              </span>
            </div>
          </div>
          
          <div className="financial-card budget">
            <div className="card-icon">
              <Wallet />
            </div>
            <div className="card-content">
              <h3>Bütçe Durumu</h3>
              <p>{formatCurrency(budget.remaining)}</p>
              <span className={`budget-status ${budget.percentage > 80 ? 'warning' : 'normal'}`}>
                %{budget.percentage} Kullanıldı
              </span>
            </div>
          </div>
        </div>

        {/* Grafikler */}
        <div className="charts-section">
          <div className="chart-row">
            {/* Gelir Trendi */}
            <div className="chart-card large">
              <div className="chart-header">
                <h3>Gelir Trendi</h3>
                <TrendingUp className="chart-icon" />
              </div>
              <div className="chart-container">
                <Line 
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

            {/* Gider Analizi */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Gider Kategorileri</h3>
                <PieChart className="chart-icon" />
              </div>
              <div className="chart-container">
                <Doughnut 
                  data={expenseCategories}
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

          <div className="chart-row">
            {/* Kar Analizi */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Kar Analizi</h3>
                <BarChart3 className="chart-icon" />
              </div>
              <div className="chart-container">
                <Bar 
                  data={profitData}
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

            {/* Gider Trendi */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Gider Trendi</h3>
                <TrendingDown className="chart-icon" />
              </div>
              <div className="chart-container">
                <Line 
                  data={expenseData}
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
          </div>
        </div>

        {/* Bütçe Yönetimi */}
        <div className="budget-section">
          <div className="section-header">
            <h2>Bütçe Yönetimi</h2>
            <button className="add-budget-btn">
              <Plus />
              Bütçe Ekle
            </button>
          </div>
          
          <div className="budget-cards">
            <div className="budget-overview">
              <div className="budget-progress">
                <div className="progress-circle">
                  <svg viewBox="0 0 36 36" className="progress-ring">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={budget.percentage > 80 ? "#ef4444" : "#10b981"}
                      strokeWidth="3"
                      strokeDasharray={`${budget.percentage}, 100`}
                    />
                  </svg>
                  <div className="progress-text">
                    <span className="percentage">{budget.percentage}%</span>
                    <span className="label">Kullanıldı</span>
                  </div>
                </div>
              </div>
              
              <div className="budget-details">
                <div className="budget-item">
                  <span className="label">Toplam Bütçe:</span>
                  <span className="value">{formatCurrency(budget.total)}</span>
                </div>
                <div className="budget-item">
                  <span className="label">Kullanılan:</span>
                  <span className="value used">{formatCurrency(budget.used)}</span>
                </div>
                <div className="budget-item">
                  <span className="label">Kalan:</span>
                  <span className="value remaining">{formatCurrency(budget.remaining)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Son İşlemler */}
        <div className="transactions-section">
          <div className="section-header">
            <h2>Son Finansal İşlemler</h2>
            <button className="view-all-btn">Tümünü Gör</button>
          </div>
          
          <div className="transactions-table">
            <div className="table-header">
              <div className="header-cell">İşlem</div>
              <div className="header-cell">Tür</div>
              <div className="header-cell">Tutar</div>
              <div className="header-cell">Tarih</div>
              <div className="header-cell">Durum</div>
            </div>
            
            <div className="table-body">
              {transactions.map((transaction, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell transaction">
                    <div className="transaction-icon">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="transaction-info">
                      <div className="transaction-title">{transaction.title}</div>
                      <div className="transaction-description">{transaction.description}</div>
                    </div>
                  </div>
                  
                  <div className="table-cell type">
                    <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                      {transaction.type === 'REVENUE' ? 'Gelir' : 
                       transaction.type === 'EXPENSE' ? 'Gider' : 'İade'}
                    </span>
                  </div>
                  
                  <div className="table-cell amount">
                    <span className={`amount-text ${transaction.type === 'REVENUE' ? 'positive' : 'negative'}`}>
                      {transaction.type === 'REVENUE' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  
                  <div className="table-cell date">
                    <div className="date-info">
                      <Calendar className="date-icon" />
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                  
                  <div className="table-cell status">
                    <div className="status-info">
                      {getTransactionStatus(transaction.status)}
                      <span className="status-text">{transaction.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hızlı İşlemler */}
        <div className="quick-actions">
          <div className="action-card">
            <div className="action-icon">
              <Calculator />
            </div>
            <h3>Vergi Hesaplayıcı</h3>
            <p>KDV ve diğer vergi hesaplamaları</p>
            <button className="action-btn">Hesapla</button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">
              <BarChart3 />
            </div>
            <h3>Finansal Rapor</h3>
            <p>Detaylı finansal analiz raporu</p>
            <button className="action-btn">Oluştur</button>
          </div>
          
          <div className="action-card">
            <div className="action-icon">
              <Wallet />
            </div>
            <h3>Bütçe Planlama</h3>
            <p>Gelecek dönem bütçe planlaması</p>
            <button className="action-btn">Planla</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancial;
