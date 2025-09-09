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
public interface ProductRepository extends JpaRepository<Product, String> {
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
    @Query("SELECT p FROM Product p WHERE p.categoryId = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") String categoryId);
    
    /**
     * Kategori ID'sine göre ürünleri sayfalı getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.categoryId = :categoryId")
    Page<Product> findByCategoryId(@Param("categoryId") String categoryId, Pageable pageable);
    
    /**
     * Mağaza ID'sine göre ürünleri getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.storeId = :storeId")
    List<Product> findByStoreId(@Param("storeId") String storeId);
    
    /**
     * Mağaza ID'sine göre ürünleri sayfalı getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.storeId = :storeId")
    Page<Product> findByStoreId(@Param("storeId") String storeId, Pageable pageable);
    
    /**
     * Mağaza bilgisine göre ürünleri sayfalı getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.store = :store")
    Page<Product> findByStore(Store store, Pageable pageable);
    
    /**
     * Mağazaya göre düşük stoklu ürünleri getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.store = :store AND p.stock < :stockThreshold")
    List<Product> findByStoreAndStockLessThan(Store store, int stockThreshold);
    
    /**
     * En çok satılan ürünleri getirir (popülerlik sıralaması için).
     * Şimdilik stok miktarına göre sıralama yapıyor.
     */
    @Query("SELECT p FROM Product p WHERE p.status = 'AKTİF' ORDER BY p.stock DESC")
    Page<Product> findMostPopularProducts(Pageable pageable);
    
    /**
     * Sadece aktif ürünleri getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.status = 'AKTİF'")
    List<Product> findActiveProducts();
    
    /**
     * Sadece onaylanmış satıcıların aktif ürünlerini getirir.
     */
    @Query("SELECT p FROM Product p JOIN p.store s JOIN s.seller u WHERE p.status = 'AKTİF' AND u.sellerStatus IN ('APPROVED', 'ACTIVE')")
    List<Product> findActiveProductsFromApprovedSellers();
    
    /**
     * Sadece aktif ürünleri sayfalı getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.status = 'AKTİF'")
    Page<Product> findActiveProducts(Pageable pageable);
    
    /**
     * Sadece onaylanmış satıcıların aktif ürünlerini sayfalı getirir.
     */
    @Query("SELECT p FROM Product p JOIN p.store s JOIN s.seller u WHERE p.status = 'AKTİF' AND u.sellerStatus IN ('APPROVED', 'ACTIVE')")
    Page<Product> findActiveProductsFromApprovedSellers(Pageable pageable);
    
    /**
     * Mağazaya ait aktif ürünleri getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.store = :store AND p.status = 'AKTİF'")
    List<Product> findActiveProductsByStore(Store store);
    
    /**
     * Mağazaya ait aktif ürünleri sayfalı getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.store = :store AND p.status = 'AKTİF'")
    Page<Product> findActiveProductsByStore(Store store, Pageable pageable);
    
    /**
     * Duruma göre ürünleri getirir.
     */
    List<Product> findByStatus(String status);
    
    /**
     * Kategori ID'si ve mağaza ID'sine göre ürünleri getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.categoryId = :categoryId AND p.storeId = :storeId")
    List<Product> findByCategoryIdAndStoreId(@Param("categoryId") String categoryId, @Param("storeId") String storeId);
    
    /**
     * İndirimli ürünleri getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.discountPercentage IS NOT NULL AND p.discountPercentage > 0 AND p.discountEndDate > CURRENT_TIMESTAMP")
    List<Product> findDiscountedProducts();
    
    /**
     * İndirimli ürünleri sayfalı getirir.
     */
    @Query("SELECT p FROM Product p WHERE p.discountPercentage IS NOT NULL AND p.discountPercentage > 0 AND p.discountEndDate > CURRENT_TIMESTAMP")
    Page<Product> findDiscountedProducts(Pageable pageable);
    
    /**
     * Tüm ürünleri Store, Seller ve Category bilgileri ile birlikte getirir (Admin için).
     */
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.store s LEFT JOIN FETCH s.seller LEFT JOIN FETCH p.category")
    List<Product> findAllWithStoreAndSeller();
    
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
     * 9. String ID Desteği: Performans için String UUID kullanımı
     * 
     * Bu repository sayesinde ürün arama ve filtreleme işlemleri veritabanında güvenli şekilde yönetilebilir!
     */
}