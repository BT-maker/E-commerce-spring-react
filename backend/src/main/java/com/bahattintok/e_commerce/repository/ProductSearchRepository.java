package com.bahattintok.e_commerce.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.ProductDocument;

/**
 * Elasticsearch için Product search repository'si.
 * Bu repository, ürün arama işlemlerini Elasticsearch'te yapar.
 * Sadece elasticsearch.enabled=true olduğunda aktif olur.
 */
@Repository
@ConditionalOnProperty(name = "elasticsearch.enabled", havingValue = "true", matchIfMissing = false)
public interface ProductSearchRepository extends ElasticsearchRepository<ProductDocument, String> {
    
    /**
     * İsme göre arama yapar.
     */
    List<ProductDocument> findByNameContainingIgnoreCase(String name);
    
    /**
     * Açıklamaya göre arama yapar.
     */
    List<ProductDocument> findByDescriptionContainingIgnoreCase(String description);
    
    /**
     * Kategori adına göre arama yapar.
     */
    List<ProductDocument> findByCategoryNameContainingIgnoreCase(String categoryName);
    
    /**
     * Mağaza adına göre arama yapar.
     */
    List<ProductDocument> findByStoreNameContainingIgnoreCase(String storeName);
    
    /**
     * Fiyat aralığına göre arama yapar.
     */
    List<ProductDocument> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    /**
     * Stok durumuna göre arama yapar.
     */
    List<ProductDocument> findByStockGreaterThan(Integer minStock);
    
    /**
     * İndirimli ürünleri getirir.
     */
    List<ProductDocument> findByDiscountPercentageGreaterThan(Integer minDiscount);
    
    /**
     * Gelişmiş arama - çoklu alan araması
     */
    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"name^2\", \"description\", \"categoryName\", \"storeName\"], \"fuzziness\": \"AUTO\"}}")
    Page<ProductDocument> searchByKeyword(String keyword, Pageable pageable);
    
    /**
     * Filtreli arama - kategori ve fiyat aralığı
     */
    @Query("{\"bool\": {\"must\": [{\"match\": {\"categoryName\": \"?0\"}}, {\"range\": {\"price\": {\"gte\": ?1, \"lte\": ?2}}}]}}")
    List<ProductDocument> findByCategoryAndPriceRange(String categoryName, BigDecimal minPrice, BigDecimal maxPrice);
    
    /**
     * Tam metin araması
     */
    @Query("{\"query_string\": {\"query\": \"*?0*\", \"fields\": [\"name^3\", \"description^2\", \"categoryName\", \"storeName\"]}}")
    List<ProductDocument> fullTextSearch(String query);
    
    /**
     * Benzer ürün arama (aynı kategoride)
     */
    @Query("{\"bool\": {\"must\": [{\"term\": {\"categoryName\": \"?0\"}}, {\"bool\": {\"must_not\": [{\"term\": {\"id\": ?1}}]}}]}}")
    List<ProductDocument> findSimilarProducts(String categoryName, String excludeProductId);
    
    /**
     * Popüler ürünler (stok durumuna göre)
     */
    @Query("{\"bool\": {\"must\": [{\"range\": {\"stock\": {\"gt\": 0}}}]}, \"sort\": [{\"stock\": {\"order\": \"desc\"}}]}")
    List<ProductDocument> findPopularProducts();
    
    /**
     * İndirimli ürünler
     */
    @Query("{\"bool\": {\"must\": [{\"range\": {\"discountPercentage\": {\"gt\": 0}}}]}, \"sort\": [{\"discountPercentage\": {\"order\": \"desc\"}}]}")
    List<ProductDocument> findDiscountedProducts();
} 