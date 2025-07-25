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
    private Long productId;
    
    /**
     * Eklenecek miktar
     */
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
} 