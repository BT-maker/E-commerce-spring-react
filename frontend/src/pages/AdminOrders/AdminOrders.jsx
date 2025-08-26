import React, { useState, useEffect } from "react";
import { ShoppingCart, Search, Filter, Eye, CheckCircle, XCircle, DollarSign, Calendar, User, Package, Clock, TrendingUp } from "lucide-react";
import "./AdminOrders.css";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        fetchOrders();
        fetchOrderStats();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchTerm, statusFilter]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/admin/orders', {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Orders data received:", data);
                setOrders(data);
            } else {
                console.error("Orders response not ok:", response.status);
                const errorText = await response.text();
                console.error("Orders error response:", errorText);
                toast.error('Siparişler yüklenirken hata oluştu');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Siparişler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderStats = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/admin/orders/stats', {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Order stats received:", data);
                setStats(data);
            } else {
                console.error("Order stats response not ok:", response.status);
                const errorText = await response.text();
                console.error("Order stats error response:", errorText);
            }
        } catch (error) {
            console.error('Error fetching order stats:', error);
        }
    };

    const filterOrders = () => {
        let filtered = orders;

        if (statusFilter !== "all") {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredOrders(filtered);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8082/api/admin/orders/${orderId}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                toast.success(`Sipariş durumu ${getStatusText(newStatus)} olarak güncellendi`);
                fetchOrders();
            } else {
                console.error("Update status response not ok:", response.status);
                const errorText = await response.text();
                console.error("Update status error response:", errorText);
                toast.error('Sipariş durumu güncellenirken hata oluştu');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Sipariş durumu güncellenirken hata oluştu');
        }
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'COMPLETED':
                return <span className="status-badge completed">Tamamlandı</span>;
            case 'PENDING':
                return <span className="status-badge pending">Beklemede</span>;
            case 'CANCELLED':
                return <span className="status-badge cancelled">İptal Edildi</span>;
            case 'SHIPPED':
                return <span className="status-badge shipped">Kargoda</span>;
            default:
                return <span className="status-badge unknown">{status}</span>;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'Tamamlandı';
            case 'PENDING':
                return 'Beklemede';
            case 'CANCELLED':
                return 'İptal Edildi';
            case 'SHIPPED':
                return 'Kargoda';
            default:
                return status;
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="admin-orders">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-orders">
            <PageTitle title="Sipariş Yönetimi" />
            <MetaTags 
                title="Sipariş Yönetimi - Admin Panel"
                description="E-ticaret platformu sipariş yönetimi"
                keywords="admin, sipariş, yönetim, e-ticaret"
            />

            <div className="orders-header">
                <div className="header-left">
                    <div className="header-icon">
                        <ShoppingCart className="header-icon-svg" />
                    </div>
                    <div className="header-text">
                        <h1>Sipariş Yönetimi</h1>
                        <p>Platformdaki tüm siparişleri yönetin ve takip edin</p>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card total">
                    <div className="stat-icon">
                        <ShoppingCart />
                    </div>
                    <div className="stat-content">
                        <h3>Toplam Sipariş</h3>
                        <p className="stat-number">{stats.totalOrders}</p>
                        <span className="stat-trend">+12% geçen aya göre</span>
                    </div>
                </div>

                <div className="stat-card pending">
                    <div className="stat-icon">
                        <Clock />
                    </div>
                    <div className="stat-content">
                        <h3>Bekleyen</h3>
                        <p className="stat-number">{stats.pendingOrders}</p>
                        <span className="stat-trend">Acil işlem gerekiyor</span>
                    </div>
                </div>

                <div className="stat-card completed">
                    <div className="stat-icon">
                        <CheckCircle />
                    </div>
                    <div className="stat-content">
                        <h3>Tamamlanan</h3>
                        <p className="stat-number">{stats.completedOrders}</p>
                        <span className="stat-trend">+8% geçen aya göre</span>
                    </div>
                </div>

                <div className="stat-card revenue">
                    <div className="stat-icon">
                        <TrendingUp />
                    </div>
                    <div className="stat-content">
                        <h3>Toplam Gelir</h3>
                        <p className="stat-number">₺{stats.totalRevenue.toLocaleString()}</p>
                        <span className="stat-trend">+15% geçen aya göre</span>
                    </div>
                </div>
            </div>

            <div className="orders-container">
                <div className="filters-bar">
                    <div className="search-section">
                        <div className="search-input">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Sipariş ID, müşteri adı veya email ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filter-section">
                        <div className="filter-dropdown">
                            <Filter className="filter-icon" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Tüm Durumlar</option>
                                <option value="PENDING">Beklemede</option>
                                <option value="SHIPPED">Kargoda</option>
                                <option value="COMPLETED">Tamamlandı</option>
                                <option value="CANCELLED">İptal Edildi</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="orders-list">
                    {filteredOrders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <ShoppingCart />
                            </div>
                            <h3>Sipariş bulunamadı</h3>
                            <p>Arama kriterlerinize uygun sipariş bulunmuyor.</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-id">
                                        <span className="id-label">Sipariş ID</span>
                                        <span className="id-value">#{order.id.substring(0, 8)}</span>
                                    </div>
                                    <div className="order-status">
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>

                                <div className="order-content">
                                    <div className="customer-section">
                                        <div className="customer-avatar">
                                            <User />
                                        </div>
                                        <div className="customer-details">
                                            <h4>{order.user?.firstName} {order.user?.lastName}</h4>
                                            <p>{order.user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="order-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Tutar</span>
                                            <span className="detail-value amount">{formatPrice(order.totalPrice)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Tarih</span>
                                            <span className="detail-value date">
                                                <Calendar className="date-icon" />
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="order-actions">
                                        <button
                                            className="action-btn view"
                                            onClick={() => viewOrderDetails(order)}
                                            title="Detayları Görüntüle"
                                        >
                                            <Eye />
                                            <span>Detay</span>
                                        </button>
                                        
                                        {order.status === 'PENDING' && (
                                            <>
                                                <button
                                                    className="action-btn ship"
                                                    onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                                                    title="Kargoya Ver"
                                                >
                                                    <Package />
                                                    <span>Kargoya Ver</span>
                                                </button>
                                                <button
                                                    className="action-btn complete"
                                                    onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                                    title="Tamamla"
                                                >
                                                    <CheckCircle />
                                                    <span>Tamamla</span>
                                                </button>
                                                <button
                                                    className="action-btn cancel"
                                                    onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                                    title="İptal Et"
                                                >
                                                    <XCircle />
                                                    <span>İptal Et</span>
                                                </button>
                                            </>
                                        )}
                                        
                                        {order.status === 'SHIPPED' && (
                                            <button
                                                className="action-btn complete"
                                                onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                                title="Tamamla"
                                            >
                                                <CheckCircle />
                                                <span>Tamamla</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Sipariş Detayları</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <XCircle />
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="order-detail-header">
                                <div className="order-id-large">
                                    Sipariş #{selectedOrder.id.substring(0, 8)}
                                </div>
                                <div className="order-status-large">
                                    {getStatusBadge(selectedOrder.status)}
                                </div>
                            </div>
                            
                            <div className="order-detail-sections">
                                <div className="detail-section">
                                    <h3>Müşteri Bilgileri</h3>
                                    <div className="customer-details">
                                        <div className="detail-item">
                                            <label>Ad Soyad:</label>
                                            <span>{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>E-posta:</label>
                                            <span>{selectedOrder.user?.email}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h3>Sipariş Bilgileri</h3>
                                    <div className="order-details">
                                        <div className="detail-item">
                                            <label>Toplam Tutar:</label>
                                            <span className="total-amount">{formatPrice(selectedOrder.totalPrice)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Sipariş Tarihi:</label>
                                            <span>{formatDate(selectedOrder.createdAt)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Durum:</label>
                                            {getStatusBadge(selectedOrder.status)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h3>Sipariş Ürünleri</h3>
                                    <div className="order-items">
                                        {selectedOrder.items?.map((item, index) => (
                                            <div key={index} className="order-item">
                                                <div className="item-info">
                                                    <div className="item-name">{item.product?.name || 'Ürün Adı Yok'}</div>
                                                    <div className="item-details">
                                                        <span>Adet: {item.quantity}</span>
                                                        <span>Fiyat: {formatPrice(item.price)}</span>
                                                    </div>
                                                </div>
                                                <div className="item-total">
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
