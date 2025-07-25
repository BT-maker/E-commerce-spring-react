import React, { useContext, useState } from "react";
import CartItem from "../CartItem/CartItem";
import "./CartPage.css";
import { CartContext } from "../../context/CartContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, changeQuantity, removeFromCart, loading, clearCart } = useContext(CartContext);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  const handleCheckout = async () => {
    setOrderLoading(true);
    setOrderError("");
    try {
      await api.post("/orders", {}, { withCredentials: true });
      await clearCart();
      navigate("/orders");
    } catch (err) {
      setOrderError("Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="cart-page-container">
      <h2 className="cart-page-title">Sepetim</h2>
      {loading ? (
        <div className="cart-empty">Sepet yükleniyor...</div>
      ) : cartItems.length === 0 ? (
        <div className="cart-empty">Sepetiniz boş.</div>
      ) : (
        <>
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={changeQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              Toplam: <span>{total.toFixed(2)} ₺</span>
            </div>
            <button className="cart-checkout-btn" onClick={handleCheckout} disabled={orderLoading}>
              {orderLoading ? "Sipariş Oluşturuluyor..." : "Alışverişi Tamamla"}
            </button>
            {orderError && <div style={{ color: "#d32f2f", marginTop: 8 }}>{orderError}</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage; 