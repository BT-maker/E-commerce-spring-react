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
import './SellerStock.css';

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
    if (stock <= 0) return '#dc2626';
    if (stock <= 5) return '#ea580c';
    if (stock <= 10) return '#d97706';
    return '#059669';
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
      <div className="seller-stock">
        <div className="stock-loading">
          <div className="loading-spinner"></div>
          <h3>Stok Verileri Yükleniyor...</h3>
          <p>Verileriniz hazırlanıyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-stock">
        <div className="stock-error">
          <div className="error-icon">⚠️</div>
          <h3>Bir Hata Oluştu</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchAllProducts}>
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-stock">
      {/* Header */}
      <div className="stock-header">
        <div className="header-content">
          <h2>Stok Yönetimi</h2>
        </div>
      </div>

      {/* Arama ve Filtreleme */}
      <div className="search-filters">
        <div className="search-row">
          <div className="search-group">
            <input
              type="text"
              placeholder="Ürün adı ara..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
            />
            {/* Öneriler */}
            {showSuggestions && searchTerm && (
              <div className="search-suggestions">
                {allProducts
                  .filter(product =>
                    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(0, 5)
                  .map(product => (
                    <div
                      key={product.id}
                      className="suggestion-item"
                      onClick={() => {
                        setSearchTerm(product.name);
                        setShowSuggestions(false);
                      }}
                    >
                      <FaSearch className="suggestion-icon" />
                      <span>{product.name}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="search-group">
            <input
              type="text"
              placeholder="Kategori"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
            />
          </div>
          <div className="search-group">
            <input
              type="number"
              placeholder="Min stok"
              min="0"
              value={minStock}
              onChange={(e) => {
                setMinStock(e.target.value);
              }}
            />
          </div>
          <div className="search-group">
            <input
              type="number"
              placeholder="Max stok"
              min="0"
              value={maxStock}
              onChange={(e) => {
                setMaxStock(e.target.value);
              }}
            />
          </div>
          <button className="search-btn" onClick={handleSearch}>
            <FaSearch /> Ara
          </button>
          <button className="clear-btn" onClick={handleClearFilters}>
            <FaTimes /> Temizle
          </button>
        </div>
      </div>



      {/* Products Table */}
      <div className="stock-table-container">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <h3>Düşük Stoklu Ürün Yok</h3>
            <p>Seçilen eşiğe göre düşük stoklu ürün bulunmuyor.</p>
          </div>
        ) : (
          <div className="stock-table">
            <table>
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Kategori</th>
                  <th>Fiyat</th>
                  <th>Stok</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={`stock-row ${getStockStatus(product.stock)}`}>
                    <td className="product-cell">
                      <img 
                        src={product.imageUrl1 || product.imageUrl || '/img/default-product.png'} 
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = '/img/default-product.png';
                        }}
                      />
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>{product.description}</p>
                      </div>
                    </td>
                    <td className="category-cell">
                      {product.category?.name || 'Kategori yok'}
                    </td>
                    <td className="price-cell">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="stock-cell">
                      {editingProduct?.id === product.id ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          className="stock-input"
                          min="0"
                        />
                      ) : (
                        <span className="stock-number">{product.stock}</span>
                      )}
                    </td>
                    <td className="status-cell">
                      <span 
                        className="stock-status"
                        style={{ backgroundColor: getStockStatusColor(product.stock) }}
                      >
                        {getStockStatusText(product.stock)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {editingProduct?.id === product.id ? (
                        <div className="edit-actions">
                          <button 
                            className="action-btn save-btn" 
                            onClick={handleSaveStock}
                            title="Kaydet"
                          >
                            <FaSave />
                          </button>
                          <button 
                            className="action-btn cancel-btn" 
                            onClick={handleCancelEdit}
                            title="İptal"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="action-btn edit-btn" 
                          onClick={() => handleEditStock(product)}
                          title="Stok Düzenle"
                        >
                          <FaEdit />
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
        <div className="stock-summary">
          <div className="summary-item">
            <span className="summary-label">Toplam Ürün:</span>
            <span className="summary-value">{filteredProducts.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Ortalama Stok:</span>
            <span className="summary-value">
              {Math.round(filteredProducts.reduce((sum, p) => sum + p.stock, 0) / filteredProducts.length)}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">En Düşük Stok:</span>
            <span className="summary-value">
              {Math.min(...filteredProducts.map(p => p.stock))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerStock; 