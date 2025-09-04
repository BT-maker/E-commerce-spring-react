import React, { useEffect, useState, useContext, useCallback, useRef, useMemo } from "react";
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';
import FilterPanel from '../CategoryProducts/FilterPanel';
import ProductListSection from '../CategoryProducts/ProductListSection';


const PAGE_SIZE = 16;

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
  
  // Debounce için state'ler
  const [debouncedMinPrice, setDebouncedMinPrice] = useState("");
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  
  // Debounce timeout'ları için ref'ler
  const minPriceTimeoutRef = useRef(null);
  const maxPriceTimeoutRef = useRef(null);
  const searchTimeoutRef = useRef(null);

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
    
    if (elasticsearchAvailable && (debouncedSearchQuery.trim() || selectedCategory || debouncedMinPrice || debouncedMaxPrice || selectedStore)) {
      // Elasticsearch araması
      const params = new URLSearchParams();
      if (debouncedSearchQuery.trim()) params.append('query', debouncedSearchQuery.trim());
      if (selectedCategory) params.append('category', selectedCategory);
      if (debouncedMinPrice && debouncedMinPrice.trim() !== '') params.append('minPrice', debouncedMinPrice);
      if (debouncedMaxPrice && debouncedMaxPrice.trim() !== '') params.append('maxPrice', debouncedMaxPrice);
      if (selectedStore) params.append('storeName', selectedStore);
      params.append('page', page);
      params.append('size', PAGE_SIZE);
      
      url = `http://localhost:8082/api/elasticsearch/advanced-search?${params.toString()}`;
    } else {
      // Normal arama
      url = `http://localhost:8082/api/products?page=${page}&size=${PAGE_SIZE}&includeInactive=true`;
      if (sort) url += `&sort=${sort}`;
      if (debouncedMinPrice && debouncedMinPrice.trim() !== '') url += `&minPrice=${debouncedMinPrice}`;
      if (debouncedMaxPrice && debouncedMaxPrice.trim() !== '') url += `&maxPrice=${debouncedMaxPrice}`;
      if (selectedStore) url += `&storeName=${encodeURIComponent(selectedStore)}`;
      if (debouncedSearchQuery.trim()) url += `&search=${encodeURIComponent(debouncedSearchQuery.trim())}`;
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
        return res.text(); // Önce text olarak al
      })
      .then((text) => {
        try {
          // JSON parsing'i güvenli şekilde yap
          const data = JSON.parse(text);
          
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
        } catch (parseError) {
          console.error('JSON parsing hatası:', parseError);
          console.error('Raw response (ilk 500 karakter):', text.substring(0, 500));
          console.error('Raw response (son 500 karakter):', text.substring(Math.max(0, text.length - 500)));
          setError('Veri formatı hatası: ' + parseError.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Ürün yükleme hatası:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [page, sort, debouncedMinPrice, debouncedMaxPrice, selectedStore, debouncedSearchQuery, selectedCategory, elasticsearchAvailable]);

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

  // Component unmount olduğunda timeout'ları temizle
  useEffect(() => {
    return () => {
      if (minPriceTimeoutRef.current) clearTimeout(minPriceTimeoutRef.current);
      if (maxPriceTimeoutRef.current) clearTimeout(maxPriceTimeoutRef.current);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleSortChange = useCallback((e) => {
    setSort(e.target.value);
    setPage(0);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value);
    setPage(0);
  }, []);

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setMinPrice(value);
    
    // Önceki timeout'u temizle
    if (minPriceTimeoutRef.current) {
      clearTimeout(minPriceTimeoutRef.current);
    }
    
    // Yeni timeout ayarla (500ms sonra arama yap)
    minPriceTimeoutRef.current = setTimeout(() => {
      setDebouncedMinPrice(value);
      setPage(0);
    }, 500);
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setMaxPrice(value);
    
    // Önceki timeout'u temizle
    if (maxPriceTimeoutRef.current) {
      clearTimeout(maxPriceTimeoutRef.current);
    }
    
    // Yeni timeout ayarla (500ms sonra arama yap)
    maxPriceTimeoutRef.current = setTimeout(() => {
      setDebouncedMaxPrice(value);
      setPage(0);
    }, 500);
  };

  const handleStoreChange = (e) => {
    setSelectedStore(e.target.value);
    setPage(0);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Önceki timeout'u temizle
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Yeni timeout ayarla (300ms sonra arama yap)
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(value);
      setPage(0);
    }, 300);
  };



  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setDebouncedSearchQuery("");
    setDebouncedMinPrice("");
    setDebouncedMaxPrice("");
    setSelectedStore("");
    setSort("");
    setPage(0);
    
    // Timeout'ları temizle
    if (minPriceTimeoutRef.current) clearTimeout(minPriceTimeoutRef.current);
    if (maxPriceTimeoutRef.current) clearTimeout(maxPriceTimeoutRef.current);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
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
    <section className="product-list-container max-w-full mx-auto px-4 mt-16">
      <PageTitle title="Öne Çıkan Ürünler" />
      <MetaTags 
        title="Öne Çıkan Ürünler"
        description="En kaliteli ürünleri keşfedin. Binlerce ürün arasından size en uygun olanını bulun. Hızlı teslimat ve güvenli alışveriş garantisi."
        keywords="e-ticaret, online alışveriş, ürünler, kaliteli ürünler, güvenli alışveriş"
      />
      
      <div className="flex flex-col lg:flex-row gap-4 justify-center">
        {/* Sol Filtreleme Paneli */}
        <FilterPanel
          searchQuery={searchQuery}
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedStore={selectedStore}
          selectedCategory={selectedCategory}
          categories={categories}
          sort={sort}
          stores={stores}
          storesLoading={storesLoading}
          showFilters={showFilters}
          onSearchChange={handleSearchChange}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          onStoreChange={handleStoreChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={clearFilters}
        />

        {/* Sağ Ürün Listesi */}
        <ProductListSection
          category={null}
          products={products}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          onAddToCart={handleAddToCart}
          onPageChange={(newPage) => setPage(newPage)}
          onClearFilters={clearFilters}
        />
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
