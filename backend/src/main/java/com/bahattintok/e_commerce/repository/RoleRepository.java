package com.bahattintok.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.RoleEntity;

/**
 * Role (rol) ile ilgili veritabanı işlemlerini yapan repository.
 */
@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    /**
     * Rol adına göre rol bulur.
     */
    Optional<RoleEntity> findByName(String name);
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: RoleEntity için standart veritabanı işlemleri
     * 2. Rol Arama: İsme göre rol bulma işlemi
     * 3. JPA Desteği: Spring Data JPA ile otomatik metod oluşturma
     * 4. Yetki Yönetimi: Kullanıcı rollerinin veritabanında saklanması
     * 5. Performans Optimizasyonu: Lazy loading ve caching desteği
     * 
     * Bu repository sayesinde kullanıcı rolleri veritabanında güvenli şekilde yönetilebilir!
     */
} 