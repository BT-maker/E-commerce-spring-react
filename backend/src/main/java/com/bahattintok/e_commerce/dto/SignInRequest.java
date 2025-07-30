package com.bahattintok.e_commerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Kullanıcı giriş (signin) isteklerinde kullanılan DTO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignInRequest {
    
    /**
     * Kullanıcı email adresi
     */
    @NotBlank(message = "Email is required")
    private String email;
    
    /**
     * Kullanıcı şifresi
     */
    @NotBlank(message = "Password is required")
    private String password;
    
    /**
     * Bu DTO şu işlevleri sağlar:
     * 
     * 1. Kimlik Doğrulama: Kullanıcı girişi için gerekli email ve şifre bilgileri
     * 2. Veri Doğrulama: Email ve şifre alanlarının boş olmamasının kontrolü
     * 3. Güvenli Giriş: Kullanıcı kimlik bilgilerinin güvenli şekilde alınması
     * 
     * Bu DTO sayesinde kullanıcı giriş işlemlerinde tutarlı ve güvenli veri yapısı sağlanır!
     */
} 