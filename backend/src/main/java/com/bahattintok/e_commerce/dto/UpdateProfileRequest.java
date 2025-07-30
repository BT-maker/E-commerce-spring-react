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
    
    /**
     * Bu DTO şu işlevleri sağlar:
     * 
     * 1. Profil Güncelleme: Kullanıcı bilgilerinin (ad, email) güncellenmesi
     * 2. Şifre Değişikliği: Güvenli şifre değiştirme işlemi (mevcut şifre kontrolü ile)
     * 3. Opsiyonel Alanlar: Sadece değiştirilmek istenen alanların güncellenmesi
     * 4. Güvenlik Kontrolü: Şifre değişikliği için mevcut şifrenin doğrulanması
     * 
     * Bu DTO sayesinde kullanıcı profil güncelleme işlemlerinde güvenli ve esnek veri yapısı sağlanır!
     */
} 