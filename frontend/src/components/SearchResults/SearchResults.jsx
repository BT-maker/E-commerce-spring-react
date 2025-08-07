import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import { CartContext } from "../../context/CartContext";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success("Ürün sepete eklendi!");
    } catch {
      toast.error("Ürün sepete eklenemedi!");
    }
  };

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    
    // Önce Elasticsearch'te arama yapmayı dene
    let url = `http://localhost:8082/api/products/search/elastic?keyword=${encodeURIComponent(query)}`;
    
    fetch(url)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          // Elasticsearch çalışmıyorsa normal SQL araması yap
          console.log('Elasticsearch çalışmıyor, normal arama yapılıyor...');
          url = `http://localhost:8082/api/products?search=${query}`;
    if (sort) url += `&sort=${sort}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    if (selectedStore) url += `&storeName=${encodeURIComponent(selectedStore)}`;
          
          return fetch(url).then(res => {
        if (!res.ok) {
          throw new Error("Arama sonuçları alınamadı");
        }
        return res.json();
          });
        }
      })
      .then(data => {
        // Eğer backend Page objesi döndürüyorsa, ürünler data.content içinde olur
        setProducts(data.content || data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [query, sort, minPrice, maxPrice, selectedStore]);

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

  const handleSortChange = (e) => setSort(e.target.value);
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);
  const handleStoreChange = (e) => setSelectedStore(e.target.value);

  if (loading) return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
      <div className="text-center mb-8">
        <Skeleton height={40} width={400} className="mx-auto mb-4" />
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
          <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <PageTitle title={`"${query}" için arama sonuçları`} />
        <MetaTags 
          title={`"${query}" için arama sonuçları`}
          description={`"${query}" araması için bulunan ürünler. En uygun fiyatlar ve kaliteli ürünler.`}
          keywords={`${query}, arama sonuçları, ürün arama, e-ticaret arama`}
        />
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
          "{query}" için arama sonuçları
        </h2>
        {/* Filtre barı */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
        <select value={sort} onChange={handleSortChange} className="border px-3 py-2 rounded">
          <option value="">Varsayılan Sıralama</option>
          <option value="price,asc">Fiyat: Artan</option>
          <option value="price,desc">Fiyat: Azalan</option>

          <option value="popular">Popüler</option>
        </select>
        <input
          type="number"
          placeholder="Min Fiyat"
          value={minPrice}
          onChange={handleMinPriceChange}
          className="border px-3 py-2 rounded w-32"
        />
        <input
          type="number"
          placeholder="Max Fiyat"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="border px-3 py-2 rounded w-32"
        />
        <select 
          value={selectedStore} 
          onChange={handleStoreChange} 
          className="border px-3 py-2 rounded min-w-[150px]"
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
      {Array.isArray(products) && products.length === 0 ? (
        <div className="text-center text-gray-400 py-8">Arama sonucu bulunamadı.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {Array.isArray(products) && products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResults;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Arama Sonuçları: Kullanıcı aramasına göre ürün listeleme
 * 2. URL Parametreleri: URL'den arama terimini alma
 * 3. Filtreleme: Fiyat, mağaza ve sıralama filtreleri
 * 4. Ürün Grid: Arama sonuçlarını grid formatında gösterme
 * 5. Sepete Ekleme: Ürünleri sepete ekleme fonksiyonu
 * 6. Loading States: Yükleme durumları için skeleton animasyonları
 * 7. SEO Optimizasyonu: Sayfa başlığı ve meta etiketleri
 * 8. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde kullanıcılar arama sonuçlarını kolayca görüntüleyebilir!
 */ 