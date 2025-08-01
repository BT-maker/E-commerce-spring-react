package com.bahattintok.e_commerce.service;

import java.util.List;

import com.bahattintok.e_commerce.model.Favorite;

public interface FavoriteService {
    
    /**
     * Kullanıcının favorilerini getirir
     */
    List<Favorite> getUserFavorites(String email);
    
    /**
     * Ürünü favorilere ekler
     */
    Favorite addToFavorites(String email, String productId);
    
    /**
     * Ürünü favorilerden çıkarır
     */
    void removeFromFavorites(String email, String productId);
    
    /**
     * Ürünün favorilerde olup olmadığını kontrol eder
     */
    boolean isFavorite(String email, String productId);
    
    /**
     * Kullanıcının favori sayısını getirir
     */
    long getFavoriteCount(String email);
    
    /**
     * Bu interface şu işlevleri sağlar:
     * 
     * 1. Favori Listeleme: Kullanıcının favori ürünlerini getirme
     * 2. Favori Ekleme: Ürünü favorilere ekleme işlemi
     * 3. Favori Çıkarma: Ürünü favorilerden çıkarma işlemi
     * 4. Favori Kontrolü: Ürünün favorilerde olup olmadığını kontrol etme
     * 5. Favori Sayısı: Kullanıcının toplam favori sayısını hesaplama
     * 6. Interface Tasarımı: Servis implementasyonları için sözleşme tanımlama
     * 
     * Bu interface sayesinde favori işlemleri standart ve tutarlı şekilde yapılabilir!
     */
} 