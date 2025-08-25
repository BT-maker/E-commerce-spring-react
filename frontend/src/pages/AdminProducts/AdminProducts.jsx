import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Eye, CheckCircle, XCircle, ShoppingBag, Store, Clock } from 'lucide-react';
import './AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fiyat formatı
    const formatPrice = (price) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    // Ürünleri getir
    const fetchProducts = async () => {
        try {
            console.log('Ürünler getiriliyor...');
            const response = await fetch('http://localhost:8082/api/admin/products', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Gelen ürün verisi:', data);
                setProducts(data);
            } else {
                console.error('API yanıtı başarısız:', response.status);
            }
        } catch (error) {
            console.error('Ürünler yüklenirken hata:', error);
        } finally {
            setLoading(false);
        }
    };

    // İstatistikleri getir
    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/admin/products/stats', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Gelen istatistik verisi:', data);
                setStats(data);
            }
        } catch (error) {
            console.error('İstatistikler yüklenirken hata:', error);
        }
    };

    // Ürün durumunu güncelle
    const updateProductStatus = async (productId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8082/api/admin/products/${productId}/status?status=${newStatus}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                await fetchProducts();
                await fetchStats();
            }
        } catch (error) {
            console.error('Ürün durumu güncellenirken hata:', error);
        }
    };

    // Durum badge'i
    const getStatusBadge = (status) => {
        const statusMap = {
            'AKTİF': { text: 'Aktif', class: 'active' },
            'PASİF': { text: 'Pasif', class: 'inactive' },
            'BEKLEMEDE': { text: 'Beklemede', class: 'pending' }
        };
        const statusInfo = statusMap[status] || { text: 'Bilinmiyor', class: 'unknown' };
        return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
    };

    // Ürün detaylarını görüntüle
    const viewProductDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    // Filtrelenmiş ürünler
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="admin-products">
                <div className="loading">Ürünler yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="admin-products">
            {/* Header */}
            <div className="admin-products-header">
                <div className="header-content">
                    <div className="header-title">
                        <Package className="header-icon" />
                        <h1>Ürün Yönetimi</h1>
                    </div>
                    <p>Tüm ürünleri görüntüleyin ve yönetin</p>
                </div>
            </div>

            <div className="admin-products-content">
                {/* Filtreler */}
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

                {/* İstatistikler */}
                <div className="stats-cards">
                    <div className="stat-card">
                        <Package className="stat-icon" />
                        <div className="stat-content">
                            <h3>Toplam Ürün</h3>
                            <p>{stats.totalProducts || products.length}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <CheckCircle className="stat-icon active" />
                        <div className="stat-content">
                            <h3>Aktif Ürün</h3>
                            <p>{stats.activeProducts || products.filter(p => p.status === 'AKTİF').length}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <Clock className="stat-icon pending" />
                        <div className="stat-content">
                            <h3>Bekleyen</h3>
                            <p>{stats.pendingProducts || products.filter(p => p.status === 'BEKLEMEDE').length}</p>
                        </div>
                    </div>
                </div>

                {/* Ürün Tablosu */}
                <div className="products-table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Ürün</th>
                                <th>Kategori</th>
                                <th>Fiyat</th>
                                <th>Stok</th>
                                <th>Mağaza</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td className="product-cell">
                                        <img 
                                            src={product.imageUrl || '/img/default-product.jpg'} 
                                            alt={product.name} 
                                            className="product-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="image-placeholder" style={{display: 'none'}}>
                                            <span className="placeholder-icon">📷</span>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name">{product.name}</h4>
                                            <p className="product-description">{product.description}</p>
                                        </div>
                                    </td>
                                    <td className="category-cell">{product.category?.name || 'Kategorisiz'}</td>
                                    <td className="price-cell">
                                        {formatPrice(product.price)}
                                    </td>
                                    <td className="stock-cell">
                                        <span className={`stock-badge ${(product.stock || 0) < 10 ? 'low-stock' : 'normal-stock'}`}>
                                            {product.stock || 0}
                                        </span>
                                    </td>
                                    <td className="store-cell">
                                        <div className="store-info">
                                            <Store className="store-icon" />
                                            <span>{product.store?.name || product.storeName || 'Bilinmeyen Mağaza'}</span>
                                        </div>
                                    </td>
                                    <td className="status-cell">{getStatusBadge(product.status)}</td>
                                    <td className="actions-cell">
                                        <div className="admin-product-action-buttons">
                                            <button 
                                                className="admin-product-action-btn admin-product-view-btn"
                                                onClick={() => viewProductDetails(product)}
                                                title="Detayları Görüntüle"
                                            >
                                                <Eye size={20} />
                                            </button>
                                            {product.status === 'AKTİF' ? (
                                                <button 
                                                    className="admin-product-action-btn admin-product-deactivate-btn"
                                                    onClick={() => updateProductStatus(product.id, 'PASİF')}
                                                    title="Pasifleştir"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            ) : (
                                                <button 
                                                    className="admin-product-action-btn admin-product-activate-btn"
                                                    onClick={() => updateProductStatus(product.id, 'AKTİF')}
                                                    title="Aktifleştir"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                        <div className="no-products">
                            <div className="no-products-icon">📦</div>
                            <h3>Ürün Bulunamadı</h3>
                            <p>Arama kriterlerinize uygun ürün bulunamadı.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detay Modal */}
            {showModal && selectedProduct && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Ürün Detayları</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="product-detail-image">
                                <img 
                                    src={selectedProduct.imageUrl || '/img/default-product.jpg'} 
                                    alt={selectedProduct.name}
                                    onError={(e) => {
                                        e.target.src = '/img/default-product.jpg';
                                    }}
                                />
                            </div>
                            <div className="product-detail-info">
                                <h3>{selectedProduct.name}</h3>
                                <p>{selectedProduct.description}</p>
                                
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <label>Kategori:</label>
                                        <span>{selectedProduct.category?.name || 'Kategorisiz'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Fiyat:</label>
                                        <span>{formatPrice(selectedProduct.price)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Stok:</label>
                                        <span>{selectedProduct.stock || 0}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Durum:</label>
                                        <span>{getStatusBadge(selectedProduct.status)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Mağaza Adı:</label>
                                        <span>{selectedProduct.store?.name || selectedProduct.storeName || 'Bilinmeyen Mağaza'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Mağaza ID:</label>
                                        <span>{selectedProduct.store?.id || selectedProduct.storeId || 'Bilinmiyor'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Ürün ID:</label>
                                        <span>{selectedProduct.id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Oluşturulma Tarihi:</label>
                                        <span>{selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}</span>
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
