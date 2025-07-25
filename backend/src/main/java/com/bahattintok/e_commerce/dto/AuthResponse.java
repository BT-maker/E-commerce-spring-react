package com.bahattintok.e_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Kimlik doğrulama işlemlerinde (giriş/kayıt) dönen yanıt DTO'su.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    /**
     * JWT token (girişte döner, cookie'ye de eklenir)
     */
    private String token;
    /**
     * Kullanıcı adı
     */
    private String username;
    /**
     * Kullanıcı rolü (USER, ADMIN vs.)
     */
    private String role;
} 