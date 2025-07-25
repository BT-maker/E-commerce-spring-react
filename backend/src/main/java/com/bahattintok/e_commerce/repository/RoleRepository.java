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
} 