package com.bahattintok.e_commerce.service;

import com.bahattintok.e_commerce.model.Cart;
import com.bahattintok.e_commerce.model.CartItem;
import com.bahattintok.e_commerce.model.User;
import java.util.List;

public interface CartService {
    Cart getOrCreateCart(User user);
    List<CartItem> getCartItems(User user);
    void addToCart(User user, Long productId, int quantity);
    void removeFromCart(User user, Long productId);
    void updateCartItemQuantity(User user, Long productId, int quantity);
    void clearCart(User user);
} 