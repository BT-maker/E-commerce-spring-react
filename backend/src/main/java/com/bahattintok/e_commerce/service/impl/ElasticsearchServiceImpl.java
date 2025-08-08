package com.bahattintok.e_commerce.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
            if (keyword == null || keyword.trim().isEmpty()) {
                // Boş arama durumunda tüm ürünleri döndür
                return productSearchRepository.findAll(pageable);
            }
            
            return productSearchRepository.searchByKeyword(keyword.trim(), pageable);
        } catch (Exception e) {
            log.error("Arama yapılırken hata oluştu: {}", keyword, e);
            // Hata durumunda normal SQL araması yap
            try {
                Page<Product> products = productRepository.searchProducts(keyword, pageable);
                List<ProductDocument> documents = products.getContent().stream()
                    .map(ProductDocument::fromProduct)
                    .toList();
                
                return new PageImpl<>(documents, pageable, products.getTotalElements());
            } catch (Exception sqlError) {
                log.error("SQL araması da başarısız oldu: {}", sqlError.getMessage());
                return Page.empty(pageable);
            }
        }
    }
    
    @Override
    public List<ProductDocument> advancedSearch(String query, String category, Double minPrice, Double maxPrice, String storeName) {
        if (productSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return List.of();
        }
        
        try {
            List<ProductDocument> results = List.of();
            
            // Arama kriterlerine göre ürünleri getir
            if (query != null && !query.trim().isEmpty()) {
                // Tam metin araması
                log.debug("Tam metin araması yapılıyor: {}", query);
                results = productSearchRepository.fullTextSearch(query.trim());
            } else if (category != null && !category.trim().isEmpty()) {
                // Kategori bazlı arama
                log.debug("Kategori araması yapılıyor: {}", category);
                results = productSearchRepository.findByCategoryName(category.trim());
            } else if (storeName != null && !storeName.trim().isEmpty()) {
                // Mağaza bazlı arama
                log.debug("Mağaza araması yapılıyor: {}", storeName);
                results = productSearchRepository.findByStoreNameContainingIgnoreCase(storeName.trim());
            } else {
                // Hiçbir arama kriteri yoksa veya sadece fiyat filtresi varsa tüm ürünleri getir
                log.debug("Tüm ürünler getiriliyor (fiyat filtresi için) - query: {}, category: {}, storeName: {}", query, category, storeName);
                // findAll() Iterable döndürür, Stream API ile List'e çeviriyoruz
                results = StreamSupport.stream(productSearchRepository.findAll().spliterator(), false)
                    .collect(Collectors.toList());
            }
            
            log.debug("İlk arama sonucu: {} ürün bulundu", results.size());
            
            // Fiyat filtresi uygula
            if (minPrice != null || maxPrice != null) {
                log.debug("Fiyat filtresi uygulanıyor: minPrice={}, maxPrice={}", minPrice, maxPrice);
                BigDecimal min = minPrice != null ? BigDecimal.valueOf(minPrice) : BigDecimal.ZERO;
                BigDecimal max = maxPrice != null ? BigDecimal.valueOf(maxPrice) : BigDecimal.valueOf(999999.99);
                
                int beforeFilter = results.size();
                results = results.stream()
                    .filter(product -> {
                        BigDecimal price = product.getPrice();
                        if (price == null || price.compareTo(BigDecimal.ZERO) == 0) {
                            log.debug("Ürün {} fiyatı null veya sıfır, filtreleniyor", product.getName());
                            return false;
                        }
                        
                        boolean minCheck = minPrice == null || price.compareTo(min) >= 0;
                        boolean maxCheck = maxPrice == null || price.compareTo(max) <= 0;
                        
                        if (!minCheck || !maxCheck) {
                            log.debug("Ürün {} fiyatı {} filtreleniyor (min: {}, max: {})", 
                                    product.getName(), price, min, max);
                        }
                        
                        return minCheck && maxCheck;
                    })
                    .toList();
                
                log.debug("Fiyat filtresi uygulandı: min={}, max={}, önceki={}, sonraki={} ürün", 
                         minPrice, maxPrice, beforeFilter, results.size());
            }
            
            // Mağaza filtresi uygula (eğer kategori araması yapılmadıysa)
            if (storeName != null && !storeName.trim().isEmpty() && (category == null || category.trim().isEmpty())) {
                log.debug("Mağaza filtresi uygulanıyor: {}", storeName);
                int beforeFilter = results.size();
                results = results.stream()
                    .filter(product -> product.getStoreName() != null && 
                                     product.getStoreName().toLowerCase().contains(storeName.toLowerCase()))
                    .toList();
                log.debug("Mağaza filtresi uygulandı: önceki={}, sonraki={} ürün", beforeFilter, results.size());
            }
            
            log.debug("Elasticsearch arama sonucu: {} ürün bulundu", results.size());
            return results;
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