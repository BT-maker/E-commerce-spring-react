package com.bahattintok.e_commerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Favorite;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    
    /**
     * Kullanıcının favorilerini getirir
     */
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    /**
     * Kullanıcının belirli bir ürünü favorilerinde olup olmadığını kontrol eder
     */
    Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId);
    
    /**
     * Kullanıcının favorilerinde belirli bir ürün var mı kontrol eder
     */
    boolean existsByUserIdAndProductId(Long userId, Long productId);
    
    /**
     * Kullanıcının favorilerini sayar
     */
    long countByUserId(Long userId);
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: Favorite entity'si için standart veritabanı işlemleri
     * 2. Kullanıcı Favorileri: Kullanıcıya göre favori listesi getirme
     * 3. Favori Kontrolü: Kullanıcının ürünü favorilerinde olup olmadığını kontrol etme
     * 4. Favori Sayısı: Kullanıcının toplam favori sayısını hesaplama
     * 5. JPA Desteği: Spring Data JPA ile otomatik metod oluşturma
     * 6. Performans Optimizasyonu: Lazy loading ve caching desteği
     * 
     * Bu repository sayesinde kullanıcı favorileri veritabanında güvenli şekilde yönetilebilir!
     */
} 