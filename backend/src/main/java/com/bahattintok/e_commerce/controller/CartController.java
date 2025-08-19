package com.bahattintok.e_commerce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.dto.CartItemRequest;
import com.bahattintok.e_commerce.model.CartItem;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.CartService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Kullanıcı sepeti işlemlerini yöneten controller.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart management APIs")
public class CartController {
    
    private final CartService cartService;
    private final UserRepository userRepository;
    
    /**
     * Kullanıcının sepetindeki tüm ürünleri getirir.
     */
    @GetMapping
    @Operation(summary = "Get user cart", description = "Retrieve all items in user's cart")
    public ResponseEntity<List<CartItem>> getUserCart(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<CartItem> cartItems = cartService.getCartItems(user);
        return ResponseEntity.ok(cartItems);
    }
    
    /**
     * Sepete ürün ekler.
     */
    @PostMapping
    @Operation(summary = "Add item to cart", description = "Add a product to user's cart")
    public ResponseEntity<Void> addToCart(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        cartService.addToCart(user, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok().build();
    }
    
    /**
     * Sepetten ürün siler.
     */
    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove item from cart", description = "Remove a product from user's cart")
    public ResponseEntity<Void> removeFromCart(
            Authentication authentication,
            @PathVariable String productId) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        cartService.removeFromCart(user, productId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Sepetteki ürünün miktarını günceller.
     */
    @PutMapping("/{productId}/quantity")
    @Operation(summary = "Update item quantity", description = "Update quantity of a product in cart")
    public ResponseEntity<Void> updateCartItemQuantity(
            Authentication authentication,
            @PathVariable String productId,
            @RequestParam Integer quantity) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        cartService.updateCartItemQuantity(user, productId, quantity);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Sepeti tamamen temizler.
     */
    @DeleteMapping
    @Operation(summary = "Clear cart", description = "Remove all items from user's cart")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Bu controller şu işlevleri sağlar:
     * 
     * 1. Sepet Görüntüleme: Kullanıcının sepetindeki ürünleri listeler (GET /api/cart)
     * 2. Ürün Ekleme: Sepete yeni ürün ekler (POST /api/cart)
     * 3. Ürün Silme: Sepetten belirli ürünü kaldırır (DELETE /api/cart/{productId})
     * 4. Miktar Güncelleme: Ürün miktarını değiştirir (PUT /api/cart/{productId}/quantity)
     * 5. Sepet Temizleme: Tüm sepeti boşaltır (DELETE /api/cart)
     * 
     * Bu controller sayesinde kullanıcılar alışveriş sepetlerini tam olarak yönetebilir!
     */
} 