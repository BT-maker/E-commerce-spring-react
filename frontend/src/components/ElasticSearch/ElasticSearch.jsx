import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import ProductCard from '../ProductCard/ProductCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './ElasticSearch.css';

const PAGE_SIZE = 12;

const ElasticSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    storeName: ''
  });
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [elasticsearchAvailable, setElasticsearchAvailable] = useState(false);

  // Elasticsearch durumunu kontrol et
  useEffect(() => {
    fetch("http://localhost:8082/api/elasticsearch/status")
      .then((res) => res.json())
      .then((isAvailable) => {
        setElasticsearchAvailable(isAvailable);
      })
      .catch((err) => {
        console.error("Elasticsearch durum kontrolü hatası:", err);
        setElasticsearchAvailable(false);
      });
  }, []);

  // Kategorileri ve mağazaları getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, storeRes] = await Promise.all([
          fetch('http://localhost:8082/api/categories'),
          fetch('http://localhost:8082/api/stores')
        ]);
        
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
        
        if (storeRes.ok) {
          const storeData = await storeRes.json();
          setStores(storeData);
        }
      } catch (err) {
        console.error('Veri yüklenirken hata:', err);
      }
    };
    
    fetchData();
  }, []);

  const performSearch = async (searchQuery = query, searchFilters = filters, currentPage = page) => {
    if (!searchQuery.trim() && !Object.values(searchFilters).some(v => v)) {
      setResults([]);
      setTotalPages(1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      let url = 'http://localhost:8082/api/elasticsearch/advanced-search?';
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.append('query', searchQuery.trim());
      }

      if (searchFilters.category) {
        params.append('category', searchFilters.category);
      }

      if (searchFilters.minPrice && searchFilters.minPrice.trim() !== '') {
        params.append('minPrice', searchFilters.minPrice);
      }

      if (searchFilters.maxPrice && searchFilters.maxPrice.trim() !== '') {
        params.append('maxPrice', searchFilters.maxPrice);
      }

      if (searchFilters.storeName) {
        params.append('storeName', searchFilters.storeName);
      }

      params.append('page', currentPage);
      params.append('size', PAGE_SIZE);

      url += params.toString();

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        
        // Elasticsearch sonuçları artık Map formatında dönüyor
        if (data.content) {
          setResults(data.content);
          setTotalPages(data.totalPages || 1);
        } else if (Array.isArray(data)) {
          // Eski format için fallback
          setResults(data);
          setTotalPages(1);
        } else {
          setResults(data);
          setTotalPages(1);
        }
      } else {
        throw new Error('Arama yapılamadı');
      }
    } catch (err) {
      setError('Arama sırasında bir hata oluştu');
      console.error('Arama hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    performSearch(query, filters, 0);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(0);
    performSearch(query, newFilters, 0);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      storeName: ''
    };
    setFilters(clearedFilters);
    setPage(0);
    performSearch(query, clearedFilters, 0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    performSearch(query, filters, newPage);
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <div className="elastic-search-container">
      <div className="search-header">
        <h2 className="search-title">Gelişmiş Arama</h2>
        <p className="search-subtitle">
          Elasticsearch ile hızlı ve akıllı ürün arama
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sol Filtreleme Paneli */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Filtreler</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden text-gray-500 hover:text-gray-700 flex items-center gap-2"
              >
                <span>{showFilters ? 'Gizle' : 'Göster'}</span>
                <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
              {/* Arama Kutusu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Ara
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ürün adı, açıklama..."
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Kategori Filtresi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fiyat Aralığı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat Aralığı
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Fiyat"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max Fiyat"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mağaza Filtresi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mağaza
                </label>
                <select
                  value={filters.storeName}
                  onChange={(e) => handleFilterChange('storeName', e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Tüm Mağazalar</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtreleri Temizle */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              )}

              {/* Elasticsearch Durumu */}
              {elasticsearchAvailable && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">🔍</span>
                    <span className="text-sm text-green-800">Elasticsearch Aktif</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sağ Arama ve Sonuçlar */}
        <div className="lg:w-3/4">
          {/* Arama Formu */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ürün adı, açıklama veya kategori ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Ara
              </button>
            </div>
          </form>

          {/* Sonuçlar */}
          <div className="search-results">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7 py-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="p-4">
                    <Skeleton height={160} className="mb-4 rounded-lg" />
                    <Skeleton height={24} width={120} className="mb-2" />
                    <Skeleton height={20} width={80} />
                    <Skeleton height={36} className="mt-4 rounded" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">
                <p>{error}</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">{results.length} sonuç bulundu</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7 py-8">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {/* Sayfalama */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    {/* Önceki sayfa */}
                    {page > 0 && (
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                      >
                        Önceki
                      </button>
                    )}
                    
                    {/* Sayfa numaraları */}
                    {Array.from({ length: totalPages }, (_, i) => {
                      if (i === 0 || i === totalPages - 1 || (i >= page - 1 && i <= page + 1)) {
                        return (
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`px-3 py-2 rounded ${
                              page === i
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      } else if (i === page - 2 || i === page + 2) {
                        return <span key={i} className="px-2 py-2">...</span>;
                      }
                      return null;
                    })}
                    
                    {/* Sonraki sayfa */}
                    {page < totalPages - 1 && (
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                      >
                        Sonraki
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : query || hasActiveFilters ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">Aramanızla eşleşen ürün bulunamadı.</p>
                <p className="text-gray-400">Farklı anahtar kelimeler deneyin veya filtreleri değiştirin.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElasticSearch; 