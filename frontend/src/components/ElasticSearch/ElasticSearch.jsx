import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import ProductCard from '../ProductCard/ProductCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './ElasticSearch.css';

const ElasticSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    storeName: ''
  });
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);

  // Kategorileri ve mağazaları getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, storeRes] = await Promise.all([
          fetch('http://localhost:8080/api/categories'),
          fetch('http://localhost:8080/api/stores')
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

  const performSearch = async (searchQuery = query, searchFilters = filters) => {
    if (!searchQuery.trim() && !Object.values(searchFilters).some(v => v)) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      let url = 'http://localhost:8080/api/elasticsearch/advanced-search?';
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.append('query', searchQuery.trim());
      }

      if (searchFilters.category) {
        params.append('category', searchFilters.category);
      }

      if (searchFilters.minPrice) {
        params.append('minPrice', searchFilters.minPrice);
      }

      if (searchFilters.maxPrice) {
        params.append('maxPrice', searchFilters.maxPrice);
      }

      if (searchFilters.storeName) {
        params.append('storeName', searchFilters.storeName);
      }

      url += params.toString();

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
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
    performSearch();
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    performSearch(query, newFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      storeName: ''
    });
    performSearch(query, {
      category: '',
      minPrice: '',
      maxPrice: '',
      storeName: ''
    });
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

      {/* Arama Formu */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün adı, açıklama veya kategori ara..."
            className="search-input"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
          >
            <Filter size={20} />
            Filtreler
          </button>
          <button type="submit" className="search-button">
            Ara
          </button>
        </div>

        {/* Filtreler */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Kategori</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Mağaza</label>
                <select
                  value={filters.storeName}
                  onChange={(e) => handleFilterChange('storeName', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Tüm Mağazalar</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Min Fiyat</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="0"
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Max Fiyat</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="∞"
                  className="filter-input"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="clear-filters-btn"
              >
                <X size={16} />
                Filtreleri Temizle
              </button>
            )}
          </div>
        )}
      </form>

      {/* Sonuçlar */}
      <div className="search-results">
        {loading ? (
          <div className="results-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="result-item">
                <Skeleton height={200} />
                <Skeleton height={20} width="80%" />
                <Skeleton height={16} width="60%" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="results-header">
              <h3>{results.length} sonuç bulundu</h3>
            </div>
            <div className="results-grid">
              {results.map((product) => (
                <div key={product.id} className="result-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        ) : query || hasActiveFilters ? (
          <div className="no-results">
            <p>Aramanızla eşleşen ürün bulunamadı.</p>
            <p>Farklı anahtar kelimeler deneyin veya filtreleri değiştirin.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ElasticSearch; 