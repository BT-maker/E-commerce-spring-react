import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoaded, setCartLoaded] = useState(false); // Cart yüklendi mi?

  // Sepeti backend'den çek
  const fetchCart = async () => {
    // Eğer cart zaten yüklendiyse tekrar yükleme
    if (cartLoaded) return;
    
    // Backend offline ise cart yükleme
    if (window.BACKEND_OFFLINE) {
      console.log('Backend offline, cart yüklenmedi');
      setCartItems([]);
      setCartLoaded(true);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.get("/cart", { withCredentials: true });
      setCartItems(Array.isArray(res.data) ? res.data : []);
      setCartLoaded(true);
    } catch (err) {
      setCartItems([]);
      setCartLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []); // Sadece component mount olduğunda çalışsın

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post(
        "/cart",
        { productId, quantity },
        { withCredentials: true }
      );
      // Cart'ı yeniden yükle
      setCartLoaded(false);
      await fetchCart();
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`, { withCredentials: true });
      // Cart'ı yeniden yükle
      setCartLoaded(false);
      await fetchCart();
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
      // Cart'ı yeniden yükle
      setCartLoaded(false);
      await fetchCart();
    } catch (error) {
      console.error('Miktar değiştirme hatası:', error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart", { withCredentials: true });
      // Cart'ı yeniden yükle
      setCartLoaded(false);
      await fetchCart();
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