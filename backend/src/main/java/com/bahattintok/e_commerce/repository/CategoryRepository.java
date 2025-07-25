package com.bahattintok.e_commerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Category;

/**
 * Category (kategori) ile ilgili veritabanı işlemlerini yapan repository.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    /**
     * Kategori adına göre kategori bulur.
     */
    Optional<Category> findByName(String name);
} 