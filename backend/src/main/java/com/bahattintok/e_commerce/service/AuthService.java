package com.bahattintok.e_commerce.service;

import com.bahattintok.e_commerce.dto.AuthResponse;
import com.bahattintok.e_commerce.dto.SignInRequest;
import com.bahattintok.e_commerce.dto.SignUpRequest;

/**
 * Kimlik doğrulama (giriş/kayıt) işlemlerini yöneten servis arayüzü.
 */
public interface AuthService {
    /**
     * Kullanıcı kaydı (signup) işlemi.
     */
    AuthResponse signUp(SignUpRequest request);
    /**
     * Kullanıcı girişi (signin) işlemi.
     */
    AuthResponse signIn(SignInRequest request);
    
    /**
     * Admin girişi (signin) işlemi.
     */
    AuthResponse adminSignIn(SignInRequest request);
    
    /**
     * Seller girişi (signin) işlemi.
     */
    AuthResponse sellerSignIn(SignInRequest request);
    
    /**
     * Bu interface şu işlevleri sağlar:
     * 
     * 1. Kullanıcı Kaydı: Yeni kullanıcı oluşturma ve JWT token üretme
     * 2. Kullanıcı Girişi: Kimlik doğrulama ve JWT token üretme
     * 3. Güvenli Yanıt: Authentication işlemleri için standart yanıt formatı
     * 4. Interface Tasarımı: Servis implementasyonları için sözleşme tanımlama
     * 
     * Bu interface sayesinde authentication işlemleri standart ve güvenli şekilde yapılabilir!
     */
} 