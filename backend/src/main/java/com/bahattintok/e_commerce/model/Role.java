package com.bahattintok.e_commerce.model;

/**
 * Kullanıcı rollerini temsil eden enum.
 * USER: Standart kullanıcı
 * ADMIN: Yönetici kullanıcı
 * SELLER: Satıcı kullanıcı
 */
public enum Role {
    USER,
    ADMIN,
    SELLER
    
    /**
     * Bu enum şu işlevleri sağlar:
     * 
     * 1. Rol Tanımlama: Uygulama genelinde kullanıcı rollerinin tanımlanması
     * 2. Yetki Yönetimi: Farklı kullanıcı tiplerinin yetki seviyeleri
     * 3. Güvenlik Kontrolü: Spring Security ile rol tabanlı erişim kontrolü
     * 4. Kod Okunabilirliği: Rol isimlerinin anlaşılır şekilde tanımlanması
     * 
     * Bu enum sayesinde kullanıcı rolleri standart ve güvenli şekilde yönetilebilir!
     */
} 