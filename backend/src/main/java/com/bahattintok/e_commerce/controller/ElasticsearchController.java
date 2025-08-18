package com.bahattintok.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.model.ProductDocument;
import com.bahattintok.e_commerce.service.ElasticsearchService;

/**
 * Elasticsearch işlemleri için REST controller.
 * Sadece elasticsearch.enabled=true olduğunda aktif olur.
 */
@RestController
@RequestMapping("/api/elasticsearch")
@ConditionalOnProperty(name = "elasticsearch.enabled", havingValue = "true", matchIfMissing = false)
public class ElasticsearchController {
    
    @Autowired(required = false)
    private ElasticsearchService elasticsearchService;
    
    /**
     * Anahtar kelime ile arama yapar
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ProductDocument>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        if (elasticsearchService == null) {
            return ResponseEntity.ok(Page.empty(PageRequest.of(page, size)));
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDocument> results = elasticsearchService.searchByKeyword(keyword, pageable);
        
        return ResponseEntity.ok(results);
    }
    
    /**
     * Gelişmiş arama yapar
     */
    @GetMapping("/advanced-search")
    public ResponseEntity<List<ProductDocument>> advancedSearch(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String storeName) {
        
        try {
            if (elasticsearchService == null) {
                return ResponseEntity.ok(List.of());
            }
            
            List<ProductDocument> results = elasticsearchService.advancedSearch(query, category, minPrice, maxPrice, storeName);
            
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            // Elasticsearch hatası durumunda boş liste döndür
            return ResponseEntity.ok(List.of());
        }
    }
    
    /**
     * Benzer ürünleri bulur
     */
    @GetMapping("/similar-products")
    public ResponseEntity<List<ProductDocument>> findSimilarProducts(
            @RequestParam String categoryName,
            @RequestParam String excludeProductId) {
        
        if (elasticsearchService == null) {
            return ResponseEntity.ok(List.of());
        }
        
        List<ProductDocument> results = elasticsearchService.findSimilarProducts(categoryName, excludeProductId);
        
        return ResponseEntity.ok(results);
    }
    
    /**
     * Popüler ürünleri getirir
     */
    @GetMapping("/popular-products")
    public ResponseEntity<List<ProductDocument>> findPopularProducts() {
        if (elasticsearchService == null) {
            return ResponseEntity.ok(List.of());
        }
        
        List<ProductDocument> results = elasticsearchService.findPopularProducts();
        
        return ResponseEntity.ok(results);
    }
    
    /**
     * İndirimli ürünleri getirir
     */
    @GetMapping("/discounted-products")
    public ResponseEntity<List<ProductDocument>> findDiscountedProducts() {
        if (elasticsearchService == null) {
            return ResponseEntity.ok(List.of());
        }
        
        List<ProductDocument> results = elasticsearchService.findDiscountedProducts();
        
        return ResponseEntity.ok(results);
    }
    
    /**
     * Elasticsearch durumunu kontrol eder
     */
    @GetMapping("/status")
    public ResponseEntity<Boolean> getStatus() {
        try {
            if (elasticsearchService == null) {
                return ResponseEntity.ok(false);
            }
            
            boolean isAvailable = elasticsearchService.isElasticsearchAvailable();
            
            return ResponseEntity.ok(isAvailable);
        } catch (Exception e) {
            // Elasticsearch bağlantı hatası durumunda false döndür
            return ResponseEntity.ok(false);
        }
    }

    /**
     * Manuel olarak tüm ürünleri Elasticsearch'e indexler
     */
    @PostMapping("/reindex")
    public ResponseEntity<String> reindexAllProducts() {
        try {
            if (elasticsearchService == null) {
                return ResponseEntity.ok("Elasticsearch servisi mevcut değil");
            }
            
            elasticsearchService.indexAllProducts();
            return ResponseEntity.ok("Tüm ürünler başarıyla indexlendi!");
        } catch (Exception e) {
            return ResponseEntity.ok("Indexleme hatası: " + e.getMessage());
        }
    }
    
    /**
     * Elasticsearch test endpoint'i
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        try {
            if (elasticsearchService == null) {
                return ResponseEntity.ok("Elasticsearch service is null");
            }
            
            boolean isAvailable = elasticsearchService.isElasticsearchAvailable();
            
            if (isAvailable) {
                return ResponseEntity.ok("Elasticsearch is available and working");
            } else {
                return ResponseEntity.ok("Elasticsearch is not available");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("Elasticsearch error: " + e.getMessage());
        }
    }
    
    /**
     * Tüm ürünleri Elasticsearch'e indexler (Admin only)
     */
    @PostMapping("/index-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> indexAllProducts() {
        if (elasticsearchService == null) {
            return ResponseEntity.ok("Elasticsearch is not enabled");
        }
        
        elasticsearchService.indexAllProducts();
        
        return ResponseEntity.ok("Tüm ürünler başarıyla indexlendi");
    }
    
    /**
     * Index'i yeniden oluşturur (Admin only)
     */
    @PostMapping("/recreate-index")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> recreateIndex() {
        if (elasticsearchService == null) {
            return ResponseEntity.ok("Elasticsearch is not enabled");
        }
        
        elasticsearchService.recreateIndex();
        
        return ResponseEntity.ok("Index başarıyla yeniden oluşturuldu");
    }
} 