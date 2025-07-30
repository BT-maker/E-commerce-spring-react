import React, { useContext, useEffect, useState } from "react";
import CartItem from "../CartItem/CartItem";
import "./CartPage.css";
import { CartContext } from "../../context/CartContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';

const CartPage = () => {
  const { cartItems, changeQuantity, removeFromCart, loading, clearCart } = useContext(CartContext);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => {
    const price = item.product?.isDiscountActive ? item.product.discountedPrice : item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    setOrderLoading(true);
    setOrderError("");
    try {
      // Sipariş verilerini hazırla
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.isDiscountActive ? item.product.discountedPrice : item.product.price
      }));
      
      console.log('Sipariş verileri:', { items: orderItems, total });
      
      const response = await api.post("/orders", { 
        items: orderItems,
        total: total
      });
      
      console.log('Sipariş response:', response.data);
      
      await clearCart();
      navigate("/orders");
    } catch (err) {
      console.error('Sipariş hatası:', err);
      console.error('Hata detayı:', err.response?.data);
      setOrderError(`Sipariş oluşturulamadı: ${err.response?.data?.message || err.message}`);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
          <div className="cart-page-container">
        <PageTitle title="Sepetim" />
        <MetaTags 
          title="Sepetim"
          description="Alışveriş sepetinizi görüntüleyin. Ürünlerinizi düzenleyin ve güvenli ödeme ile siparişinizi tamamlayın."
          keywords="sepet, alışveriş sepeti, ödeme, sipariş"
        />
        <h2 className="cart-page-title">Sepetim</h2>
        {loading ? (
          <div className="cart-page-container">
          <h2 className="cart-page-title">Sepetim</h2>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 bg-white">
                <div className="flex gap-4">
                  <Skeleton height={80} width={80} className="rounded" />
                  <div className="flex-1">
                    <Skeleton height={20} width={200} className="mb-2" />
                    <Skeleton height={16} width={100} className="mb-2" />
                    <Skeleton height={32} width={120} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Sepet Sayfası: Kullanıcının sepetini görüntüleme
 * 2. Sepet İçeriği: Sepetteki tüm ürünleri listeleme
 * 3. Toplam Hesaplama: Sepet toplam tutarını hesaplama
 * 4. Sipariş Oluşturma: Sepetten sipariş oluşturma
 * 5. Loading States: Yükleme durumları için skeleton animasyonları
 * 6. Error Handling: Hata durumlarının yönetimi
 * 7. SEO Optimizasyonu: Sayfa başlığı ve meta etiketleri
 * 8. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde kullanıcılar alışveriş sepetlerini tam olarak yönetebilir!
 */ 