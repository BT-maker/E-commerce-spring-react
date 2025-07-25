package com.bahattintok.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.User;

/**
 * User (kullanıcı) ile ilgili veritabanı işlemlerini yapan repository.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
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
} 