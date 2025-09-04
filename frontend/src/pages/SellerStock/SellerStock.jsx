import React, { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaSearch, 
  FaFilter,
  FaBox,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaEye
} from 'react-icons/fa';

const SellerStock = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockThreshold, setStockThreshold] = useState(10);
  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [categories, setCategories] = useState([]);

  // Component mount olduğunda tüm verileri çek
  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, []);

  // Filtreleme değişikliklerinde anlık filtreleme
  useEffect(() => {
    if (allProducts.length > 0) {
      filterProducts();
    }
  }, [searchTerm, selectedCategory, minStock, maxStock, stockThreshold, allProducts]);

  // Sayfa dışına tıklandığında önerileri kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-group')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = 'http://localhost:8082/api/seller/products?page=0&size=1000';
      
      const response = await fetch(url, {
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
      console.log('Tüm ürün verileri:', data);
      
      setAllProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (err) {
      console.error('Stok veri hatası:', err);
      setError('Stok verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Anlık filtreleme fonksiyonu
  const filterProducts = () => {
    let filtered = [...allProducts];

    // Stok eşiği ile filtreleme
    filtered = filtered.filter(product => product.stock <= stockThreshold);

    // Arama terimi ile filtreleme
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Kategori ile filtreleme
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category?.name?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Minimum stok ile filtreleme
    if (minStock) {
      filtered = filtered.filter(product => product.stock >= parseFloat(minStock));
    }

    // Maksimum stok ile filtreleme
    if (maxStock) {
      filtered = filtered.filter(product => product.stock <= parseFloat(maxStock));
    }

    // Arama terimine göre sıralama (eşleşenler üstte)
    if (searchTerm) {
      filtered.sort((a, b) => {
        const aName = a.name?.toLowerCase() || '';
        const bName = b.name?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();

        const aStartsWith = aName.startsWith(searchLower);
        const bStartsWith = bName.startsWith(searchLower);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        return aName.localeCompare(bName);
      });
    }

    setFilteredProducts(filtered);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Kategori veri hatası:', err);
    }
  };

  const handleEditStock = (product) => {
    setEditingProduct(product);
    setEditStock(product.stock.toString());
  };

  const handleSaveStock = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/seller/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...editingProduct,
          stock: parseInt(editStock)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Ürünleri yeniden çek
      await fetchAllProducts();
      setEditingProduct(null);
      setEditStock('');
    } catch (err) {
      console.error('Stok güncelleme hatası:', err);
      alert('Stok güncellenirken bir hata oluştu.');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditStock('');
  };

  const handleSearch = () => {
    filterProducts();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinStock('');
    setMaxStock('');
    setFilteredProducts(allProducts.filter(product => product.stock <= stockThreshold));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount || 0);
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return 'out-of-stock';
    if (stock <= 5) return 'critical';
    if (stock <= 10) return 'low';
    return 'normal';
  };

  const getStockStatusText = (stock) => {
    if (stock <= 0) return 'Stokta Yok';
    if (stock <= 5) return 'Kritik';
    if (stock <= 10) return 'Düşük';
    return 'Normal';
  };

  const getStockStatusColor = (stock) => {
    if (stock <= 0) return 'bg-red-100 text-red-800 border-red-200';
    if (stock <= 5) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (stock <= 10) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStats = () => {
    const totalProducts = allProducts.length;
    const outOfStock = allProducts.filter(p => p.stock <= 0).length;
    const critical = allProducts.filter(p => p.stock > 0 && p.stock <= 5).length;
    const low = allProducts.filter(p => p.stock > 5 && p.stock <= 10).length;
    
    return { totalProducts, outOfStock, critical, low };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Stok Verileri Yükleniyor...</h3>
          <p className="text-gray-600">Verileriniz hazırlanıyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Bir Hata Oluştu</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            onClick={fetchAllProducts}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Stok Yönetimi</h1>
          <p className="text-orange-100">Mağazanızdaki ürün stoklarını takip edin ve yönetin</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Toplam Ürün</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <FaBox className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Stokta Yok</p>
              <p className="text-2xl font-bold text-red-900">{stats.outOfStock}</p>
            </div>
            <div className="p-3 bg-red-500 rounded-lg">
              <FaExclamationTriangle className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Kritik Stok</p>
              <p className="text-2xl font-bold text-orange-900">{stats.critical}</p>
            </div>
            <div className="p-3 bg-orange-500 rounded-lg">
              <FaExclamationTriangle className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Düşük Stok</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.low}</p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <FaChartLine className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Threshold Control */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stok Eşiği Ayarları</h3>
            <p className="text-gray-600">Bu eşiğin altındaki stoklu ürünler gösterilir</p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Stok Eşiği:</label>
            <input
              type="number"
              min="0"
              value={stockThreshold}
              onChange={(e) => setStockThreshold(parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
            <span className="text-sm text-gray-600">adet</span>
          </div>
        </div>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün adı ara..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
            {/* Öneriler */}
            {showSuggestions && searchTerm && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {allProducts
                  .filter(product =>
                    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 5)
                  .map(product => (
                    <div
                      key={product.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                      onClick={() => {
                        setSearchTerm(product.name);
                        setShowSuggestions(false);
                      }}
                    >
                      <FaSearch className="text-gray-400 text-sm" />
                      <span className="text-gray-700">{product.name}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Kategori"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Min stok"
              min="0"
              value={minStock}
              onChange={(e) => {
                setMinStock(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Max stok"
              min="0"
              value={maxStock}
              onChange={(e) => {
                setMaxStock(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          <button 
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            onClick={handleSearch}
          >
            <FaSearch />
            <span>Ara</span>
          </button>

          <button 
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            onClick={handleClearFilters}
          >
            <FaTimes />
            <span>Temizle</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Düşük Stoklu Ürün Yok</h3>
            <p className="text-gray-600">Seçilen eşiğe göre düşük stoklu ürün bulunmuyor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.imageUrl1 || product.imageUrl || '/img/default-product.png'} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = '/img/default-product.png';
                          }}
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category?.name || 'Kategori yok'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct?.id === product.id ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          min="0"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{product.stock}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStockStatusColor(product.stock)}`}>
                        {getStockStatusText(product.stock)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingProduct?.id === product.id ? (
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                            onClick={handleSaveStock}
                            title="Kaydet"
                          >
                            <FaSave size={16} />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            onClick={handleCancelEdit}
                            title="İptal"
                          >
                            <FaTimes size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          onClick={() => handleEditStock(product)}
                          title="Stok Düzenle"
                        >
                          <FaEdit size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {filteredProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Özet Bilgiler</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredProducts.length}</div>
              <div className="text-sm text-gray-600">Toplam Ürün</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(filteredProducts.reduce((sum, p) => sum + p.stock, 0) / filteredProducts.length)}
              </div>
              <div className="text-sm text-gray-600">Ortalama Stok</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.min(...filteredProducts.map(p => p.stock))}
              </div>
              <div className="text-sm text-gray-600">En Düşük Stok</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerStock; 