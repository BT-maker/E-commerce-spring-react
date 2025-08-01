package com.bahattintok.e_commerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    /**
     * Ürüne ait tüm review'ları getirir (tarihe göre sıralı)
     */
    List<Review> findByProductIdOrderByCreatedAtDesc(String productId);
    
    /**
     * Kullanıcının belirli bir ürün için review'ını getirir
     */
    Optional<Review> findByUserIdAndProductId(String userId, String productId);
    
    /**
     * Kullanıcının belirli bir ürün için review'ı var mı kontrol eder
     */
    boolean existsByUserIdAndProductId(String userId, String productId);
    
    /**
     * Ürünün ortalama puanını hesaplar
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") String productId);
    
    /**
     * Ürünün toplam review sayısını getirir
     */
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    Long getReviewCountByProductId(@Param("productId") String productId);
    
    /**
     * Kullanıcının tüm review'larını getirir
     */
    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: Review entity'si için standart veritabanı işlemleri
     * 2. Ürün Review'ları: Ürüne ait tüm değerlendirmeleri getirme
     * 3. Kullanıcı Review'ı: Kullanıcının belirli ürün için review'ını getirme
     * 4. Review Kontrolü: Kullanıcının ürün için review'ı olup olmadığını kontrol etme
     * 5. İstatistik Hesaplama: Ürünün ortalama puanı ve review sayısı
     * 6. Kullanıcı Review'ları: Kullanıcının tüm review'larını listeleme
     * 7. JPA Desteği: Spring Data JPA ile özel sorgular
     * 
     * Bu repository sayesinde ürün değerlendirme sistemi veritabanında güvenli şekilde yönetilebilir!
     */
} 