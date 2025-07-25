import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sepeti backend'den çek
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart", { withCredentials: true });
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    await api.post(
      "/cart",
      { productId, quantity },
      { withCredentials: true }
    );
    fetchCart();
  };

  const removeFromCart = async (productId) => {
    await api.delete(`/cart/${productId}`, { withCredentials: true });
    fetchCart();
  };

  const changeQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    await api.put(
      `/cart/${productId}/quantity?quantity=${quantity}`,
      {},
      { withCredentials: true }
    );
    fetchCart();
  };

  const clearCart = async () => {
    await api.delete("/cart", { withCredentials: true });
    fetchCart();
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, changeQuantity, clearCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
}; 