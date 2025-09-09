import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Eye, CheckCircle, XCircle, ShoppingBag, Store, Clock, Edit, Trash2, AlertCircle } from 'lucide-react';
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name'); // name, price, stock, status
    const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({});

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
                setStats(data);
            }
        } catch (error) {
            console.error('İstatistikler yüklenirken hata:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, []);

    // Sıralama fonksiyonu
    const sortProducts = (products) => {
        return [...products].sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
                    break;
                case 'price':
                    aValue = parseFloat(a.price) || 0;
                    bValue = parseFloat(b.price) || 0;
                    break;
                case 'stock':
                    aValue = parseInt(a.stock) || 0;
                    bValue = parseInt(b.stock) || 0;
                    break;
                case 'status':
                    // Durum sıralaması: AKTİF > STOK_TAKİP > PASİF
                    const statusOrder = { 'AKTİF': 1, 'STOK_TAKİP': 2, 'PASİF': 3 };
                    aValue = statusOrder[a.status] || 4;
                    bValue = statusOrder[b.status] || 4;
                    break;
                default:
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
            }
            
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    };

    // Filtrelenmiş ve sıralanmış ürünler
    const filteredProducts = sortProducts(products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesStatus = true;
        if (statusFilter === 'all') {
            matchesStatus = true;
        } else if (statusFilter === 'STOK_TAKİP') {
            // Stok takip: Stok miktarı 10'dan düşük olan ürünler
            matchesStatus = (product.stock || 0) < 10;
        } else {
            matchesStatus = product.status === statusFilter;
        }
        
        return matchesSearch && matchesStatus;
    }));

    // Durum badge rengi
    const getStatusBadge = (status) => {
        switch (status) {
            case 'AKTİF':
                return 'bg-green-100 text-green-800';
            case 'PASİF':
                return 'bg-red-100 text-red-800';
            case 'STOK_TAKİP':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Durum ikonu
    const getStatusIcon = (status) => {
        switch (status) {
            case 'AKTİF':
                return <CheckCircle className="w-4 h-4" />;
            case 'PASİF':
                return <XCircle className="w-4 h-4" />;
            case 'STOK_TAKİP':
                return <Clock className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    // Ürün detay modalını aç
    const openProductModal = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    // Modal'ı kapat
    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    // Ürün silme işlemi
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
            return;
        }

        console.log('Deleting product with ID:', productId);
        console.log('Product ID type:', typeof productId);

        try {
            const response = await fetch(`http://localhost:8082/api/admin/products/${productId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Delete response status:', response.status);
            console.log('Delete response ok:', response.ok);

            if (response.ok) {
                const responseData = await response.json();
                console.log('Delete success response:', responseData);
                toast.success('Ürün başarıyla silindi!');
                fetchProducts(); // Ürün listesini yenile
            } else {
                const errorData = await response.json();
                console.error('Delete error response:', errorData);
                toast.error(`Ürün silinemedi: ${errorData.error || errorData.message || 'Bilinmeyen hata'}`);
            }
        } catch (error) {
            console.error('Ürün silme hatası:', error);
            toast.error('Ürün silinirken bir hata oluştu!');
        }
    };

    // Ürün düzenleme modalını aç
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setEditFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price || 0,
            stock: product.stock || 0
        });
        setShowEditModal(true);
    };

    // Düzenleme modalını kapat
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingProduct(null);
        setEditFormData({});
    };

    // Ürün güncelleme işlemi
    const handleUpdateProduct = async () => {
        try {
            // ProductRequest formatına uygun veri hazırla
            const productRequest = {
                name: editFormData.name,
                description: editFormData.description,
                price: editFormData.price,
                stock: editFormData.stock,
                categoryId: editingProduct.categoryId || editingProduct.category?.id || 'default-category', // Kategori ID'si zorunlu
                imageUrl1: editingProduct.imageUrl1 || null,
                imageUrl2: editingProduct.imageUrl2 || null,
                imageUrl3: editingProduct.imageUrl3 || null,
                imageUrl4: editingProduct.imageUrl4 || null,
                imageUrl5: editingProduct.imageUrl5 || null
            };

            console.log('Gönderilen veri:', productRequest);

            const response = await fetch(`http://localhost:8082/api/admin/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(productRequest)
            });

            if (response.ok) {
                toast.success('Ürün başarıyla güncellendi!');
                closeEditModal();
                fetchProducts(); // Ürün listesini yenile
            } else {
                const errorData = await response.json();
                console.error('API Hatası:', errorData);
                toast.error(`Ürün güncellenemedi: ${errorData.message || 'Bilinmeyen hata'}`);
            }
        } catch (error) {
            console.error('Ürün güncelleme hatası:', error);
            toast.error('Ürün güncellenirken bir hata oluştu!');
        }
    };

    // StatCard component
    const StatCard = ({ title, value, icon: Icon, change, changeType, iconColor }) => (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</p>
                    {change && (
                        <div className={`flex items-center text-sm ${
                            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                            <span className="font-medium">{change}</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}>
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
                    <p className="text-gray-600">Ürünler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <PageTitle title="Ürün Yönetimi" />
            <MetaTags 
                title="Ürün Yönetimi"
                description="Ürün ekleme, düzenleme ve yönetimi. Stok takibi ve ürün durumları."
                keywords="ürün yönetimi, stok takibi, ürün ekleme, ürün düzenleme"
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-sm rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Package className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
                                <p className="text-gray-600 mt-1">Ürün ekleme, düzenleme ve stok takibi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
                    <StatCard
                        title="Toplam Ürün"
                        value={stats.totalProducts || 0}
                        icon={Package}
                        change="+12%"
                        changeType="positive"
                        iconColor="bg-gradient-to-r from-blue-500 to-blue-600"
                    />
                    <StatCard
                        title="Aktif Ürün"
                        value={stats.activeProducts || 0}
                        icon={CheckCircle}
                        change="+8%"
                        changeType="positive"
                        iconColor="bg-gradient-to-r from-green-500 to-green-600"
                    />
                    <StatCard
                        title="Stokta Az"
                        value={stats.lowStockProducts || 0}
                        icon={AlertCircle}
                        change="-3%"
                        changeType="negative"
                        iconColor="bg-gradient-to-r from-orange-500 to-orange-600"
                    />
                    <StatCard
                        title="Toplam Stok"
                        value={stats.totalStock || 0}
                        icon={ShoppingBag}
                        change="+15%"
                        changeType="positive"
                        iconColor="bg-gradient-to-r from-purple-500 to-purple-600"
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
                                    placeholder="Ürün ara..."
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
                                    <option value="AKTİF">Aktif</option>
                                    <option value="PASİF">Pasif</option>
                                    <option value="STOK_TAKİP">Stok Takip</option>
                                </select>
                            </div>

                            {/* Sort Options */}
                            <div className="flex items-center space-x-4">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                                >
                                    <option value="name">İsme Göre</option>
                                    <option value="price">Fiyata Göre</option>
                                    <option value="stock">Stoka Göre</option>
                                    <option value="status">Duruma Göre</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                                    title={sortOrder === 'asc' ? 'Azalan Sıralama' : 'Artan Sıralama'}
                                >
                                    <span className="text-sm font-medium">
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </span>
                                    <span className="text-sm">
                                        {sortOrder === 'asc' ? 'Artan' : 'Azalan'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm mx-6 overflow-hidden">
                    {filteredProducts.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50 border-b border-gray-200/50">
                                        <tr>
                                            <th 
                                                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => {
                                                    if (sortBy === 'name') {
                                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                                    } else {
                                                        setSortBy('name');
                                                        setSortOrder('asc');
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Ürün</span>
                                                    {sortBy === 'name' && (
                                                        <span className="text-orange-500">
                                                            {sortOrder === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Kategori
                                            </th>
                                            <th 
                                                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => {
                                                    if (sortBy === 'price') {
                                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                                    } else {
                                                        setSortBy('price');
                                                        setSortOrder('asc');
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Fiyat</span>
                                                    {sortBy === 'price' && (
                                                        <span className="text-orange-500">
                                                            {sortOrder === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th 
                                                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => {
                                                    if (sortBy === 'stock') {
                                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                                    } else {
                                                        setSortBy('stock');
                                                        setSortOrder('asc');
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Stok</span>
                                                    {sortBy === 'stock' && (
                                                        <span className="text-orange-500">
                                                            {sortOrder === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th 
                                                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => {
                                                    if (sortBy === 'status') {
                                                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                                    } else {
                                                        setSortBy('status');
                                                        setSortOrder('asc');
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Durum</span>
                                                    {sortBy === 'status' && (
                                                        <span className="text-orange-500">
                                                            {sortOrder === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Mağaza
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                İşlemler
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200/50">
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                            {product.imageUrl1 ? (
                                                                <img
                                                                    src={product.imageUrl1}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="w-6 h-6 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-xs">
                                                                {product.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {product.categoryName || 'Kategori Yok'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {formatPrice(product.price)}
                                                    </div>
                                                    {product.isDiscountActive && (
                                                        <div className="text-xs text-red-600">
                                                            %{product.discountPercentage} İndirim
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {product.stock || 0}
                                                    </div>
                                                    {product.stock < 10 && (
                                                        <div className="text-xs text-red-600">Stok Az!</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                                                        {getStatusIcon(product.status)}
                                                        <span className="ml-1">{product.status}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Store className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {product.storeName || 'Mağaza Yok'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => openProductModal(product)}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                                                            title="Detayları Görüntüle"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditProduct(product)}
                                                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors duration-200"
                                                            title="Düzenle"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                                            title="Sil"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
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
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ürün Bulunamadı</h3>
                            <p className="text-gray-500">Arama kriterlerinize uygun ürün bulunamadı.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Detail Modal */}
            {showModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Ürün Detayları</h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <XCircle className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Product Image */}
                            <div className="flex justify-center">
                                <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                                    {selectedProduct.imageUrl1 ? (
                                        <img
                                            src={selectedProduct.imageUrl1}
                                            alt={selectedProduct.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Package className="w-16 h-16 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
                                    <p className="text-gray-900 font-semibold">{selectedProduct.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                                    <p className="text-gray-900">{selectedProduct.categoryName || 'Kategori Yok'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat</label>
                                    <p className="text-gray-900 font-semibold">{formatPrice(selectedProduct.price)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
                                    <p className="text-gray-900">{selectedProduct.stock || 0}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedProduct.status)}`}>
                                        {getStatusIcon(selectedProduct.status)}
                                        <span className="ml-1">{selectedProduct.status}</span>
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mağaza</label>
                                    <p className="text-gray-900">{selectedProduct.storeName || 'Mağaza Yok'}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                                    {selectedProduct.description || 'Açıklama yok'}
                                </p>
                            </div>

                            {selectedProduct.isDiscountActive && (
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-orange-800 mb-2">İndirim Bilgileri</h4>
                                    <p className="text-orange-700">
                                        %{selectedProduct.discountPercentage} indirim aktif
                                    </p>
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
                            <button 
                                onClick={() => handleEditProduct(selectedProduct)}
                                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-200"
                            >
                                Düzenle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Ürün Düzenleme Modal */}
            {showEditModal && editingProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Ürün Düzenle</h2>
                                <button
                                    onClick={closeEditModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    <XCircle className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
                                    <input
                                        type="text"
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Ürün adını girin"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editFormData.price}
                                        onChange={(e) => setEditFormData({...editFormData, price: parseFloat(e.target.value) || 0})}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
                                    <input
                                        type="number"
                                        value={editFormData.stock}
                                        onChange={(e) => setEditFormData({...editFormData, stock: parseInt(e.target.value) || 0})}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                                <textarea
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Ürün açıklamasını girin"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={closeEditModal}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleUpdateProduct}
                                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-200"
                            >
                                Güncelle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;