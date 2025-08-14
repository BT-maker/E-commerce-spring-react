package com.bahattintok.e_commerce.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    
    // Welcome Dashboard methods
    List<Order> findTop5ByOrderByCreatedAtDesc(Pageable pageable);
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    default List<Order> findTop5ByOrderByCreatedAtDesc() {
        return findTop5ByOrderByCreatedAtDesc(Pageable.ofSize(5));
    }
    
    /**
     * Duruma göre siparişleri getirir.
     */
    List<Order> findByStatus(String status);
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: Order entity'si için standart veritabanı işlemleri
     * 2. Kullanıcı Siparişleri: Kullanıcıya göre sipariş listesi getirme
     * 3. Tarih Sıralaması: Siparişleri oluşturulma tarihine göre sıralama
     * 4. JPA Desteği: Spring Data JPA ile otomatik metod oluşturma
     * 5. İlişki Yönetimi: Kullanıcı-sipariş many-to-one ilişkisi
     * 6. Performans Optimizasyonu: Lazy loading ve caching desteği
     * 7. Dashboard Verileri: Son siparişler ve tarih aralığı sorguları
     * 
     * Bu repository sayesinde kullanıcı siparişleri veritabanında güvenli şekilde yönetilebilir!
     */
} 