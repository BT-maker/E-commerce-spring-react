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
} 