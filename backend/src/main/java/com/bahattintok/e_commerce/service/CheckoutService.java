package com.bahattintok.e_commerce.service;

import java.util.Map;

import com.bahattintok.e_commerce.dto.AddressRequest;
import com.bahattintok.e_commerce.dto.CheckoutRequest;

/**
 * Teslimat ve ödeme işlemleri için service interface
 */
public interface CheckoutService {
    
    /**
     * Kullanıcının adres bilgilerini günceller
     */
    Map<String, Object> updateUserAddress(String userEmail, AddressRequest addressRequest);
    
    /**
     * Kullanıcının mevcut adres bilgilerini getirir
     */
    Map<String, Object> getUserAddress(String userEmail);
    
    /**
     * Teslimat seçeneklerini getirir
     */
    Map<String, Object> getDeliveryOptions();
    
    /**
     * Ödeme yöntemlerini getirir
     */
    Map<String, Object> getPaymentMethods();
    
    /**
     * Siparişi tamamlar
     */
    Map<String, Object> completeOrder(String userEmail, CheckoutRequest checkoutRequest);
}
