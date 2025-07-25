import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../ProductCard/ProductCard";
import { CartContext } from "../../context/CartContext";
import { toast } from "react-toastify";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);

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
    fetch(`http://localhost:8080/api/products?search=${query}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Arama sonuçları alınamadı");
        }
        return res.json();
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
  }, [query]);

  if (loading) return <div className="text-center py-10">Yükleniyor...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">
        Arama Sonuçları: "{query}"
      </h2>
      {products.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          Aradığınız kritere uygun ürün bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResults; 