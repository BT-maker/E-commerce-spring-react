import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sepeti backend'den çek
  const fetchCart = async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/cart", { withCredentials: true });
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Sepet yükleme hatası:', err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isLoggedIn) {
      alert('Sepete ürün eklemek için giriş yapmanız gerekiyor.');
      return;
    }

    try {
      await api.post(
        "/cart",
        { productId, quantity },
        { withCredentials: true }
      );
      await fetchCart();
      console.log('Ürün sepete eklendi');
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      alert('Sepete ürün eklenirken bir hata oluştu.');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`, { withCredentials: true });
      // Sepeti zorunlu olarak yeniden yükle
      await fetchCart(true);
    } catch (error) {
      console.error('Sepetten çıkarma hatası:', error);
    }
  };

  const changeQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(
        `/cart/${productId}/quantity?quantity=${quantity}`,
        {},
        { withCredentials: true }
      );
      // Sepeti zorunlu olarak yeniden yükle
      await fetchCart(true);
    } catch (error) {
      console.error('Miktar değiştirme hatası:', error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart", { withCredentials: true });
      // Sepeti zorunlu olarak yeniden yükle
      await fetchCart(true);
    } catch (error) {
      console.error('Sepeti temizleme hatası:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, changeQuantity, clearCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Bu context şu işlevleri sağlar:
 * 
 * 1. Sepet Yönetimi: Kullanıcı sepetinin global state yönetimi
 * 2. Sepet İşlemleri: Ürün ekleme, çıkarma, miktar değiştirme
 * 3. Backend Senkronizasyon: Sepet verilerini backend ile senkronize etme
 * 4. Otomatik Güncelleme: Sepet değişikliklerinde otomatik yenileme
 * 5. Loading States: Sepet işlemleri sırasında loading durumu
 * 6. Sepet Temizleme: Tüm sepeti temizleme işlemi
 * 7. Global State: Tüm uygulamada sepet durumunu paylaşma
 * 
 * Bu context sayesinde sepet işlemleri tüm uygulamada tutarlı şekilde çalışır!
 */ 