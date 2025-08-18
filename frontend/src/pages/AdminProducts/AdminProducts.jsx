import React, { useState, useEffect } from "react";
import { Package, Search, Filter, MoreVertical, Edit, Trash2, Eye, CheckCircle, XCircle, DollarSign, ShoppingBag, Calendar, Store, Clock } from "lucide-react";
import "./AdminProducts.css";
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        pendingProducts: 0
    });

    useEffect(() => {
        fetchProducts();
        fetchProductStats();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, statusFilter]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/admin/products', {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Products data received:", data);
                setProducts(data);
            } else {
                console.error("Products response not ok:", response.status);
                const errorText = await response.text();
                console.error("Products error response:", errorText);
                toast.error('Ürünler yüklenirken hata oluştu');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Ürünler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductStats = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/admin/products/stats', {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Product stats received:", data);
                setStats(data);
            } else {
                console.error("Product stats response not ok:", response.status);
                const errorText = await response.text();
                console.error("Product stats error response:", errorText);
            }
        } catch (error) {
            console.error('Error fetching product stats:', error);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(product => product.status === statusFilter);
        }

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    const updateProductStatus = async (productId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8082/api/admin/products/${productId}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                toast.success(`Ürün ${newStatus === 'AKTİF' ? 'onaylandı' : 'reddedildi'}`);
                fetchProducts(); // Refresh the list
            } else {
                console.error("Update status response not ok:", response.status);
                const errorText = await response.text();
                console.error("Update status error response:", errorText);
                toast.error('Ürün durumu güncellenirken hata oluştu');
            }
        } catch (error) {
            console.error('Error updating product status:', error);
            toast.error('Ürün durumu güncellenirken hata oluştu');
        }
    };

    const viewProductDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'AKTİF':
                return <span className="status-badge active">Aktif</span>;
            case 'PASİF':
                return <span className="status-badge inactive">Pasif</span>;
            case 'BEKLEMEDE':
                return <span className="status-badge pending">Beklemede</span>;
            default:
                return <span className="status-badge unknown">{status}</span>;
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="admin-products">
                <div className="loading">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="admin-products">
            <PageTitle title="Ürün Yönetimi" />
            <MetaTags 
                title="Ürün Yönetimi - Admin Panel"
                description="E-ticaret platformu ürün yönetimi"
                keywords="admin, ürün, yönetim, e-ticaret"
            />

            <div className="admin-products-header">
                <div className="header-content">
                    <div className="header-title">
                        <Package className="header-icon" />
                        <h1>Ürün Yönetimi</h1>
                    </div>
                    <p>Platformdaki tüm ürünleri yönetin ve onaylayın</p>
                </div>
            </div>

            <div className="admin-products-content">
                <div className="filters-section">
                    <div className="search-box">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Ürün ara..."
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
                                <option value="AKTİF">Aktif</option>
                                <option value="PASİF">Pasif</option>
                                <option value="BEKLEMEDE">Beklemede</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Package />
                        </div>
                        <div className="stat-content">
                            <h3>TOPLAM ÜRÜN</h3>
                            <p>{stats.totalProducts}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon active">
                            <CheckCircle />
                        </div>
                        <div className="stat-content">
                            <h3>AKTİF ÜRÜN</h3>
                            <p>{stats.activeProducts}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon pending">
                            <Clock />
                        </div>
                        <div className="stat-content">
                            <h3>BEKLEYEN</h3>
                            <p>{stats.pendingProducts}</p>
                        </div>
                    </div>
                </div>

                <div className="products-grid">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image">
                                <img src={product.imageUrl || '/images/default-product.jpg'} alt={product.name} />
                                {getStatusBadge(product.status)}
                            </div>
                            
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p className="product-description">
                                    {product.description?.substring(0, 100)}...
                                </p>
                                
                                <div className="product-details">
                                    <div className="detail-item">
                                        <DollarSign className="detail-icon" />
                                        <span>{formatPrice(product.price)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <ShoppingBag className="detail-icon" />
                                        <span>Stok: {product.stock}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Store className="detail-icon" />
                                        <span>Mağaza: {product.storeId || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="product-actions">
                                <button
                                    className="action-btn view"
                                    onClick={() => viewProductDetails(product)}
                                >
                                    <Eye />
                                    Detay
                                </button>
                                
                                {product.status === 'BEKLEMEDE' && (
                                    <>
                                        <button
                                            className="action-btn approve"
                                            onClick={() => updateProductStatus(product.id, 'AKTİF')}
                                        >
                                            <CheckCircle />
                                            Onayla
                                        </button>
                                        <button
                                            className="action-btn reject"
                                            onClick={() => updateProductStatus(product.id, 'PASİF')}
                                        >
                                            <XCircle />
                                            Reddet
                                        </button>
                                    </>
                                )}
                                
                                {product.status === 'AKTİF' && (
                                    <button
                                        className="action-btn deactivate"
                                        onClick={() => updateProductStatus(product.id, 'PASİF')}
                                    >
                                        <XCircle />
                                        Pasifleştir
                                    </button>
                                )}
                                
                                {product.status === 'PASİF' && (
                                    <button
                                        className="action-btn activate"
                                        onClick={() => updateProductStatus(product.id, 'AKTİF')}
                                    >
                                        <CheckCircle />
                                        Aktifleştir
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="no-products">
                        <Package className="no-products-icon" />
                        <h3>Ürün bulunamadı</h3>
                        <p>Arama kriterlerinize uygun ürün bulunmuyor.</p>
                    </div>
                )}
            </div>

            {/* Product Details Modal */}
            {showModal && selectedProduct && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Ürün Detayları</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <XCircle />
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="product-detail-image">
                                <img src={selectedProduct.imageUrl || '/images/default-product.jpg'} alt={selectedProduct.name} />
                            </div>
                            
                            <div className="product-detail-info">
                                <h3>{selectedProduct.name}</h3>
                                <p className="product-description">{selectedProduct.description}</p>
                                
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <label>Fiyat:</label>
                                        <span>{formatPrice(selectedProduct.price)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Stok:</label>
                                        <span>{selectedProduct.stock}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Durum:</label>
                                        {getStatusBadge(selectedProduct.status)}
                                    </div>
                                    <div className="detail-item">
                                        <label>Kategori ID:</label>
                                        <span>{selectedProduct.categoryId || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Mağaza ID:</label>
                                        <span>{selectedProduct.storeId || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>İndirim:</label>
                                        <span>{selectedProduct.discountPercentage ? `%${selectedProduct.discountPercentage}` : 'Yok'}</span>
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

export default AdminProducts;
