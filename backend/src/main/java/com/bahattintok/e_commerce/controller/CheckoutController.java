package com.bahattintok.e_commerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.dto.AddressRequest;
import com.bahattintok.e_commerce.dto.CheckoutRequest;
import com.bahattintok.e_commerce.service.CheckoutService;

import lombok.RequiredArgsConstructor;

/**
 * Teslimat ve ödeme işlemleri için controller
 */
@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CheckoutController {

    private final CheckoutService checkoutService;

    /**
     * Kullanıcının adres bilgilerini günceller
     */
    @PutMapping("/address")
    public ResponseEntity<?> updateAddress(
            @RequestBody AddressRequest addressRequest,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            var result = checkoutService.updateUserAddress(userEmail, addressRequest);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Kullanıcının mevcut adres bilgilerini getirir
     */
    @GetMapping("/address")
    public ResponseEntity<?> getAddress(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            var result = checkoutService.getUserAddress(userEmail);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Teslimat seçeneklerini getirir
     */
    @GetMapping("/delivery-options")
    public ResponseEntity<?> getDeliveryOptions() {
        try {
            var options = checkoutService.getDeliveryOptions();
            return ResponseEntity.ok(options);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Ödeme yöntemlerini getirir
     */
    @GetMapping("/payment-methods")
    public ResponseEntity<?> getPaymentMethods() {
        try {
            var methods = checkoutService.getPaymentMethods();
            return ResponseEntity.ok(methods);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Siparişi tamamlar
     */
    @PostMapping("/complete")
    public ResponseEntity<?> completeOrder(
            @RequestBody CheckoutRequest checkoutRequest,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            var result = checkoutService.completeOrder(userEmail, checkoutRequest);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
