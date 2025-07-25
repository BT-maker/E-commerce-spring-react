import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../ProductCard/ProductCard";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import { CartContext } from '../../context/CartContext';

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

  useEffect(() => {
    setLoading(true);
    let url = `http://localhost:8080/api/products?page=${page}&size=${PAGE_SIZE}`;
    if (sort) url += `&sort=${sort}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
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
  }, [page, sort, minPrice, maxPrice]);

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

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Ürün sepete eklendi!');
    } catch {
      toast.error('Ürün sepete eklenemedi!');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 mt-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">Öne Çıkan Ürünler</h2>
      {/* Filtre barı */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center mb-8">
        <select value={sort} onChange={handleSortChange} className="border px-3 py-2 rounded">
          <option value="">Varsayılan Sıralama</option>
          <option value="price,asc">Fiyat: Artan</option>
          <option value="price,desc">Fiyat: Azalan</option>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`px-3 py-1 rounded font-semibold border ${page === i ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"}`}
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