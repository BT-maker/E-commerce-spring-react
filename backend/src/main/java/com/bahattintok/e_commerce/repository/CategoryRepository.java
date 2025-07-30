package com.bahattintok.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Category;

/**
 * Category (kategori) ile ilgili veritabanı işlemlerini yapan repository.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    /**
     * Kategori adına göre kategori bulur.
     */
    Optional<Category> findByName(String name);
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: Category entity'si için standart veritabanı işlemleri
     * 2. Kategori Arama: İsme göre kategori bulma işlemi
     * 3. JPA Desteği: Spring Data JPA ile otomatik metod oluşturma
     * 4. Ürün Sınıflandırma: Kategorilerin ürün organizasyonu için kullanımı
     * 5. Performans Optimizasyonu: Lazy loading ve caching desteği
     * 
     * Bu repository sayesinde ürün kategorileri veritabanında güvenli şekilde yönetilebilir!
     */
} 