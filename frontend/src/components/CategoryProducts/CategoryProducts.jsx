import React, { useEffect, useState, useContext, useCallback, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import toast from 'react-hot-toast';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';
import FilterPanel from './FilterPanel';
import ProductListSection from './ProductListSection';


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
    
    if (elasticsearchAvailable && (debouncedSearchQuery.trim() || debouncedMinPrice || debouncedMaxPrice || selectedStore)) {
      // Elasticsearch araması
      const params = new URLSearchParams();
      if (debouncedSearchQuery.trim()) params.append('query', debouncedSearchQuery.trim());
      params.append('category', category?.name || '');
      if (debouncedMinPrice && debouncedMinPrice.trim() !== '') params.append('minPrice', debouncedMinPrice);
      if (debouncedMaxPrice && debouncedMaxPrice.trim() !== '') params.append('maxPrice', debouncedMaxPrice);
      if (selectedStore) params.append('storeName', selectedStore);
      params.append('page', page);
      params.append('size', PAGE_SIZE);
      
      url = `http://localhost:8082/api/elasticsearch/advanced-search?${params.toString()}`;
    } else {
      // Normal arama
      url = `http://localhost:8082/api/products?categoryId=${id}&page=${page}&size=${PAGE_SIZE}`;
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
  }, [id, page, sort, debouncedMinPrice, debouncedMaxPrice, selectedStore, debouncedSearchQuery, elasticsearchAvailable, category]);

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

  const handleMinPriceChange = useCallback((e) => {
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
  }, []);

  const handleMaxPriceChange = useCallback((e) => {
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
  }, []);

  const handleStoreChange = useCallback((e) => {
    setSelectedStore(e.target.value);
    setPage(0);
  }, []);

  const handleSearchChange = useCallback((e) => {
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
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
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
  }, []);

  const handleAddToCart = useCallback(async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success("Ürün sepete eklendi!");
    } catch {
      toast.error("Ürün sepete eklenemedi!");
    }
  }, [addToCart]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  return (
    <section className="category-products-container max-w-full mx-auto px-4 mt-16">
      <PageTitle title={category ? `${category.name} Ürünleri` : "Kategori Ürünleri"} />
      <MetaTags 
        title={category ? `${category.name} Ürünleri` : "Kategori Ürünleri"}
        description={category ? `${category.name} kategorisindeki en kaliteli ürünleri keşfedin. Geniş ürün yelpazesi ve uygun fiyatlar.` : "Kategori ürünleri"}
        keywords={category ? `${category.name}, ${category.name} ürünleri, kategori, alışveriş` : "kategori ürünleri, alışveriş"}
      />
      
      <div className="flex flex-col lg:flex-row gap-4 justify-start items-start">
        {/* Sol Filtreleme Paneli */}
        <FilterPanel
          searchQuery={searchQuery}
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedStore={selectedStore}
          sort={sort}
          stores={stores}
          storesLoading={storesLoading}
          showFilters={showFilters}
          onSearchChange={handleSearchChange}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          onStoreChange={handleStoreChange}
          onSortChange={handleSortChange}
          onToggleFilters={handleToggleFilters}
          onClearFilters={clearFilters}
        />

        {/* Sağ Ürün Listesi */}
        <ProductListSection
          category={category}
          products={products}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          onAddToCart={handleAddToCart}
          onPageChange={handlePageChange}
          onClearFilters={clearFilters}
        />
      </div>
    </section>
  );
};

export default CategoryProducts; 