package com.bahattintok.e_commerce.service;

import java.util.List;

import com.bahattintok.e_commerce.model.Product;

/**
 * Ürün arama işlemlerini yöneten servis arayüzü.
 * Bu servis, Elasticsearch ile entegre arama işlemlerini sağlar.
 */
public interface ProductSearchService {
    
    /**
     * Tüm ürünleri Elasticsearch'e indexler.
     */
    void indexAllProducts();
    
    /**
     * Tek bir ürünü Elasticsearch'e indexler.
     */
    void indexProduct(Product product);
    
    /**
     * Ürünü Elasticsearch'ten siler.
     */
    void deleteProduct(String productId);
    
    /**
     * Elasticsearch'te arama yapar.
     */
    List<Product> searchProducts(String keyword);
    
    /**
     * Kategoriye göre arama yapar.
     */
    List<Product> searchByCategory(String categoryName);
    
    /**
     * Mağazaya göre arama yapar.
     */
    List<Product> searchByStore(String storeName);
    
    /**
     * Fiyat aralığına göre arama yapar.
     */
    List<Product> searchByPriceRange(Double minPrice, Double maxPrice);
    
    /**
     * Elasticsearch bağlantısını kontrol eder.
     */
    boolean isElasticsearchAvailable();
} 