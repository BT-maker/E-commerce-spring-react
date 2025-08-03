package com.bahattintok.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.User;

/**
 * User (kullanıcı) ile ilgili veritabanı işlemlerini yapan repository.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    /**
     * Kullanıcı adından kullanıcı bulur.
     */
    Optional<User> findByUsername(String username);
    /**
     * Email adresinden kullanıcı bulur.
     */
    Optional<User> findByEmail(String email);
    /**
     * Kullanıcı adı var mı kontrolü.
     */
    boolean existsByUsername(String username);
    /**
     * Email var mı kontrolü.
     */
    boolean existsByEmail(String email);
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: User entity'si için standart veritabanı işlemleri
     * 2. Kullanıcı Arama: Kullanıcı adı ve email ile kullanıcı bulma
     * 3. Benzersizlik Kontrolü: Kullanıcı adı ve email'in benzersiz olup olmadığını kontrol etme
     * 4. JPA Desteği: Spring Data JPA ile otomatik metod oluşturma
     * 5. Güvenlik Kontrolü: Kullanıcı kimlik doğrulama için gerekli metodlar
     * 6. Performans Optimizasyonu: Lazy loading ve caching desteği
     * 
     * Bu repository sayesinde kullanıcı yönetimi veritabanında güvenli şekilde yapılabilir!
     */
} 