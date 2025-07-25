import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Ürün bulunamadı");
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!product?.id) return;
    setAddLoading(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 900);
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow p-4 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
      <Skeleton height={220} width={220} className="rounded-lg" />
      <div className="flex-1 flex flex-col gap-4">
        <Skeleton height={32} width={180} />
        <Skeleton height={28} width={100} />
        <Skeleton height={20} width={120} />
        <Skeleton count={3} height={18} />
        <Skeleton height={44} width={180} className="mt-4 rounded" />
      </div>
    </div>
  );
  if (error) return <div className="cart-empty" style={{ color: "#d32f2f" }}>{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow p-4 sm:p-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
      <img src={product.imageUrl} alt={product.name} className="w-full sm:w-72 h-56 sm:h-72 object-contain rounded-lg bg-gray-100" />
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <div className="text-lg text-green-700 font-semibold">{product.price} ₺</div>
        {product.storeName && (
          <div className="text-sm text-gray-500 mb-2">Mağaza: <Link to={`/store/${encodeURIComponent(product.storeName)}`} className="font-semibold text-green-700 hover:underline">{product.storeName}</Link></div>
        )}
        <div className="text-gray-700">{product.description}</div>
        <button
          className={`product-card-btn mt-4${added ? " added" : ""}`}
          onClick={handleAddToCart}
          disabled={added || addLoading}
          style={{ width: "220px", fontSize: "1.1rem" }}
        >
          {added ? "Eklendi!" : addLoading ? "Ekleniyor..." : "Sepete Ekle"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail; 