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
     * Telefon numarası (opsiyonel)
     */
    private String phone;
    /**
     * Doğum tarihi (opsiyonel)
     */
    private String birthDate;
    /**
     * Adres bilgisi (opsiyonel)
     */
    private String adress;
    /**
     * Mevcut şifre (şifre değişikliği için zorunlu)
     */
    private String currentPassword;
    /**
     * Yeni şifre (şifre değişikliği için zorunlu)
     */
    private String newPassword;

    /**
     * Adres (opsiyonel)
     */
    private String address;
    
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
     * BirthDate getter metodu
     */
    public String getBirthDate() {
        return birthDate;
    }
    
    /**
     * BirthDate setter metodu
     */
    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }
    
    /**
     * Adress getter metodu
     */
    public String getAdress() {
        return adress;
    }
    
    /**
     * Adress setter metodu
     */
    public void setAdress(String adress) {
        this.adress = adress;
    }
    
    /**
     * CurrentPassword getter metodu
     */
    public String getCurrentPassword() {
        return currentPassword;
    }
    
    /**
     * CurrentPassword setter metodu
     */
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
    
    /**
     * NewPassword getter metodu
     */
    public String getNewPassword() {
        return newPassword;
    }
    
    /**
     * NewPassword setter metodu
     */
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    /**
     * Address getter metodu
     */
    public String getAddress() {
        return address;
    }

    /**
     * Address setter metodu
     */
    public void setAddress(String address) {
        this.address = address;
    }
    
    /**
     * Bu DTO şu işlevleri sağlar:
     * 
     * 1. Profil Güncelleme: Kullanıcı bilgilerinin (ad, email, telefon, doğum tarihi, adres) güncellenmesi
     * 2. Şifre Değişikliği: Güvenli şifre değiştirme işlemi (mevcut şifre kontrolü ile)
     * 3. Opsiyonel Alanlar: Sadece değiştirilmek istenen alanların güncellenmesi
     * 4. Güvenlik Kontrolü: Şifre değişikliği için mevcut şifrenin doğrulanması
     * 
     * Bu DTO sayesinde kullanıcı profil güncelleme işlemlerinde güvenli ve esnek veri yapısı sağlanır!
     */
} 