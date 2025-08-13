package com.bahattintok.e_commerce.dto;

import lombok.Data;

/**
 * Kullanıcı profil güncelleme isteklerinde kullanılan DTO.
 */
@Data
public class UpdateProfileRequest {
    /**
     * Yeni ad (opsiyonel)
     */
    private String firstName;
    
    /**
     * Yeni soyad (opsiyonel)
     */
    private String lastName;
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
     * Mevcut şifre (şifre değişikliği için zorunlu)
     */
    private String currentPassword;
    /**
     * Yeni şifre (şifre değişikliği için zorunlu)
     */
    private String newPassword;

    /**
     * Birinci adres bilgisi (opsiyonel)
     */
    private String address1;

    /**
     * İkinci adres bilgisi (opsiyonel)
     */
    private String address2;
    
    /**
     * FirstName getter metodu
     */
    public String getFirstName() {
        return firstName;
    }
    
    /**
     * FirstName setter metodu
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    /**
     * LastName getter metodu
     */
    public String getLastName() {
        return lastName;
    }
    
    /**
     * LastName setter metodu
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
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
    public String getAddress1() {
        return address1;
    }

    /**
     * Address setter metodu
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
     * 1. Profil Güncelleme: Kullanıcı bilgilerinin (ad, email, telefon, doğum tarihi, adres) güncellenmesi
     * 2. Şifre Değişikliği: Güvenli şifre değiştirme işlemi (mevcut şifre kontrolü ile)
     * 3. Opsiyonel Alanlar: Sadece değiştirilmek istenen alanların güncellenmesi
     * 4. Güvenlik Kontrolü: Şifre değişikliği için mevcut şifrenin doğrulanması
     * 
     * Bu DTO sayesinde kullanıcı profil güncelleme işlemlerinde güvenli ve esnek veri yapısı sağlanır!
     */
} 