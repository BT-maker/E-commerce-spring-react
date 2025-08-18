import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import { CartContext } from "../../context/CartContext";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';
import './CategoryProducts.css';

const PAGE_SIZE = 12;

const CategoryProducts = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [elasticsearchAvailable, setElasticsearchAvailable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  // Kategori bilgisini getir
  useEffect(() => {
    fetch(`http://localhost:8082/api/categories/${id}`)
      .then(res => res.json())
      .then(cat => {
        setCategory(cat);
      })
      .catch(err => {
        console.error("Kategori yükleme hatası:", err);
      });
  }, [id]);

  // Ürünleri getir
  useEffect(() => {
    setLoading(true);
    let url = "";
    
    if (elasticsearchAvailable && (searchQuery.trim() || minPrice || maxPrice || selectedStore)) {
      // Elasticsearch araması
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('query', searchQuery.trim());
      params.append('category', category?.name || '');
      if (minPrice && minPrice.trim() !== '') params.append('minPrice', minPrice);
      if (maxPrice && maxPrice.trim() !== '') params.append('maxPrice', maxPrice);
      if (selectedStore) params.append('storeName', selectedStore);
      params.append('page', page);
      params.append('size', PAGE_SIZE);
      
      url = `http://localhost:8082/api/elasticsearch/advanced-search?${params.toString()}`;
    } else {
      // Normal arama
      url = `http://localhost:8082/api/products?categoryId=${id}&page=${page}&size=${PAGE_SIZE}`;
      if (sort) url += `&sort=${sort}`;
      if (minPrice && minPrice.trim() !== '') url += `&minPrice=${minPrice}`;
      if (maxPrice && maxPrice.trim() !== '') url += `&maxPrice=${maxPrice}`;
      if (selectedStore) url += `&storeName=${encodeURIComponent(selectedStore)}`;
      if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          // Elasticsearch hatası durumunda normal API'ye fallback yap
          if (elasticsearchAvailable && res.status === 500) {
            console.warn('Elasticsearch hatası, normal API\'ye geçiliyor...');
            setElasticsearchAvailable(false);
            
            // Normal API URL'si oluştur
            let fallbackUrl = `http://localhost:8082/api/products?categoryId=${id}&page=${page}&size=${PAGE_SIZE}`;
            if (sort) fallbackUrl += `&sort=${sort}`;
            if (minPrice && minPrice.trim() !== '') fallbackUrl += `&minPrice=${minPrice}`;
            if (maxPrice && maxPrice.trim() !== '') fallbackUrl += `&maxPrice=${maxPrice}`;
            if (selectedStore) fallbackUrl += `&storeName=${encodeURIComponent(selectedStore)}`;
            if (searchQuery.trim()) fallbackUrl += `&search=${encodeURIComponent(searchQuery.trim())}`;
            
            return fetch(fallbackUrl);
          }
          throw new Error("Ürünler alınamadı");
        }
        return res.json();
      })
      .then((data) => {
        // Elasticsearch sonuçları artık Map formatında dönüyor
        if (elasticsearchAvailable && data.content) {
          setProducts(data.content);
          setTotalPages(data.totalPages || 1);
        } else if (elasticsearchAvailable && Array.isArray(data)) {
          // Eski format için fallback
          setProducts(data);
          setTotalPages(1);
        } else {
          // Normal API response
          setProducts(data.content || data);
          setTotalPages(data.totalPages || 1);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ürün yükleme hatası:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id, page, sort, minPrice, maxPrice, selectedStore, searchQuery, elasticsearchAvailable, category]);

  // Mağazaları getir
  useEffect(() => {
    setStoresLoading(true);
    fetch("http://localhost:8082/api/products/stores")
      .then((res) => {
        if (!res.ok) throw new Error("Mağazalar alınamadı");
        return res.json();
      })
      .then((data) => {
        setStores(data);
        setStoresLoading(false);
      })
      .catch((err) => {
        console.error("Mağaza yükleme hatası:", err);
        setStoresLoading(false);
      });
  }, []);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(0);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    setPage(0);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    setPage(0);
  };

  const handleStoreChange = (e) => {
    setSelectedStore(e.target.value);
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedStore("");
    setSort("");
    setPage(0);
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success("Ürün sepete eklendi!");
    } catch {
      toast.error("Ürün sepete eklenemedi!");
    }
  };

  if (loading) return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
      <div className="text-center mb-8">
        <Skeleton height={40} width={300} className="mx-auto mb-4" />
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-center mb-8">
        <Skeleton height={40} width={200} />
        <Skeleton height={40} width={150} />
        <Skeleton height={40} width={150} />
        <Skeleton height={40} width={150} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="product-card">
            <Skeleton height={200} className="mb-2" />
            <Skeleton height={20} width={150} className="mb-2" />
            <Skeleton height={16} width={80} className="mb-2" />
            <Skeleton height={40} width={120} />
          </div>
        ))}
      </div>
    </section>
  );

  if (error) return <div className="cart-empty" style={{ color: "#d32f2f" }}>{error}</div>;

  return (
    <section className="category-products-container max-w-7xl mx-auto px-2 sm:px-4 md:px-8 mt-16">
      <PageTitle title={category ? `${category.name} Ürünleri` : "Kategori Ürünleri"} />
      <MetaTags 
        title={category ? `${category.name} Ürünleri` : "Kategori Ürünleri"}
        description={category ? `${category.name} kategorisindeki en kaliteli ürünleri keşfedin. Geniş ürün yelpazesi ve uygun fiyatlar.` : "Kategori ürünleri"}
        keywords={category ? `${category.name}, ${category.name} ürünleri, kategori, alışveriş` : "kategori ürünleri, alışveriş"}
      />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sol Filtreleme Paneli */}
        <div className="lg:w-1/4">
          <div className="filter-panel bg-white rounded-lg shadow-sm p-6">
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
                  placeholder="Ürün adı, açıklama..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
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
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max Fiyat"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
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
                  value={selectedStore}
                  onChange={handleStoreChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={storesLoading}
                >
                  <option value="">Tüm Mağazalar</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.name}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sıralama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Varsayılan</option>
                  <option value="price,asc">Fiyat: Artan</option>
                  <option value="price,desc">Fiyat: Azalan</option>
                  <option value="popular">Popüler</option>
                </select>
              </div>

              {/* Filtreleri Temizle */}
              <button
                onClick={clearFilters}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Ürün Listesi */}
        <div className="lg:w-3/4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
            {category ? category.name : "Kategori"} Ürünleri
          </h2>
          
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
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">Bu kategoride aradığınız kriterlere uygun ürün bulunamadı.</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7 py-8">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                  {/* Sayfalama */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8 space-x-2">
                      {/* Önceki sayfa */}
                      {page > 0 && (
                        <button
                          onClick={() => setPage(page - 1)}
                          className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                          Önceki
                        </button>
                      )}
                      
                      {/* Sayfa numaraları */}
                      {Array.from({ length: totalPages }, (_, i) => {
                        // Sadece mevcut sayfa ve etrafındaki 2 sayfayı göster
                        if (i === 0 || i === totalPages - 1 || (i >= page - 1 && i <= page + 1)) {
                          return (
                            <button
                              key={i}
                              onClick={() => setPage(i)}
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
                          onClick={() => setPage(page + 1)}
                          className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                          Sonraki
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryProducts; 