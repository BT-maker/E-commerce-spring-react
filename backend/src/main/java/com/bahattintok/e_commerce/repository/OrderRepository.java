package com.bahattintok.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: Order entity'si için standart veritabanı işlemleri
     * 2. Kullanıcı Siparişleri: Kullanıcıya göre sipariş listesi getirme
     * 3. Tarih Sıralaması: Siparişleri oluşturulma tarihine göre sıralama
     * 4. JPA Desteği: Spring Data JPA ile otomatik metod oluşturma
     * 5. İlişki Yönetimi: Kullanıcı-sipariş many-to-one ilişkisi
     * 6. Performans Optimizasyonu: Lazy loading ve caching desteği
     * 
     * Bu repository sayesinde kullanıcı siparişleri veritabanında güvenli şekilde yönetilebilir!
     */
} 