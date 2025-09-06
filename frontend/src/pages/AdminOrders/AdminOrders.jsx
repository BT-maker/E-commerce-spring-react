import React, { useState, useEffect } from "react";
import { ShoppingCart, Search, Filter, Eye, CheckCircle, XCircle, DollarSign, Calendar, User, Package, Clock, TrendingUp, AlertCircle, Truck } from "lucide-react";
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
            console.error("Orders fetch error:", error);
            toast.error('Siparişler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderStats = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/admin/orders/stats', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Order stats fetch error:", error);
        }
    };

    const filterOrders = () => {
        let filtered = orders;

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.id?.toString().includes(searchTerm) ||
                order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        setFilteredOrders(filtered);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
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

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800';
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'REFUNDED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="w-4 h-4" />;
            case 'CONFIRMED':
                return <CheckCircle className="w-4 h-4" />;
            case 'SHIPPED':
                return <Truck className="w-4 h-4" />;
            case 'DELIVERED':
                return <CheckCircle className="w-4 h-4" />;
            case 'CANCELLED':
                return <XCircle className="w-4 h-4" />;
            case 'REFUNDED':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Beklemede';
            case 'CONFIRMED':
                return 'Onaylandı';
            case 'SHIPPED':
                return 'Kargoya Verildi';
            case 'DELIVERED':
                return 'Teslim Edildi';
            case 'CANCELLED':
                return 'İptal Edildi';
            case 'REFUNDED':
                return 'İade Edildi';
            default:
                return status;
        }
    };

    const openOrderModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
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
                            <span className="font-medium">{change}</span>
                        </div>
                    )}
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Siparişler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <PageTitle title="Sipariş Yönetimi" />
            <MetaTags 
                title="Sipariş Yönetimi"
                description="Sipariş takibi ve yönetimi. Sipariş durumları ve müşteri bilgileri."
                keywords="sipariş yönetimi, sipariş takibi, sipariş durumları"
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-sm rounded-xl p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                            <ShoppingCart className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Sipariş Yönetimi</h1>
                            <p className="text-gray-600 mt-1">Sipariş takibi ve durum yönetimi</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
                    <StatCard
                        title="Toplam Sipariş"
                        value={stats.totalOrders || 0}
                        icon={ShoppingCart}
                        change="+12%"
                        changeType="positive"
                    />
                    <StatCard
                        title="Bekleyen Sipariş"
                        value={stats.pendingOrders || 0}
                        icon={Clock}
                        change="+5%"
                        changeType="positive"
                    />
                    <StatCard
                        title="Tamamlanan"
                        value={stats.completedOrders || 0}
                        icon={CheckCircle}
                        change="+18%"
                        changeType="positive"
                    />
                    <StatCard
                        title="Toplam Gelir"
                        value={stats.totalRevenue || 0}
                        icon={DollarSign}
                        change="+25%"
                        changeType="positive"
                        isPrice={true}
                    />
                </div>

                {/* Filters */}
                <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm mx-6">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Sipariş ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center space-x-4">
                                <Filter className="w-5 h-5 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                                >
                                    <option value="all">Tüm Durumlar</option>
                                    <option value="PENDING">Beklemede</option>
                                    <option value="CONFIRMED">Onaylandı</option>
                                    <option value="SHIPPED">Kargoya Verildi</option>
                                    <option value="DELIVERED">Teslim Edildi</option>
                                    <option value="CANCELLED">İptal Edildi</option>
                                    <option value="REFUNDED">İade Edildi</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm mx-6 overflow-hidden">
                    {filteredOrders.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50 border-b border-gray-200/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Sipariş No
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Müşteri
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Tarih
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Tutar
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Durum
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Ürün Sayısı
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                İşlemler
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200/50">
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        #{order.id}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                            <span className="text-white font-semibold text-sm">
                                                                {(order.customerName || 'M').charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {order.customerName || 'Müşteri Yok'}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {order.customerEmail || 'Email Yok'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {formatDate(order.orderDate)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {formatPrice(order.totalAmount)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        <span className="ml-1">{getStatusText(order.status)}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Package className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {order.itemCount || 0} ürün
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => openOrderModal(order)}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                                            title="Detayları Görüntüle"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors duration-200"
                                                            title="Durum Güncelle"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sipariş Bulunamadı</h3>
                            <p className="text-gray-500">Arama kriterlerinize uygun sipariş bulunamadı.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Sipariş Detayları</h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <XCircle className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sipariş No</label>
                                    <p className="text-gray-900 font-semibold">#{selectedOrder.id}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedOrder.status)}`}>
                                        {getStatusIcon(selectedOrder.status)}
                                        <span className="ml-1">{getStatusText(selectedOrder.status)}</span>
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Müşteri</label>
                                    <p className="text-gray-900">{selectedOrder.customerName || 'Müşteri Yok'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <p className="text-gray-900">{selectedOrder.customerEmail || 'Email Yok'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                                    <p className="text-gray-900">{formatDate(selectedOrder.orderDate)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Toplam Tutar</label>
                                    <p className="text-gray-900 font-semibold">{formatPrice(selectedOrder.totalAmount)}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            {selectedOrder.items && selectedOrder.items.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sipariş Ürünleri</label>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{item.productName}</p>
                                                        <p className="text-sm text-gray-600">Miktar: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-semibold text-gray-900">{formatPrice(item.price)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Shipping Address */}
                            {selectedOrder.shippingAddress && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Teslimat Adresi</label>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-900">{selectedOrder.shippingAddress}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                            >
                                Kapat
                            </button>
                            <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-200">
                                Durum Güncelle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;