import React, { useState, useEffect } from "react";
import { ShoppingCart, Search, Filter, MoreVertical, Eye, CheckCircle, XCircle, DollarSign, Calendar, User, Package, Clock } from "lucide-react";
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

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Search filter
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
                fetchOrders(); // Refresh the list
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
                <div className="loading">Yükleniyor...</div>
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

            <div className="admin-orders-header">
                <div className="header-content">
                    <div className="header-title">
                        <ShoppingCart className="header-icon" />
                        <h1>Sipariş Yönetimi</h1>
                    </div>
                    <p>Platformdaki tüm siparişleri yönetin ve takip edin</p>
                </div>
            </div>

            <div className="admin-orders-content">
                <div className="filters-section">
                    <div className="search-box">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Sipariş ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-controls">
                        <div className="filter-group">
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

                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <ShoppingCart />
                        </div>
                        <div className="stat-content">
                            <h3>TOPLAM SİPARİŞ</h3>
                            <p>{stats.totalOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon pending">
                            <Clock />
                        </div>
                        <div className="stat-content">
                            <h3>BEKLEYEN</h3>
                            <p>{stats.pendingOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon completed">
                            <CheckCircle />
                        </div>
                        <div className="stat-content">
                            <h3>TAMAMLANAN</h3>
                            <p>{stats.completedOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon revenue">
                            <DollarSign />
                        </div>
                        <div className="stat-content">
                            <h3>TOPLAM GELİR</h3>
                            <p>₺{stats.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="orders-table-container">
                    <div className="orders-table">
                        <div className="table-header">
                            <div className="header-cell">Sipariş ID</div>
                            <div className="header-cell">Müşteri</div>
                            <div className="header-cell">Tutar</div>
                            <div className="header-cell">Durum</div>
                            <div className="header-cell">Tarih</div>
                            <div className="header-cell">İşlemler</div>
                        </div>

                        <div className="table-body">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="table-row">
                                    <div className="table-cell order-id-cell">
                                        <div className="order-id">
                                            <span className="id-text">#{order.id.substring(0, 8)}</span>
                                        </div>
                                    </div>
                                    <div className="table-cell customer-cell">
                                        <div className="customer">
                                            <div className="customer-info">
                                                <User className="customer-icon" />
                                                <div>
                                                    <div className="customer-name">
                                                        {order.user?.firstName} {order.user?.lastName}
                                                    </div>
                                                    <div className="customer-email">
                                                        {order.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-cell amount-cell">
                                        <div className="amount">
                                            <span className="amount-text">{formatPrice(order.totalPrice)}</span>
                                        </div>
                                    </div>
                                    <div className="table-cell status-cell">
                                        <div className="status">
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>
                                    <div className="table-cell date-cell">
                                        <div className="date">
                                            <div className="date-info">
                                                <Calendar className="date-icon" />
                                                <span>{formatDate(order.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-cell actions-cell">
                                        <div className="actions">
                                            <div className="action-buttons">
                                                <button
                                                    className="action-btn view-btn"
                                                    onClick={() => viewOrderDetails(order)}
                                                    title="Detayları Görüntüle"
                                                >
                                                    <Eye />
                                                </button>
                                                
                                                {order.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            className="action-btn ship-btn"
                                                            onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                                                            title="Kargoya Ver"
                                                        >
                                                            <Package />
                                                        </button>
                                                        <button
                                                            className="action-btn complete-btn"
                                                            onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                                            title="Tamamla"
                                                        >
                                                            <CheckCircle />
                                                        </button>
                                                        <button
                                                            className="action-btn cancel-btn"
                                                            onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                                            title="İptal Et"
                                                        >
                                                            <XCircle />
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {order.status === 'SHIPPED' && (
                                                    <button
                                                        className="action-btn complete-btn"
                                                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                                        title="Tamamla"
                                                    >
                                                        <CheckCircle />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="no-orders">
                        <ShoppingCart className="no-orders-icon" />
                        <h3>Sipariş bulunamadı</h3>
                        <p>Arama kriterlerinize uygun sipariş bulunmuyor.</p>
                    </div>
                )}
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
