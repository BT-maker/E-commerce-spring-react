package com.bahattintok.e_commerce.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Ödeme öğesi için DTO sınıfı
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutItem {
    private String productId;
    private Integer quantity;
    private BigDecimal price;
}
