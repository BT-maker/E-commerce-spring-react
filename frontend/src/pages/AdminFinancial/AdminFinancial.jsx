import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, BarChart3, PieChart, Calendar, ArrowUpRight, ArrowDownRight, ShoppingCart, Users, Package } from "lucide-react";
import "./AdminFinancial.css";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';
import toast from 'react-hot-toast';

const AdminFinancial = () => {
    const [financialData, setFinancialData] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    useEffect(() => {
        fetchFinancialData();
        fetchMonthlyData();
    }, []);

    const fetchFinancialData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/admin/financial/reports', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFinancialData(data);
            } else {
                toast.error('Finansal veriler yüklenirken hata oluştu');
            }
        } catch (error) {
            console.error('Error fetching financial data:', error);
            toast.error('Finansal veriler yüklenirken hata oluştu');
        }
    };

    const fetchMonthlyData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/admin/financial/monthly-sales', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMonthlyData(data);
            } else {
                toast.error('Aylık veriler yüklenirken hata oluştu');
            }
        } catch (error) {
            console.error('Error fetching monthly data:', error);
            toast.error('Aylık veriler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(price);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('tr-TR').format(number);
    };

    const getGrowthIcon = (growth) => {
        if (growth > 0) {
            return <ArrowUpRight className="growth-icon positive" />;
        } else if (growth < 0) {
            return <ArrowDownRight className="growth-icon negative" />;
        }
        return null;
    };

    const getGrowthColor = (growth) => {
        if (growth > 0) return 'positive';
        if (growth < 0) return 'negative';
        return 'neutral';
    };

    if (loading) {
        return (
            <div className="admin-financial">
                <div className="loading">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="admin-financial">
            <PageTitle title="Finansal Raporlar" />
            <MetaTags 
                title="Finansal Raporlar - Admin Panel"
                description="E-ticaret platformu finansal raporları"
                keywords="admin, finansal, rapor, gelir, satış"
            />

            <div className="admin-financial-header">
                <div className="header-content">
                    <div className="header-title">
                        <DollarSign className="header-icon" />
                        <h1>Finansal Raporlar</h1>
                    </div>
                    <p>Platformun finansal performansını takip edin ve analiz edin</p>
                </div>
            </div>

            <div className="admin-financial-content">
                {/* Financial Overview Cards */}
                <div className="financial-overview">
                    <div className="overview-card total-revenue">
                        <div className="card-icon">
                            <DollarSign />
                        </div>
                        <div className="card-content">
                            <h3>Toplam Gelir</h3>
                            <div className="card-value">
                                {financialData ? formatPrice(financialData.totalRevenue || 0) : '₺0'}
                            </div>
                            <div className="card-growth positive">
                                <ArrowUpRight />
                                <span>+12.5%</span>
                            </div>
                        </div>
                    </div>

                    <div className="overview-card completed-revenue">
                        <div className="card-icon">
                            <TrendingUp />
                        </div>
                        <div className="card-content">
                            <h3>Tamamlanan Gelir</h3>
                            <div className="card-value">
                                {financialData ? formatPrice(financialData.completedRevenue || 0) : '₺0'}
                            </div>
                            <div className="card-growth positive">
                                <ArrowUpRight />
                                <span>+8.3%</span>
                            </div>
                        </div>
                    </div>

                    <div className="overview-card pending-revenue">
                        <div className="card-icon">
                            <Clock />
                        </div>
                        <div className="card-content">
                            <h3>Bekleyen Gelir</h3>
                            <div className="card-value">
                                {financialData ? formatPrice(financialData.pendingRevenue || 0) : '₺0'}
                            </div>
                            <div className="card-growth neutral">
                                <span>0%</span>
                            </div>
                        </div>
                    </div>

                    <div className="overview-card total-orders">
                        <div className="card-icon">
                            <ShoppingCart />
                        </div>
                        <div className="card-content">
                            <h3>Toplam Sipariş</h3>
                            <div className="card-value">
                                {financialData ? formatNumber(financialData.totalOrders || 0) : '0'}
                            </div>
                            <div className="card-growth positive">
                                <ArrowUpRight />
                                <span>+15.2%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Performance */}
                <div className="monthly-performance">
                    <div className="section-header">
                        <h2>Aylık Performans</h2>
                        <div className="period-selector">
                            <button 
                                className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
                                onClick={() => setSelectedPeriod('month')}
                            >
                                Bu Ay
                            </button>
                            <button 
                                className={`period-btn ${selectedPeriod === 'quarter' ? 'active' : ''}`}
                                onClick={() => setSelectedPeriod('quarter')}
                            >
                                Bu Çeyrek
                            </button>
                            <button 
                                className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
                                onClick={() => setSelectedPeriod('year')}
                            >
                                Bu Yıl
                            </button>
                        </div>
                    </div>

                    <div className="monthly-stats">
                        <div className="stat-item">
                            <div className="stat-label">Aylık Gelir</div>
                            <div className="stat-value">
                                {monthlyData ? formatPrice(monthlyData.monthlyRevenue || 0) : '₺0'}
                            </div>
                            <div className="stat-change positive">
                                <ArrowUpRight />
                                <span>+18.7%</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-label">Aylık Sipariş</div>
                            <div className="stat-value">
                                {monthlyData ? formatNumber(monthlyData.monthlyOrders || 0) : '0'}
                            </div>
                            <div className="stat-change positive">
                                <ArrowUpRight />
                                <span>+22.1%</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-label">Ortalama Sipariş</div>
                            <div className="stat-value">
                                {monthlyData ? formatPrice(monthlyData.averageOrderValue || 0) : '₺0'}
                            </div>
                            <div className="stat-change negative">
                                <ArrowDownRight />
                                <span>-2.3%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue Distribution */}
                <div className="revenue-distribution">
                    <div className="section-header">
                        <h2>Gelir Dağılımı</h2>
                    </div>
                    
                    <div className="distribution-cards">
                        <div className="distribution-card">
                            <div className="distribution-header">
                                <h3>Tamamlanan Siparişler</h3>
                                <div className="distribution-percentage">
                                    {financialData && financialData.totalOrders > 0 
                                        ? Math.round((financialData.completedOrders / financialData.totalOrders) * 100)
                                        : 0}%
                                </div>
                            </div>
                            <div className="distribution-bar">
                                <div 
                                    className="distribution-fill completed"
                                    style={{
                                        width: `${financialData && financialData.totalOrders > 0 
                                            ? (financialData.completedOrders / financialData.totalOrders) * 100
                                            : 0}%`
                                    }}
                                ></div>
                            </div>
                            <div className="distribution-stats">
                                <span>{financialData ? formatNumber(financialData.completedOrders || 0) : '0'} sipariş</span>
                                <span>{financialData ? formatPrice(financialData.completedRevenue || 0) : '₺0'}</span>
                            </div>
                        </div>

                        <div className="distribution-card">
                            <div className="distribution-header">
                                <h3>Bekleyen Siparişler</h3>
                                <div className="distribution-percentage">
                                    {financialData && financialData.totalOrders > 0 
                                        ? Math.round((financialData.pendingOrders / financialData.totalOrders) * 100)
                                        : 0}%
                                </div>
                            </div>
                            <div className="distribution-bar">
                                <div 
                                    className="distribution-fill pending"
                                    style={{
                                        width: `${financialData && financialData.totalOrders > 0 
                                            ? (financialData.pendingOrders / financialData.totalOrders) * 100
                                            : 0}%`
                                    }}
                                ></div>
                            </div>
                            <div className="distribution-stats">
                                <span>{financialData ? formatNumber(financialData.pendingOrders || 0) : '0'} sipariş</span>
                                <span>{financialData ? formatPrice(financialData.pendingRevenue || 0) : '₺0'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Charts Placeholder */}
                <div className="financial-charts">
                    <div className="section-header">
                        <h2>Gelir Grafikleri</h2>
                    </div>
                    
                    <div className="charts-grid">
                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Aylık Gelir Trendi</h3>
                                <BarChart3 className="chart-icon" />
                            </div>
                            <div className="chart-placeholder">
                                <div className="placeholder-content">
                                    <BarChart3 className="placeholder-icon" />
                                    <p>Gelir grafiği burada görüntülenecek</p>
                                    <span>Chart.js veya Recharts entegrasyonu gerekli</span>
                                </div>
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Gelir Dağılımı</h3>
                                <PieChart className="chart-icon" />
                            </div>
                            <div className="chart-placeholder">
                                <div className="placeholder-content">
                                    <PieChart className="placeholder-icon" />
                                    <p>Pasta grafiği burada görüntülenecek</p>
                                    <span>Chart.js veya Recharts entegrasyonu gerekli</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Financial Activity */}
                <div className="recent-activity">
                    <div className="section-header">
                        <h2>Son Finansal Aktiviteler</h2>
                    </div>
                    
                    <div className="activity-list">
                        <div className="activity-item positive">
                            <div className="activity-icon">
                                <DollarSign />
                            </div>
                            <div className="activity-content">
                                <div className="activity-title">Yeni sipariş tamamlandı</div>
                                <div className="activity-description">#12345 siparişi başarıyla tamamlandı</div>
                                <div className="activity-time">2 saat önce</div>
                            </div>
                            <div className="activity-amount">+₺1,250</div>
                        </div>

                        <div className="activity-item positive">
                            <div className="activity-icon">
                                <TrendingUp />
                            </div>
                            <div className="activity-content">
                                <div className="activity-title">Gelir artışı</div>
                                <div className="activity-description">Bu hafta %15 gelir artışı kaydedildi</div>
                                <div className="activity-time">1 gün önce</div>
                            </div>
                            <div className="activity-amount">+₺8,750</div>
                        </div>

                        <div className="activity-item neutral">
                            <div className="activity-icon">
                                <ShoppingCart />
                            </div>
                            <div className="activity-content">
                                <div className="activity-title">Yeni sipariş</div>
                                <div className="activity-description">#12346 siparişi oluşturuldu</div>
                                <div className="activity-time">3 gün önce</div>
                            </div>
                            <div className="activity-amount">₺850</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFinancial;
