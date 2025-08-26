package com.bahattintok.e_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Kredi kartı bilgileri için DTO sınıfı
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditCardRequest {
    private String cardNumber;
    private String cardHolder;
    private String expiryMonth;
    private String cvv;
}
