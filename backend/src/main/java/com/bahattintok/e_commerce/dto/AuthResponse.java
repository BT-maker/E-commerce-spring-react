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
     * Kullanıcının adı
     */
    private String firstName;
    
    /**
     * Kullanıcının soyadı
     */
    private String lastName;
    /**
     * Kullanıcı rolü (USER, ADMIN vs.)
     */
    private String role;
    
    /**
     * Bu DTO şu işlevleri sağlar:
     * 
     * 1. JWT Token: Kimlik doğrulama için gerekli token bilgisi
     * 2. Kullanıcı Bilgileri: Giriş yapan kullanıcının adı ve rolü
     * 3. Güvenli Yanıt: Hassas bilgileri içermeyen güvenli yanıt formatı
     * 
     * Bu DTO sayesinde authentication işlemlerinde güvenli ve tutarlı yanıtlar döner!
     */
} 