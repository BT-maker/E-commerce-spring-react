package com.bahattintok.e_commerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Category;

/**
 * Category (kategori) ile ilgili veritabanı işlemlerini yapan repository.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    /**
     * Kategori adına göre kategori bulur.
     */
    Optional<Category> findByName(String name);
    
    /**
     * Kategori adına göre kategori bulur (büyük/küçük harf duyarsız).
     */
    Optional<Category> findByNameIgnoreCase(String name);
    
    /**
     * Kategori adının var olup olmadığını kontrol eder (büyük/küçük harf duyarsız).
     */
    boolean existsByNameIgnoreCase(String name);
    
    /**
     * Kategorileri öncelik sırasına göre getirir
     */
    List<Category> findAllByOrderByPriorityDescNameAsc();
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: Category entity'si için standart veritabanı işlemleri
     * 2. Kategori Arama: İsme göre kategori bulma işlemi
     * 3. JPA Desteği: Spring Data JPA ile otomatik metod oluşturma
     * 4. Ürün Sınıflandırma: Kategorilerin ürün organizasyonu için kullanımı
     * 5. Performans Optimizasyonu: Lazy loading ve caching desteği
     * 6. String ID Desteği: Performans için String UUID kullanımı
     * 
     * Bu repository sayesinde ürün kategorileri veritabanında güvenli şekilde yönetilebilir!
     */
} 