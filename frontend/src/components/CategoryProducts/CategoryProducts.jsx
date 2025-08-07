import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import { CartContext } from "../../context/CartContext";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';

const CategoryProducts = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = `http://localhost:8082/api/products?categoryId=${id}`;
    if (sort) url += `&sort=${sort}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    if (selectedStore) url += `&storeName=${encodeURIComponent(selectedStore)}`;
    Promise.all([
      fetch(`http://localhost:8082/api/categories/${id}`).then(res => res.json()),
      fetch(url).then(res => res.json())
    ])
      .then(([cat, prods]) => {
        setCategory(cat);
        setProducts(prods.content || []); // Page objesinin content alanı ürün dizisi
        setLoading(false);
      })
      .catch(() => {
        setError("Kategori veya ürünler alınamadı");
        setLoading(false);
      });
  }, [id, sort, minPrice, maxPrice, selectedStore]);

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
          <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
        <PageTitle title={category ? `${category.name} Ürünleri` : "Kategori Ürünleri"} />
        <MetaTags 
          title={category ? `${category.name} Ürünleri` : "Kategori Ürünleri"}
          description={category ? `${category.name} kategorisindeki en kaliteli ürünleri keşfedin. Geniş ürün yelpazesi ve uygun fiyatlar.` : "Kategori ürünleri"}
          keywords={category ? `${category.name}, ${category.name} ürünleri, kategori, alışveriş` : "kategori ürünleri, alışveriş"}
        />
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
          {category ? category.name : "Kategori"} Ürünleri
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryProducts;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Kategori Ürünleri: Belirli kategorideki ürünleri listeleme
 * 2. Filtreleme: Fiyat, mağaza ve sıralama filtreleri
 * 3. Ürün Grid: Responsive ürün grid sistemi
 * 4. Sepete Ekleme: Ürünleri sepete ekleme fonksiyonu
 * 5. Loading States: Yükleme durumları için skeleton animasyonları
 * 6. Error Handling: Hata durumlarının yönetimi
 * 7. SEO Optimizasyonu: Sayfa başlığı ve meta etiketleri
 * 8. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde kullanıcılar kategori bazında ürünleri keşfedebilir!
 */ 