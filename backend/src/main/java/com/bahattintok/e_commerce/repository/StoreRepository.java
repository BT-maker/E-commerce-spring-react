package com.bahattintok.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;

@Repository
public interface StoreRepository extends JpaRepository<Store, String> {
    Optional<Store> findBySeller(User seller);
    Optional<Store> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: Store entity'si için standart veritabanı işlemleri
     * 2. Satıcı Mağazası: Satıcıya göre mağaza bulma işlemi
     * 3. Mağaza Arama: İsme göre mağaza bulma (büyük/küçük harf duyarsız)
     * 4. Mağaza Kontrolü: Mağaza adının var olup olmadığını kontrol etme
     * 5. JPA Desteği: Spring Data JPA ile otomatik metod oluşturma
     * 6. Performans Optimizasyonu: Lazy loading ve caching desteği
     * 7. String ID Desteği: Performans için String UUID kullanımı
     * 
     * Bu repository sayesinde satıcı mağazaları veritabanında güvenli şekilde yönetilebilir!
     */
} 