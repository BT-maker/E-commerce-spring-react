package com.bahattintok.e_commerce.dto;

import lombok.Data;

/**
 * Kullanıcı profil güncelleme isteklerinde kullanılan DTO.
 */
@Data
public class UpdateProfileRequest {
    /**
     * Yeni kullanıcı adı (opsiyonel)
     */
    private String username;
    /**
     * Yeni email adresi (opsiyonel)
     */
    private String email;
    /**
     * Mevcut şifre (şifre değişikliği için zorunlu)
     */
    private String currentPassword;
    /**
     * Yeni şifre (şifre değişikliği için zorunlu)
     */
    private String newPassword;
} 