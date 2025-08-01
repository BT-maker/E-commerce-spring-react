package com.bahattintok.e_commerce.service;

import java.util.List;

/**
 * Arama önerileri servisi interface'i.
 * Kullanıcı yazarken otomatik öneriler sunar.
 */
public interface SearchSuggestionService {
    
    /**
     * Ürün adı önerileri getirir.
     * @param query Arama terimi
     * @param limit Öneri sayısı
     * @return Ürün adı önerileri listesi
     */
    List<String> getProductNameSuggestions(String query, int limit);
    
    /**
     * Kategori önerileri getirir.
     * @param query Arama terimi
     * @param limit Öneri sayısı
     * @return Kategori önerileri listesi
     */
    List<String> getCategorySuggestions(String query, int limit);
    
    /**
     * Mağaza önerileri getirir.
     * @param query Arama terimi
     * @param limit Öneri sayısı
     * @return Mağaza önerileri listesi
     */
    List<String> getStoreSuggestions(String query, int limit);
    
    /**
     * Genel arama önerileri getirir.
     * @param query Arama terimi
     * @param limit Öneri sayısı
     * @return Genel öneriler listesi
     */
    List<String> getGeneralSuggestions(String query, int limit);
    
    /**
     * Popüler arama terimleri getirir.
     * @param limit Öneri sayısı
     * @return Popüler arama terimleri listesi
     */
    List<String> getPopularSearchTerms(int limit);
} 