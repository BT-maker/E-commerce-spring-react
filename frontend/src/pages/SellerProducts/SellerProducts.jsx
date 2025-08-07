import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaTimes, FaBox, FaExclamationTriangle } from 'react-icons/fa';
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import ProductModal from '../../components/ProductModal/ProductModal';
import './SellerProducts.css?v=1.0.2'; // Force cache refresh

const SellerProducts = () => {
  const [allProducts, setAllProducts] = useState([]); // Tüm ürünler
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtrelenmiş ürünler
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [useElasticsearch, setUseElasticsearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false); // Öneriler için
  
  // Sayfalama state'leri
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize] = useState(10);

  // Tüm ürünleri API'den çek (sadece bir kez)
  const fetchAllProducts = async () => {
    try {
      console.log('=== FETCH ALL PRODUCTS DEBUG ===');
      setLoading(true);
      setError(null);
      
      const url = `http://localhost:8082/api/seller/products?page=0&size=1000`; // Tüm ürünleri al
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Tüm ürün verileri:', data);
      
      if (data && data.products) {
        console.log('Products array length:', data.products.length);
        console.log('First product status:', data.products[0]?.status);
        setAllProducts(data.products);
        setFilteredProducts(data.products);
        setTotalProducts(data.totalElements || data.products.length);
      } else {
        console.log('Data is array, length:', data.length);
        console.log('First product status:', data[0]?.status);
        setAllProducts(data);
        setFilteredProducts(data);
        setTotalProducts(data.length || 0);
      }
      
      console.log('=== END FETCH ALL PRODUCTS DEBUG ===');
    } catch (err) {
      console.error('Ürün veri hatası:', err);
      setError('Ürün verileri yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Kategorileri API'den çek
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
        console.log('Çekilen kategoriler:', data);
        setCategories(data);
      }
    } catch (err) {
      console.error('Kategoriler çekilirken hata:', err);
    }
  };

  // Ürün silme fonksiyonu
  const handleDelete = async (productId) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`http://localhost:8082/api/seller/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          // Ürünleri yeniden yükle
          await fetchAllProducts();
          alert('Ürün başarıyla silindi!');
        } else {
          alert('Ürün silinirken bir hata oluştu!');
        }
      } catch (error) {
        console.error('Ürün silme hatası:', error);
        alert('Ürün silinirken bir hata oluştu!');
      }
    }
  };

  // Ürün durumunu değiştirme fonksiyonu
  const handleToggleStatus = async (productId) => {
    try {
      console.log('=== TOGGLE STATUS DEBUG ===');
      console.log('Product ID to toggle:', productId);
      
      const response = await fetch(`http://localhost:8082/api/seller/products/${productId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const updatedProduct = await response.json();
        console.log('Updated product from backend:', updatedProduct);
        console.log('Updated product status:', updatedProduct.status);
        
        // Sadece o ürünün durumunu güncelle, tüm sayfayı yeniden yükleme
        setAllProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId 
              ? { ...product, status: updatedProduct.status }
              : product
          )
        );
        
        setFilteredProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId 
              ? { ...product, status: updatedProduct.status }
              : product
          )
        );
        
        const newStatus = updatedProduct.status === 'AKTİF' ? 'aktif' : 'pasif';
        console.log('New status for alert:', newStatus);
        alert(`Ürün durumu başarıyla ${newStatus} olarak değiştirildi!`);
        
        console.log('=== END TOGGLE STATUS DEBUG ===');
      } else {
        console.error('Response not ok');
        alert('Ürün durumu değiştirilirken bir hata oluştu!');
      }
    } catch (error) {
      console.error('Ürün durumu değiştirme hatası:', error);
      alert('Ürün durumu değiştirilirken bir hata oluştu!');
    }
  };

  // Ürün ekleme/düzenleme fonksiyonu
  const handleSaveProduct = async (formData) => {
    setModalLoading(true);
    try {
      console.log('=== SAVE PRODUCT DEBUG ===');
      console.log('Form data:', formData);
      console.log('Selected product:', selectedProduct);
      
      const url = selectedProduct 
        ? `http://localhost:8082/api/seller/products/${selectedProduct.id}`
        : 'http://localhost:8082/api/seller/products';
      
      const method = selectedProduct ? 'PUT' : 'POST';
      console.log('Request URL:', url);
      console.log('Request method:', method);
      
      const requestBody = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: { id: formData.categoryId }
      };
      
      console.log('Request body:', requestBody);
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const savedProduct = await response.json();
        console.log('Saved product:', savedProduct);
        console.log('=== END SAVE PRODUCT DEBUG ===');
        
        // Başarılı işlem sonrası modal'ı kapat ve ürünleri yeniden çek
        setShowModal(false);
        setSelectedProduct(null);
        await fetchAllProducts();
      } else {
        console.error('Response not ok, trying to get error details...');
        let errorData;
        try {
          errorData = await response.json();
          console.error('Error response (JSON):', errorData);
          console.error('Error details:', errorData.details);
          console.error('Error cause:', errorData.cause);
          alert(`Ürün kaydedilemedi: ${errorData.error || errorData.message || 'Bilinmeyen hata'}`);
        } catch (parseError) {
          console.error('Could not parse error response as JSON');
          const errorText = await response.text();
          console.error('Error response (text):', errorText);
          alert(`Ürün kaydedilemedi: ${errorText || 'Bilinmeyen hata'}`);
        }
      }
    } catch (err) {
      console.error('Ürün kaydedilirken hata:', err);
      alert('Ürün kaydedilirken bir hata oluştu.');
    } finally {
      setModalLoading(false);
    }
  };

  // Test endpoint'i
  const testAPI = async () => {
    try {
      console.log('Test API çağrısı yapılıyor...');
      const response = await fetch('http://localhost:8082/api/seller/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      console.log('Test response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Test API response:', data);
      } else {
        console.error('Test API error:', response.status);
        const errorText = await response.text();
        console.error('Test API error text:', errorText);
      }
    } catch (err) {
      console.error('Test API hatası:', err);
    }
  };



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
  }, [searchTerm, selectedCategory, minPrice, maxPrice, allProducts]);

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

  // Filtreleme şimdilik devre dışı - sayfalama ile uyumlu çalışması için backend'de implement edilmeli
  // const filteredProducts = products.filter(product => {
  //   const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
  //   return matchesSearch && matchesCategory;
  // });

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Sayfalama fonksiyonları
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Anlık filtreleme fonksiyonu
  const filterProducts = () => {
    let filtered = [...allProducts];
    
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
    
    // Fiyat aralığı ile filtreleme
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
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
    setTotalProducts(filtered.length);
  };

  const handleSearch = () => {
    setCurrentPage(0);
    filterProducts();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(0);
    setFilteredProducts(allProducts);
    setTotalProducts(allProducts.length);
  };

  const handleElasticsearchToggle = () => {
    setUseElasticsearch(!useElasticsearch);
    setCurrentPage(0);
    // Toggle sonrası otomatik arama yap
    setTimeout(() => fetchAllProducts(), 100);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusBadge = (status) => {
    console.log('getStatusBadge called with status:', status);
    const statusConfig = {
      'AKTİF': { text: 'Aktif', class: 'status-active' },
      'PASİF': { text: 'Pasif', class: 'status-inactive' },
      'ACTIVE': { text: 'Aktif', class: 'status-active' },
      'INACTIVE': { text: 'Pasif', class: 'status-inactive' },
      'DRAFT': { text: 'Taslak', class: 'status-draft' }
    };
    const config = statusConfig[status] || statusConfig['AKTİF'];
    console.log('Status config:', config);
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="seller-products-loading">
        <div className="loading-spinner"></div>
        <p>Ürünler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-products-error">
        <div className="error-icon">⚠️</div>
        <h3>Hata Oluştu</h3>
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={async () => {
            await testAPI();
            await fetchAllProducts();
          }}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="seller-products">
      {/* Header */}
      <div className="products-header">
        <div className="header-content">
          <div className="title-card">
            <h2>Ürünlerim</h2>
          </div>
        </div>
        <button className="add-product-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Yeni Ürün Ekle
        </button>
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
              placeholder="Min fiyat"
              min="0"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
              }}
            />
          </div>
          <div className="search-group">
            <input
              type="number"
              placeholder="Max fiyat"
              min="0"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
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

      {/* Stats */}
      <div className="products-stats">
        <div className="stat-item">
          <div className="stat-icon">
            <FaBox />
          </div>
          <span className="stat-number">{totalProducts}</span>
          <span className="stat-label">Toplam Ürün</span>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <FaEye />
          </div>
          <span className="stat-number">{filteredProducts.length}</span>
          <span className="stat-label">Gösterilen</span>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <span className="stat-number">
            {filteredProducts.filter(p => p.stock < 10).length}
          </span>
          <span className="stat-label">Düşük Stok</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
        <table className="products-table">
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
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td className="product-cell">
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/150x150?text=No+Image'} 
                    alt={product.name} 
                    className="product-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                    }}
                  />
                  <div className="product-info">
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-description">{product.description}</p>
                  </div>
                </td>
                <td>{product.category?.name || 'Kategorisiz'}</td>
                <td className="price-cell">₺{product.price?.toLocaleString() || '0'}</td>
                <td className="stock-cell">
                  <span className={`stock-badge ${(product.stock || 0) < 10 ? 'low-stock' : 'normal-stock'}`}>
                    {product.stock || 0}
                  </span>
                </td>
                <td>{getStatusBadge(product.status)}</td>
                <td className="actions-cell">
                  <button 
                    className="action-btn view-btn"
                    title="Durumu Değiştir"
                    onClick={() => handleToggleStatus(product.id)}
                  >
                    <FaEye />
                    <span className="btn-text"></span>
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEditProduct(product)}
                    title="Düzenle"
                  >
                    <FaEdit />
                    <span className="btn-text"></span>
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(product.id)}
                    title="Sil"
                  >
                    <FaTrash />
                    <span className="btn-text"></span>
                  </button>
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
            <button 
              className="add-product-btn"
              onClick={handleAddProduct}
            >
              <FaPlus />
              <span>İlk Ürününüzü Ekleyin</span>
            </button>
          </div>
        )}
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>Toplam {totalProducts} ürün, {totalPages} sayfa</span>
            <span>Sayfa {currentPage + 1} / {totalPages}</span>
          </div>
        <div className="pagination-controls">
          <button 
            className="pagination-btn"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            Önceki
          </button>
          
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`pagination-btn ${currentPage === index ? 'active' : ''}`}
              onClick={() => handlePageChange(index)}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            Sonraki
          </button>
        </div>
      </div>
      )}

      {/* Product Modal */}
      <ProductModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        categories={categories}
        initial={selectedProduct}
        loading={modalLoading}
      />
    </div>
  );
};

export default SellerProducts; 