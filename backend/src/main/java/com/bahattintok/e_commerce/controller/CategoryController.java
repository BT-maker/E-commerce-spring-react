package com.bahattintok.e_commerce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.model.Category;
import com.bahattintok.e_commerce.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

/**
 * Kategori CRUD işlemlerini yöneten controller.
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepository;

    /**
     * Tüm kategorileri getirir.
     */
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    /**
     * Yeni kategori oluşturur (sadece admin).
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(savedCategory);
    }

    /**
     * Kategoriyi günceller (sadece admin).
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> updateCategory(@PathVariable String id, @RequestBody Category categoryDetails) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setImageUrl(categoryDetails.getImageUrl());
        Category updatedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    /**
     * Kategoriyi siler (sadece admin).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * ID'ye göre kategori getirir.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable String id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        return ResponseEntity.ok(category);
    }
    
    /**
     * Bu controller şu işlevleri sağlar:
     * 
     * 1. Kategori Listeleme: Tüm kategorileri getirir (GET /api/categories)
     * 2. Kategori Oluşturma: Yeni kategori ekler (POST /api/categories) - Sadece ADMIN
     * 3. Kategori Güncelleme: Mevcut kategoriyi düzenler (PUT /api/categories/{id}) - Sadece ADMIN
     * 4. Kategori Silme: Kategoriyi kaldırır (DELETE /api/categories/{id}) - Sadece ADMIN
     * 5. Kategori Detayı: ID'ye göre kategori bilgilerini getirir (GET /api/categories/{id})
     * 
     * Bu controller sayesinde ürün kategorileri yönetilebilir ve kullanıcılar kategorileri görüntüleyebilir!
     */
} 