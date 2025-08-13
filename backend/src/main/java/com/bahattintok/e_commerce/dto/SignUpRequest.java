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
     * Birinci adres (opsiyonel)
     */
    private String address1;

    /**
     * İkinci adres (opsiyonel)
     */
    private String address2;
    
    /**
     * Username getter metodu
     */
    public String getUsername() {
        return username;
    }
    
    /**
     * Username setter metodu
     */
    public void setUsername(String username) {
        this.username = username;
    }
    
    /**
     * Email getter metodu
     */
    public String getEmail() {
        return email;
    }
    
    /**
     * Email setter metodu
     */
    public void setEmail(String email) {
        this.email = email;
    }
    
    /**
     * Password getter metodu
     */
    public String getPassword() {
        return password;
    }
    
    /**
     * Password setter metodu
     */
    public void setPassword(String password) {
        this.password = password;
    }
    
    /**
     * RoleId getter metodu
     */
    public Long getRoleId() {
        return roleId;
    }
    
    /**
     * RoleId setter metodu
     */
    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }
    
    /**
     * UserType getter metodu
     */
    public String getUserType() {
        return userType;
    }
    
    /**
     * UserType setter metodu
     */
    public void setUserType(String userType) {
        this.userType = userType;
    }
    
    /**
     * StoreName getter metodu
     */
    public String getStoreName() {
        return storeName;
    }
    
    /**
     * StoreName setter metodu
     */
    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }
    
    /**
     * Phone getter metodu
     */
    public String getPhone() {
        return phone;
    }
    
    /**
     * Phone setter metodu
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * Address1 getter metodu
     */
    public String getAddress1() {
        return address1;
    }

    /**
     * Address1 setter metodu
     */
    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    /**
     * Address2 getter metodu
     */
    public String getAddress2() {
        return address2;
    }

    /**
     * Address2 setter metodu
     */
    public void setAddress2(String address2) {
        this.address2 = address2;
    }
    
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