import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../ProductCard/ProductCard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';
import './ProductList.css';

const PAGE_SIZE = 12;

const ProductList = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
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

  // Kategorileri getir
  useEffect(() => {
    fetch("http://localhost:8082/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error("Kategori yükleme hatası:", err);
      });
  }, []);

  // Ürünleri getir
  useEffect(() => {
    setLoading(true);
    let url = "";
    
    if (elasticsearchAvailable && (searchQuery.trim() || selectedCategory || minPrice || maxPrice || selectedStore)) {
      // Elasticsearch araması
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('query', searchQuery.trim());
      if (selectedCategory) params.append('category', selectedCategory);
      if (minPrice && minPrice.trim() !== '') params.append('minPrice', minPrice);
      if (maxPrice && maxPrice.trim() !== '') params.append('maxPrice', maxPrice);
      if (selectedStore) params.append('storeName', selectedStore);
      params.append('page', page);
      params.append('size', PAGE_SIZE);
      
      url = `http://localhost:8082/api/elasticsearch/advanced-search?${params.toString()}`;
    } else {
      // Normal arama
      url = `http://localhost:8082/api/products?page=${page}&size=${PAGE_SIZE}&includeInactive=true`;
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
            let fallbackUrl = `http://localhost:8082/api/products?page=${page}&size=${PAGE_SIZE}&includeInactive=true`;
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
        console.log('=== PRODUCT LIST DEBUG ===');
        console.log('Backend\'den gelen veri:', data);
        console.log('Toplam sayfa sayısı:', data.totalPages);
        console.log('Toplam ürün sayısı:', data.totalElements);
        console.log('Mevcut sayfa:', data.number);
        console.log('Sayfa boyutu:', data.size);
        console.log('Ürün sayısı:', data.content?.length || data.length);
        console.log('Elasticsearch aktif mi:', elasticsearchAvailable);
        console.log('=== DEBUG END ===');
        
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
  }, [page, sort, minPrice, maxPrice, selectedStore, searchQuery, selectedCategory, elasticsearchAvailable]);

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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(0);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedStore("");
    setSort("");
    setPage(0);
  };

  const handleAddToCart = async (productId) => {
    console.log("addToCart fonksiyonu:", addToCart);
    try {
      await addToCart(productId, 1);
      toast.success('Ürün sepete eklendi!');
    } catch (err) {
      console.error("Sepete ekle hatası:", err);
      toast.error('Ürün sepete eklenemedi!');
    }
  };

  return (
    <section className="product-list-container max-w-7xl mx-auto px-2 sm:px-4 md:px-8 mt-16">
      <PageTitle title="Öne Çıkan Ürünler" />
      <MetaTags 
        title="Öne Çıkan Ürünler"
        description="En kaliteli ürünleri keşfedin. Binlerce ürün arasından size en uygun olanını bulun. Hızlı teslimat ve güvenli alışveriş garantisi."
        keywords="e-ticaret, online alışveriş, ürünler, kaliteli ürünler, güvenli alışveriş"
      />
      
      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        {/* Sol Filtreleme Paneli */}
        <div className="lg:w-1/4">
          <div className="filter-panel bg-white rounded-lg shadow-md border border-gray-200 p-6">
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

              {/* Kategori Filtresi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
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
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">Öne Çıkan Ürünler</h2>
          
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
                  <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun ürün bulunamadı.</p>
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
                  {console.log('Sayfalama kontrolü - totalPages:', totalPages, 'products.length:', products.length)}
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

export default ProductList;
/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Ürün Listesi: Tüm ürünleri grid formatında listeleme
 * 2. Filtreleme: Fiyat, mağaza ve sıralama filtreleri
 * 3. Sayfalama: Büyük veri setleri için sayfalama sistemi
 * 4. Sepete Ekleme: Ürünleri sepete ekleme fonksiyonu
 * 5. Loading States: Yükleme durumları için skeleton animasyonları
 * 6. Error Handling: Hata durumlarının yönetimi
 * 7. SEO Optimizasyonu: Sayfa başlığı ve meta etiketleri
 * 8. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde kullanıcılar ürünleri kolayca keşfedebilir ve filtreleyebilir!
 */
