package com.bahattintok.e_commerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Kullanıcı kayıt (signup) isteklerinde kullanılan DTO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    
    /**
     * Kullanıcı adı
     */
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    /**
     * Kullanıcı email adresi
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    /**
     * Kullanıcı şifresi
     */
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    /**
     * Kullanıcı rolü (opsiyonel, default USER atanabilir)
     */
    private Long roleId; // opsiyonel, default USER atanabilir
    
    /**
     * Kullanıcı tipi (customer veya seller)
     */
    private String userType;
    
    /**
     * Mağaza adı (sadece seller için)
     */
    private String storeName;
    
    /**
     * Telefon numarası (sadece seller için)
     */
    private String phone;
    
    /**
     * Bu DTO şu işlevleri sağlar:
     * 
     * 1. Kullanıcı Kaydı: Yeni kullanıcı oluşturma için gerekli temel bilgiler
     * 2. Rol Yönetimi: Kullanıcı tipine göre rol atanması (customer/seller)
     * 3. Mağaza Bilgileri: Seller tipi kullanıcılar için mağaza ve iletişim bilgileri
     * 4. Veri Doğrulama: Email formatı, şifre uzunluğu ve kullanıcı adı kuralları
     * 5. Esnek Yapı: Farklı kullanıcı tipleri için opsiyonel alanlar
     * 
     * Bu DTO sayesinde kullanıcı kayıt işlemlerinde tutarlı ve güvenli veri yapısı sağlanır!
     */
} 