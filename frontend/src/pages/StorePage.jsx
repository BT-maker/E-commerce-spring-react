import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard/ProductCard";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";

const StorePage = () => {
  const { name } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetch(`http://localhost:8080/api/stores/${encodeURIComponent(name)}`).then(res => res.json()),
      fetch(`http://localhost:8080/api/products?storeName=${encodeURIComponent(name)}`).then(res => res.json())
    ])
      .then(([storeData, productData]) => {
        setStore(storeData);
        setProducts(productData.content || productData);
        setLoading(false);
      })
      .catch(() => {
        setError("Mağaza veya ürünler alınamadı");
        setLoading(false);
      });
  }, [name]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      toast.success('Ürün sepete eklendi!');
    } catch {
      toast.error('Ürün sepete eklenemedi!');
    }
  };

  if (loading) return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 mt-8 sm:mt-16">
      <div className="text-center py-10">Yükleniyor...</div>
    </section>
  );
  if (error) return <div className="cart-empty" style={{ color: "#d32f2f" }}>{error}</div>;
  if (!store) return <div className="cart-empty">Mağaza bulunamadı.</div>;

  return (
    <section className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 mt-8 sm:mt-16">
      <div className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">{store.name}</div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 text-center">
        Mağazası
      </h2>
      {products.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          Bu mağazada hiç ürün yok.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </section>
  );
};

export default StorePage;