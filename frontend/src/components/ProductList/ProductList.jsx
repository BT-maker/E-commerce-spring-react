import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../ProductCard/ProductCard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CartContext } from '../../context/CartContext';
import toast from 'react-hot-toast';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';

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

  useEffect(() => {
    setLoading(true);
    let url = `http://localhost:8080/api/products?page=${page}&size=${PAGE_SIZE}`;
    if (sort) url += `&sort=${sort}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    if (selectedStore) url += `&storeName=${encodeURIComponent(selectedStore)}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Ürünler alınamadı");
        return res.json();
      })
      .then((data) => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, sort, minPrice, maxPrice, selectedStore]);

  // Mağazaları getir
  useEffect(() => {
    setStoresLoading(true);
    fetch("http://localhost:8080/api/products/stores")
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
    <section className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 mt-16">
      <PageTitle title="Öne Çıkan Ürünler" />
      <MetaTags 
        title="Öne Çıkan Ürünler"
        description="En kaliteli ürünleri keşfedin. Binlerce ürün arasından size en uygun olanını bulun. Hızlı teslimat ve güvenli alışveriş garantisi."
        keywords="e-ticaret, online alışveriş, ürünler, kaliteli ürünler, güvenli alışveriş"
      />
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">Öne Çıkan Ürünler</h2>
      {/* Filtre barı */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center mb-8">
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
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7 py-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7 py-8">
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
              {Array.from({ length: totalPages }, (_, i) => (
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
              ))}
            </div>
          )}
        </>
      )}
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