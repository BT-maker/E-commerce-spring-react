package com.bahattintok.e_commerce.service;

import java.util.List;
import java.util.Map;

import com.bahattintok.e_commerce.model.Review;

public interface ReviewService {
    
    /**
     * Ürüne ait tüm review'ları getirir
     */
    List<Review> getProductReviews(Long productId);
    
    /**
     * Kullanıcının ürün için review'ını getirir
     */
    Review getUserReview(String email, Long productId);
    
    /**
     * Review ekler veya günceller
     */
    Review addOrUpdateReview(String email, Long productId, int rating, String comment);
    
    /**
     * Review siler
     */
    void deleteReview(String email, Long productId);
    
    /**
     * Ürünün ortalama puanını getirir
     */
    Double getAverageRating(Long productId);
    
    /**
     * Ürünün review sayısını getirir
     */
    Long getReviewCount(Long productId);
    
    /**
     * Ürünün review istatistiklerini getirir (ortalama puan + review sayısı)
     */
    Map<String, Object> getReviewStats(Long productId);
    
    /**
     * Kullanıcının belirli bir ürün için review'ı var mı kontrol eder
     */
    boolean hasUserReviewed(String email, Long productId);
    
    /**
     * Bu interface şu işlevleri sağlar:
     * 
     * 1. Review Listeleme: Ürüne ait tüm değerlendirmeleri getirme
     * 2. Review Ekleme/Güncelleme: Kullanıcı review'ı ekleme veya güncelleme
     * 3. Review Silme: Kullanıcı review'ını silme işlemi
     * 4. İstatistik Hesaplama: Ürünün ortalama puanı ve review sayısı
     * 5. Review Kontrolü: Kullanıcının ürün için review'ı olup olmadığını kontrol etme
     * 6. Interface Tasarımı: Servis implementasyonları için sözleşme tanımlama
     * 
     * Bu interface sayesinde ürün değerlendirme sistemi standart ve kapsamlı şekilde yapılabilir!
     */
} 