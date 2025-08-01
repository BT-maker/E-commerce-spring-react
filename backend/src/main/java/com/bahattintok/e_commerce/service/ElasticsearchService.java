package com.bahattintok.e_commerce.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.ProductDocument;

/**
 * Elasticsearch işlemleri için servis interface'i.
 */
public interface ElasticsearchService {
    
    /**
     * Tüm ürünleri Elasticsearch'e indexler
     */
    void indexAllProducts();
    
    /**
     * Tek bir ürünü Elasticsearch'e indexler
     */
    void indexProduct(Product product);
    
    /**
     * Ürünü Elasticsearch'ten siler
     */
    void deleteProduct(String productId);
    
    /**
     * Ürünü Elasticsearch'te günceller
     */
    void updateProduct(Product product);
    
    /**
     * Anahtar kelime ile arama yapar
     */
    Page<ProductDocument> searchByKeyword(String keyword, Pageable pageable);
    
    /**
     * Gelişmiş arama yapar
     */
    List<ProductDocument> advancedSearch(String query, String category, Double minPrice, Double maxPrice, String storeName);
    
    /**
     * Benzer ürünleri bulur
     */
    List<ProductDocument> findSimilarProducts(String categoryName, String excludeProductId);
    
    /**
     * Popüler ürünleri getirir
     */
    List<ProductDocument> findPopularProducts();
    
    /**
     * İndirimli ürünleri getirir
     */
    List<ProductDocument> findDiscountedProducts();
    
    /**
     * Elasticsearch bağlantısını kontrol eder
     */
    boolean isElasticsearchAvailable();
    
    /**
     * Index'i yeniden oluşturur
     */
    void recreateIndex();
} 