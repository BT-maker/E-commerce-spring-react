import React from "react";
import { Link } from "react-router-dom";
import "./CartItem.css";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { product, quantity, id } = item;
  return (
    <div className="cart-item">
      <Link to={`/product/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} className="cart-item-img" />
      </Link>
      <div className="cart-item-info">
        <Link to={`/product/${product.id}`} className="no-underline">
          <h3 className="cart-item-title">{product.name}</h3>
        </Link>
        <div className="cart-item-price">{product.price} ₺</div>
        <div className="cart-item-quantity">
          <button onClick={() => onQuantityChange(product.id, quantity - 1)} disabled={quantity <= 1}>-</button>
          <span>{quantity}</span>
          <button onClick={() => onQuantityChange(product.id, quantity + 1)}>+</button>
        </div>
        <button className="cart-item-remove" onClick={() => onRemove(product.id)}>
          Kaldır
        </button>
      </div>
    </div>
  );
};

export default CartItem; 