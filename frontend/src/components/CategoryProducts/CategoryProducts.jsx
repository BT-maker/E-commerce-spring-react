import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import { CartContext } from "../../context/CartContext";
import { toast } from "react-toastify";

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

  useEffect(() => {
    setLoading(true);
    let url = `http://localhost:8080/api/products?categoryId=${id}`;
    if (sort) url += `&sort=${sort}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    Promise.all([
      fetch(`http://localhost:8080/api/categories/${id}`).then(res => res.json()),
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
  }, [id, sort, minPrice, maxPrice]);

  const handleSortChange = (e) => setSort(e.target.value);
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success("Ürün sepete eklendi!");
    } catch {
      toast.error("Ürün sepete eklenemedi!");
    }
  };

  if (loading) return <div className="cart-empty">Yükleniyor...</div>;
  if (error) return <div className="cart-empty" style={{ color: "#d32f2f" }}>{error}</div>;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
        {category ? category.name : "Kategori"} Ürünleri
      </h2>
      {/* Filtre barı */}
      <div className="flex flex-wrap gap-4 items-center justify-center mb-8">
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
      {Array.isArray(products) && products.length === 0 ? (
        <div className="text-center text-gray-400 py-8">Bu kategoride ürün yok.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {Array.isArray(products) && products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryProducts; 