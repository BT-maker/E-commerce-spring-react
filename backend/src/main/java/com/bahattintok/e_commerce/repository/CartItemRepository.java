package com.bahattintok.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: CartItem entity'si için standart veritabanı işlemleri
     * 2. JPA Desteği: Spring Data JPA ile otomatik metod oluşturma
     * 3. Sepet Ürün Yönetimi: Sepetteki ürünlerin veritabanı işlemleri
     * 4. Performans Optimizasyonu: Lazy loading ve caching desteği
     * 
     * Bu repository sayesinde sepet ürünleri veritabanında güvenli şekilde yönetilebilir!
     */
} 