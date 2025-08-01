package com.bahattintok.e_commerce.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Sepete ürün ekleme/güncelleme isteklerinde kullanılan DTO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemRequest {
    
    /**
     * Sepete eklenecek ürünün ID'si
     */
    @NotNull(message = "Product ID is required")
    private String productId;
    
    /**
     * Eklenecek miktar
     */
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
    
    /**
     * Bu DTO şu işlevleri sağlar:
     * 
     * 1. Ürün Tanımlama: Sepete eklenecek ürünün benzersiz kimliği
     * 2. Miktar Kontrolü: Eklenecek ürün miktarının doğrulanması
     * 3. Veri Doğrulama: Gerekli alanların ve pozitif değerlerin kontrolü
     * 
     * Bu DTO sayesinde sepet işlemlerinde güvenli ve doğrulanmış veriler kullanılır!
     */
} 