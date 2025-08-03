import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaEyeSlash, FaPencilAlt, FaTimes, FaEyeDropper, FaPencilRuler, FaTrashAlt, FaBox, FaEye as FaEyeIcon, FaExclamationTriangle } from 'react-icons/fa';
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import './SellerProducts.css?v=1.0.2'; // Force cache refresh
const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  // Gerçek ürünleri API'den çek
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Geçici olarak tüm ürünleri getir (test için)
      const response = await fetch('http://localhost:8080/api/products', {
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
      console.log('Çekilen ürünler:', data);
      
      // Page formatından content'i al
      const products = data.content || data;
      setProducts(products);
    } catch (err) {
      console.error('Ürünler çekilirken hata:', err);
      setError('Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Kategorileri API'den çek
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories', {
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
        const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          // Başarılı silme sonrası ürünleri yeniden çek
          await fetchProducts();
        } else {
          const errorData = await response.json();
          alert(`Ürün silinemedi: ${errorData.message || 'Bilinmeyen hata'}`);
        }
      } catch (err) {
        console.error('Ürün silinirken hata:', err);
        alert('Ürün silinirken bir hata oluştu.');
      }
    }
  };

  // Component mount olduğunda verileri çek
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filtreleme
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { text: 'Aktif', class: 'status-active' },
      INACTIVE: { text: 'Pasif', class: 'status-inactive' },
      DRAFT: { text: 'Taslak', class: 'status-draft' }
    };
    const config = statusConfig[status] || statusConfig.ACTIVE;
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
          onClick={fetchProducts}
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
        <div className="header-left">
          <h1>Ürünlerim</h1>
          <p>Mağazanızdaki ürünleri yönetin ve takip edin</p>
        </div>
        <button 
          className="add-product-btn"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      {/* Filters */}
      <div className="products-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-box">
          <FaFilter className="filter-icon" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="products-stats">
        <div className="stat-item">
          <div className="stat-icon">
            <FaBox />
          </div>
          <span className="stat-number">{products.length}</span>
          <span className="stat-label">Toplam Ürün</span>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <FaEyeIcon />
          </div>
          <span className="stat-number">{filteredProducts.length}</span>
          <span className="stat-label">Gösterilen</span>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <FaExclamationTriangle />
          </div>
          <span className="stat-number">
            {products.filter(p => p.stock < 10).length}
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
                    title="Görüntüle"
                    onClick={() => console.log('Görüntüle:', product.name)}
                  >
                    <FaEye />
                    <span className="btn-text"></span>
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(product)}
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
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus />
              <span>İlk Ürününüzü Ekleyin</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Yeni Ürün Ekle</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>Ürün ekleme formu yakında eklenecek...</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Ürün Düzenle</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>"{selectedProduct.name}" ürününü düzenleme formu yakında eklenecek...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts; 