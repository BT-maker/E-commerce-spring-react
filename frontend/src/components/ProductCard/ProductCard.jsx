import React, { useState } from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product, loading, onAddToCart }) => {
  if (loading) {
    return (
      <div className="product-card">
        Yükleniyor...
      </div>
    );
  }

  const [added, setAdded] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const onAdd = async () => {
    if (!onAddToCart) return;
    setLoadingBtn(true);
    try {
      await onAddToCart(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 900);
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card-img"
          style={{ cursor: "pointer" }}
        />
      </Link>
      <Link to={`/product/${product.id}`} className="product-card-title-link">
        <h3 className="product-card-title">{product.name}</h3>
      </Link>
      <div className="product-card-price">
        {Number(product.price).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
      </div>
      {onAddToCart && (
        <button
          className={`product-card-btn${added ? " added" : ""}`}
          onClick={onAdd}
          disabled={added || loadingBtn}
        >
          {added ? "Eklendi!" : loadingBtn ? "Ekleniyor..." : "Sepete Ekle"}
        </button>
      )}
    </div>
  );
};

export default ProductCard;