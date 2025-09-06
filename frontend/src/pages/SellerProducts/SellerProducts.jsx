import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaTimes, FaBox, FaExclamationTriangle, FaUserClock } from 'react-icons/fa';
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import { Plus, Package, Upload } from 'lucide-react';
import ProductModal from '../../components/ProductModal/ProductModal';
import ModernProductModal from '../../components/ProductModal/ModernProductModal';
import BulkProductModal from '../../components/ProductModal/BulkProductModal';
import EditProductModal from '../../components/ProductModal/EditProductModal';

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
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false); // Öneriler için
  const [sellerStatus, setSellerStatus] = useState(null); // Satıcı durumu
  
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

  // Satıcı durumunu kontrol et
  const checkSellerStatus = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        setSellerStatus(userData.sellerStatus);
        console.log('Satıcı durumu:', userData.sellerStatus);
      }
    } catch (err) {
      console.error('Satıcı durumu kontrol edilirken hata:', err);
    }
  };

  // Kategorileri getir
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
      console.error('Kategoriler yüklenirken hata:', err);
    }
  };

  // Elasticsearch ile arama yap
  const searchWithElasticsearch = async (query) => {
    try {
      const response = await fetch(`http://localhost:8082/api/products/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      console.error('Elasticsearch arama hatası:', err);
    }
    return [];
  };

  // Filtreleme fonksiyonu
  const filterProducts = () => {
    let filtered = [...allProducts];

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Kategori filtresi
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category?.id === parseInt(selectedCategory));
    }

    // Fiyat filtresi
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
    setTotalProducts(filtered.length);
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setCurrentPage(0);
  };

  // Arama işlemi
  const handleSearch = async () => {
    if (useElasticsearch && searchTerm) {
      const results = await searchWithElasticsearch(searchTerm);
      setFilteredProducts(results);
      setTotalProducts(results.length);
      setTotalPages(Math.ceil(results.length / pageSize));
      setCurrentPage(0);
    } else {
      filterProducts();
    }
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setFilteredProducts(allProducts);
    setTotalProducts(allProducts.length);
    setTotalPages(Math.ceil(allProducts.length / pageSize));
    setCurrentPage(0);
  };

  // Ürün sil
  const handleDelete = async (productId) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8082/api/seller/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        // Ürünü listelerden kaldır
        setAllProducts(prev => prev.filter(p => p.id !== productId));
        setFilteredProducts(prev => prev.filter(p => p.id !== productId));
        setTotalProducts(prev => prev - 1);
      } else {
        alert('Ürün silinirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Ürün silme hatası:', err);
      alert('Ürün silinirken bir hata oluştu.');
    }
  };

  // Yeni ürün ekleme modal'ını aç
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  // Toplu ürün ekleme modal'ını aç
  const handleBulkAddProduct = () => {
    setShowBulkModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleSaveEditProduct = async (productData) => {
    try {
      setModalLoading(true);
      
      const response = await fetch(`http://localhost:8082/api/seller/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...productData,
          category: categories.find(cat => cat.id === productData.categoryId)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ürün güncellenirken hata oluştu');
      }

      const updatedProduct = await response.json();
      
      // Ürün listesini güncelle
      setAllProducts(prev => 
        prev.map(p => p.id === editingProduct.id ? updatedProduct : p)
      );
      
      setShowEditModal(false);
      setEditingProduct(null);
      
      // Başarı mesajı
      alert('Ürün başarıyla güncellendi!');
      
    } catch (error) {
      console.error('Ürün güncelleme hatası:', error);
      alert('Ürün güncellenirken hata oluştu: ' + error.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Ürün kaydetme fonksiyonu
  const handleSaveProduct = async (productData) => {
    try {
      setModalLoading(true);
      
      const url = selectedProduct 
        ? `http://localhost:8082/api/seller/products/${selectedProduct.id}`
        : 'http://localhost:8082/api/seller/products';
      
      const method = selectedProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        // Başarılı kayıt
        setShowModal(false);
        setSelectedProduct(null);
        // Ürün listesini yenile
        await fetchAllProducts();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Ürün kaydedilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Ürün kaydetme hatası:', err);
      alert('Ürün kaydedilirken bir hata oluştu.');
    } finally {
      setModalLoading(false);
    }
  };

  // Toplu ürün kaydetme fonksiyonu
  const handleBulkSaveProducts = async (productsData) => {
    try {
      setModalLoading(true);
      
      const response = await fetch('http://localhost:8082/api/seller/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productsData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Toplu ürün ekleme sonucu:', result);
        
        // Modal'ı kapat
        setShowBulkModal(false);
        
        // Başarı mesajı göster
        alert(`Toplu ürün ekleme tamamlandı!\nBaşarılı: ${result.successful}\nBaşarısız: ${result.failed}`);
        
        // Ürün listesini yenile
        await fetchAllProducts();
      } else {
        const errorData = await response.json();
        console.error('Bulk API Error:', errorData);
        alert(errorData.error || 'Toplu ürün ekleme sırasında bir hata oluştu.');
      }
    } catch (err) {
      console.error('Toplu ürün ekleme hatası:', err);
      alert('Toplu ürün ekleme sırasında bir hata oluştu.');
    } finally {
      setModalLoading(false);
    }
  };

  // Ürün durumunu değiştir (Aktif/Pasif)
  const handleToggleProductStatus = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'AKTİF' || currentStatus === 'ACTIVE' ? 'PASİF' : 'AKTİF';
      
      const response = await fetch(`http://localhost:8082/api/seller/products/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Ürün durumu başarıyla güncellendi:', result);
        
        // Ürün listesini güncelle
        setAllProducts(prev => 
          prev.map(product => 
            product.id === productId 
              ? { ...product, status: newStatus }
              : product
          )
        );
        setFilteredProducts(prev => 
          prev.map(product => 
            product.id === productId 
              ? { ...product, status: newStatus }
              : product
          )
        );
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(errorData.error || 'Ürün durumu değiştirilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Ürün durumu değiştirme hatası:', err);
      alert('Ürün durumu değiştirilirken bir hata oluştu.');
    }
  };

  // Ürün detayını göster
  const handleViewProduct = async (productId) => {
    setModalLoading(true);
    setSelectedProduct(null);
    setShowModal(true);

    try {
      const response = await fetch(`http://localhost:8082/api/products/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const productData = await response.json();
        setSelectedProduct(productData);
      } else {
        alert('Ürün detayları yüklenirken bir hata oluştu.');
        setShowModal(false);
      }
    } catch (err) {
      console.error('Ürün detay hatası:', err);
      alert('Ürün detayları yüklenirken bir hata oluştu.');
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  // Sayfa değiştir
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Sayfalama için ürünleri böl
  const getPaginatedProducts = () => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  };

  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
    checkSellerStatus();
  }, []);

  useEffect(() => {
    if (!useElasticsearch) {
      filterProducts();
    }
  }, [searchTerm, selectedCategory, minPrice, maxPrice, allProducts]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <FaExclamationTriangle className="mx-auto text-red-500 text-4xl mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Hata</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Ürünlerim</h1>
              <p className="text-orange-100">Mağazanızdaki tüm ürünleri yönetin</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Package className="w-4 h-4 text-orange-200" />
                <span>Toplam {totalProducts} ürün</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkAddProduct}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 border border-white border-opacity-30"
                >
                  <Upload className="w-4 h-4" />
                  <span>Toplu Ekle</span>
                </button>
                <button
                  onClick={handleAddProduct}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 border border-white border-opacity-30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Ürün Ekle</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filtreler */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Arama */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Kategori */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Min Fiyat */}
            <input
              type="number"
              placeholder="Min Fiyat"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />

            {/* Max Fiyat */}
            <input
              type="number"
              placeholder="Max Fiyat"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Filtre Butonları */}
          <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSearch}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <FaSearch />
                <span>Ara</span>
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <FaTimes />
                <span>Temizle</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="elasticsearch"
                checked={useElasticsearch}
                onChange={(e) => setUseElasticsearch(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="elasticsearch" className="text-sm text-gray-700">
                Elasticsearch kullan
              </label>
            </div>
          </div>
        </div>

        {/* Ürün Listesi */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ürün</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kategori</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Fiyat</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Stok</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Durum</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getPaginatedProducts().map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img
                          src={product.imageUrl1 || product.imageUrl || '/img/default-product.png'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/img/default-product.png';
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 truncate max-w-xs">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description || 'Açıklama yok'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.category?.name || 'Kategorisiz'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-medium text-gray-900">
                      {Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </div>
                    {product.isDiscountActive && (
                      <div className="text-sm text-red-600">
                        %{product.discountPercentage} İndirim
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 10 ? 'bg-green-100 text-green-800' :
                      product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'AKTİF' ? 'bg-green-100 text-green-800' :
                      product.status === 'PASİF' ? 'bg-red-100 text-red-800' :
                      product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      product.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status === 'AKTİF' || product.status === 'ACTIVE' ? 'Aktif' :
                       product.status === 'PASİF' || product.status === 'INACTIVE' ? 'Pasif' : 
                       product.status || 'Bilinmiyor'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleToggleProductStatus(product.id, product.status)}
                        className={`p-2 rounded-lg transition-colors ${
                          product.status === 'AKTİF' || product.status === 'ACTIVE'
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                        title={product.status === 'AKTİF' || product.status === 'ACTIVE' ? 'Pasif Yap' : 'Aktif Yap'}
                      >
                        <MdVisibility size={18} />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-orange-600 hover:text-orange-700 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                        title="Düzenle"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Sil"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Toplam {totalProducts} ürün, sayfa {currentPage + 1} / {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Önceki
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === i
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sonraki
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Boş Durum */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-400 w-16 h-16 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {allProducts.length === 0 ? 'Henüz ürününüz yok' : 'Ürün Bulunamadı'}
            </h3>
            <p className="text-gray-500 mb-4">
              {allProducts.length === 0 
                ? 'İlk ürününüzü ekleyerek mağazanızı büyütmeye başlayın!' 
                : 'Arama kriterlerinize uygun ürün bulunamadı.'}
            </p>
            {allProducts.length === 0 && (
              <button
                onClick={handleAddProduct}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>İlk Ürününüzü Ekleyin</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modern Ürün Modal */}
      {showModal && (
        <ModernProductModal
          show={showModal}
          initial={selectedProduct}
          loading={modalLoading}
          categories={categories}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Toplu Ürün Modal */}
      {showBulkModal && (
        <BulkProductModal
          show={showBulkModal}
          loading={modalLoading}
          categories={categories}
          onClose={() => {
            setShowBulkModal(false);
          }}
          onSave={handleBulkSaveProducts}
        />
      )}

      {/* Ürün Düzenleme Modal */}
      {showEditModal && (
        <EditProductModal
          show={showEditModal}
          product={editingProduct}
          loading={modalLoading}
          categories={categories}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveEditProduct}
        />
      )}
    </div>
  );
};

export default SellerProducts; 