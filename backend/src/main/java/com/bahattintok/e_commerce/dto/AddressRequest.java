package com.bahattintok.e_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Adres bilgileri için DTO sınıfı
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {
    private String address1;
    private String address2;
    private String phone;
}
