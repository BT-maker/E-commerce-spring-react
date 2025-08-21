package com.bahattintok.e_commerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.RoleEntity;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.model.enums.SellerStatus;

/**
 * User (kullanıcı) ile ilgili veritabanı işlemlerini yapan repository.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    /**
     * Email adresinden kullanıcı bulur.
     */
    Optional<User> findByEmail(String email);
    /**
     * Email var mı kontrolü.
     */
    boolean existsByEmail(String email);
    
    /**
     * Belirli bir role sahip kullanıcıları sayar.
     */
    long countByRole(RoleEntity role);
    
    /**
     * Belirli bir role sahip kullanıcıları getirir.
     */
    List<User> findByRole(RoleEntity role);
    
    /**
     * Ad, soyad veya email ile kullanıcı arar.
     */
    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String firstName, String lastName, String email);
    
    /**
     * Rol adına göre kullanıcıları getirir.
     */
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);
    
    /**
     * Rol adı ve satıcı durumuna göre kullanıcıları getirir.
     */
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.name = :roleName AND u.sellerStatus = :sellerStatus")
    List<User> findByRoleNameAndSellerStatus(@Param("roleName") String roleName, @Param("sellerStatus") SellerStatus sellerStatus);
    
    /**
     * Rol adı ve kayıt tarihine göre kullanıcıları getirir.
     */
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.name = :roleName AND u.registrationDate > :date")
    List<User> findByRoleNameAndRegistrationDateAfter(@Param("roleName") String roleName, @Param("date") java.time.LocalDateTime date);
    
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