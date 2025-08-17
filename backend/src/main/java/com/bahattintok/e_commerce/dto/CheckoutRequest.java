package com.bahattintok.e_commerce.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Ödeme işlemi için DTO sınıfı
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    private List<CheckoutItem> items;
    private BigDecimal total;
    private String deliveryAddress;
    private String deliveryMethod; // STANDARD, EXPRESS
    private String paymentMethod; // CREDIT_CARD, BANK_TRANSFER, CASH_ON_DELIVERY
    private String notes;
}
