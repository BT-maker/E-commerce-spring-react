package com.bahattintok.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Cart;
import com.bahattintok.e_commerce.model.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: Cart entity'si için standart veritabanı işlemleri
     * 2. Kullanıcı Sepeti: Kullanıcıya göre sepet bulma işlemi
     * 3. JPA Desteği: Spring Data JPA ile otomatik metod oluşturma
     * 4. İlişki Yönetimi: Kullanıcı-sepet one-to-one ilişkisi
     * 5. Performans Optimizasyonu: Lazy loading ve caching desteği
     * 
     * Bu repository sayesinde kullanıcı sepetleri veritabanında güvenli şekilde yönetilebilir!
     */
} 