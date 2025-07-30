import React from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";
import "./CartItem.css";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { product, quantity, id } = item;
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleFavoriteToggle = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  return (
    <div className="cart-item">
      <Link to={`/product/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} className="cart-item-img" />
      </Link>
      <div className="cart-item-info">
        <Link to={`/product/${product.id}`} className="no-underline">
          <h3 className="cart-item-title">{product.name}</h3>
        </Link>
        <div className="cart-item-price">
          {product.isDiscountActive ? (
            <div className="cart-discount-price">
              <span className="cart-original-price">{Number(product.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</span>
              <span className="cart-discounted-price">{Number(product.discountedPrice).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</span>
              <span className="cart-discount-badge">%{product.discountPercentage} İndirim</span>
            </div>
          ) : (
            <span>{Number(product.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</span>
          )}
        </div>
        <div className="cart-item-quantity">
          <button onClick={() => onQuantityChange(product.id, quantity - 1)} disabled={quantity <= 1}>-</button>
          <span>{quantity}</span>
          <button onClick={() => onQuantityChange(product.id, quantity + 1)}>+</button>
        </div>
        <div className="cart-item-actions">
          <button 
            className={`cart-item-favorite ${isFavorite(product.id) ? 'active' : ''}`} 
            onClick={handleFavoriteToggle}
            title={isFavorite(product.id) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
          >
            <Heart size={16} />
          </button>
          <button 
            className="cart-item-remove" 
            onClick={() => onRemove(product.id)}
            title="Sepetten Kaldır"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Sepet Ürünü: Sepetteki her ürün için ayrı kart
 * 2. Ürün Bilgileri: Ürün adı, fiyatı ve görseli
 * 3. Miktar Kontrolü: Ürün miktarını artırma/azaltma
 * 4. Favori Toggle: Ürünü favorilere ekleme/çıkarma
 * 5. Sepetten Kaldırma: Ürünü sepetten silme
 * 6. Ürün Detayı: Ürün sayfasına yönlendirme
 * 7. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde kullanıcılar sepet içeriklerini kolayca yönetebilir!
 */ 