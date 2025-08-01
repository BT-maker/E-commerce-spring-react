package com.bahattintok.e_commerce.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.ProductDocument;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.ProductSearchRepository;
import com.bahattintok.e_commerce.service.ElasticsearchService;

import lombok.extern.slf4j.Slf4j;

/**
 * Elasticsearch servisi implementasyonu.
 * Sadece elasticsearch.enabled=true olduğunda aktif olur.
 */
@Service
@Transactional
@Slf4j
@ConditionalOnProperty(name = "elasticsearch.enabled", havingValue = "true", matchIfMissing = false)
public class ElasticsearchServiceImpl implements ElasticsearchService {
    
    @Autowired(required = false)
    private ProductSearchRepository productSearchRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Override
    public void indexAllProducts() {
        if (productSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping indexing");
            return;
        }
        
        try {
            log.info("Tüm ürünler Elasticsearch'e indexleniyor...");
            List<Product> products = productRepository.findAll();
            
            for (Product product : products) {
                indexProduct(product);
            }
            
            log.info("{} ürün başarıyla indexlendi", products.size());
        } catch (Exception e) {
            log.error("Ürünler indexlenirken hata oluştu", e);
        }
    }
    
    @Override
    public void indexProduct(Product product) {
        if (productSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping product indexing");
            return;
        }
        
        try {
            ProductDocument document = ProductDocument.fromProduct(product);
            productSearchRepository.save(document);
            log.debug("Ürün indexlendi: {}", product.getName());
        } catch (Exception e) {
            log.error("Ürün indexlenirken hata oluştu: {}", product.getName(), e);
        }
    }
    
    @Override
    public void deleteProduct(String productId) {
        if (productSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping product deletion");
            return;
        }
        
        try {
            productSearchRepository.deleteById(productId);
            log.debug("Ürün Elasticsearch'ten silindi: {}", productId);
        } catch (Exception e) {
            log.error("Ürün silinirken hata oluştu: {}", productId, e);
        }
    }
    
    @Override
    public void updateProduct(Product product) {
        if (productSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping product update");
            return;
        }
        
        try {
            ProductDocument document = ProductDocument.fromProduct(product);
            productSearchRepository.save(document);
            log.debug("Ürün güncellendi: {}", product.getName());
        } catch (Exception e) {
            log.error("Ürün güncellenirken hata oluştu: {}", product.getName(), e);
        }
    }
    
    @Override
    public Page<ProductDocument> searchByKeyword(String keyword, Pageable pageable) {
        if (productSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return Page.empty(pageable);
        }
        
        try {
            return productSearchRepository.searchByKeyword(keyword, pageable);
        } catch (Exception e) {
            log.error("Arama yapılırken hata oluştu: {}", keyword, e);
            return Page.empty(pageable);
        }
    }
    
    @Override
    public List<ProductDocument> advancedSearch(String query, String category, Double minPrice, Double maxPrice, String storeName) {
        if (productSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return List.of();
        }
        
        try {
            if (query != null && !query.trim().isEmpty()) {
                return productSearchRepository.fullTextSearch(query);
            } else if (category != null && !category.trim().isEmpty()) {
                // Kategori bazlı arama
                return productSearchRepository.findByCategoryNameContainingIgnoreCase(category);
            } else if (storeName != null && !storeName.trim().isEmpty()) {
                // Mağaza bazlı arama
                return productSearchRepository.findByStoreNameContainingIgnoreCase(storeName);
            }
            
            return (List<ProductDocument>) productSearchRepository.findAll();
        } catch (Exception e) {
            log.error("Gelişmiş arama yapılırken hata oluştu", e);
            return List.of();
        }
    }
    
    @Override
    public List<ProductDocument> findSimilarProducts(String categoryName, String excludeProductId) {
        if (productSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return List.of();
        }
        
        try {
            return productSearchRepository.findSimilarProducts(categoryName, excludeProductId);
        } catch (Exception e) {
            log.error("Benzer ürünler aranırken hata oluştu", e);
            return List.of();
        }
    }
    
    @Override
    public List<ProductDocument> findPopularProducts() {
        if (productSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return List.of();
        }
        
        try {
            return productSearchRepository.findPopularProducts();
        } catch (Exception e) {
            log.error("Popüler ürünler aranırken hata oluştu", e);
            return List.of();
        }
    }
    
    @Override
    public List<ProductDocument> findDiscountedProducts() {
        if (productSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return List.of();
        }
        
        try {
            return productSearchRepository.findDiscountedProducts();
        } catch (Exception e) {
            log.error("İndirimli ürünler aranırken hata oluştu", e);
            return List.of();
        }
    }
    
    @Override
    public boolean isElasticsearchAvailable() {
        if (productSearchRepository == null) {
            return false;
        }
        
        try {
            productSearchRepository.count();
            return true;
        } catch (Exception e) {
            log.warn("Elasticsearch bağlantısı yok: {}", e.getMessage());
            return false;
        }
    }
    
    @Override
    public void recreateIndex() {
        if (productSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping index recreation");
            return;
        }
        
        try {
            log.info("Elasticsearch index'i yeniden oluşturuluyor...");
            
            // Mevcut index'i temizle
            productSearchRepository.deleteAll();
            
            // Tüm ürünleri yeniden indexle
            indexAllProducts();
            
            log.info("Index başarıyla yeniden oluşturuldu");
        } catch (Exception e) {
            log.error("Index yeniden oluşturulurken hata oluştu", e);
        }
    }
} 