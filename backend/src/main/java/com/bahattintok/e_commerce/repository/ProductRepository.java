package com.bahattintok.e_commerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Store;

/**
 * Product (ürün) ile ilgili veritabanı işlemlerini yapan repository.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    /**
     * Kategori adına göre ürünleri getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.category = :category")
    List<Product> findByCategory(@Param("category") String category);
    /**
     * İsme veya açıklamaya göre arama yapar (sayfalı).
     */
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);
    /**
     * Fiyat aralığına göre ürünleri getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    /**
     * Fiyat aralığına göre ürünleri sayfalı getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice, Pageable pageable);
    /**
     * Kategori ID'sine göre ürünleri getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);
    /**
     * Kategori ID'sine göre ürünleri sayfalı getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    /**
     * Mağaza bilgisine göre ürünleri sayfalı getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.store = :store")
    Page<Product> findByStore(Store store, Pageable pageable);
    
    /**
     * En çok satılan ürünleri getirir (popülerlik sıralaması için).
     */
    @Query("SELECT p FROM Product p LEFT JOIN OrderItem oi ON p.id = oi.product.id GROUP BY p.id ORDER BY COALESCE(SUM(oi.quantity), 0) DESC")
    Page<Product> findMostPopularProducts(Pageable pageable);
    
    /**
     * Bu repository şu işlevleri sağlar:
     * 
     * 1. Temel CRUD İşlemleri: Product entity'si için standart veritabanı işlemleri
     * 2. Ürün Arama: İsim ve açıklamaya göre arama yapma
     * 3. Kategori Filtreleme: Kategoriye göre ürün listeleme
     * 4. Fiyat Filtreleme: Fiyat aralığına göre ürün filtreleme
     * 5. Mağaza Filtreleme: Mağazaya göre ürün listeleme
     * 6. Popülerlik Sıralaması: En çok satan ürünleri getirme
     * 7. Sayfalama Desteği: Büyük veri setleri için sayfalama
     * 8. JPA Desteği: Spring Data JPA ile özel sorgular
     * 
     * Bu repository sayesinde ürün arama ve filtreleme işlemleri veritabanında güvenli şekilde yönetilebilir!
     */
}