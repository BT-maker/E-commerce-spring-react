package com.bahattintok.e_commerce.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.ProductDocument;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.service.ProductSearchService;

import lombok.extern.slf4j.Slf4j;

/**
 * ProductSearchService implementasyonu.
 * Bu servis, Elasticsearch ile entegre arama işlemlerini sağlar.
 */
@Service
@Slf4j
public class ProductSearchServiceImpl implements ProductSearchService {
    
    @Autowired
    private ProductRepository productRepository;
    
    // TODO: Elasticsearch repository'si eklenecek
    // @Autowired
    // private ProductSearchRepository productSearchRepository;
    
    @Override
    public void indexAllProducts() {
        log.info("Tüm ürünler Elasticsearch'e indexleniyor...");
        List<Product> products = productRepository.findAll();
        
        // TODO: Elasticsearch indexleme işlemi eklenecek
        // List<ProductDocument> documents = products.stream()
        //     .map(ProductDocument::fromProduct)
        //     .collect(Collectors.toList());
        // productSearchRepository.saveAll(documents);
        
        log.info("{} ürün indexlendi", products.size());
    }
    
    @Override
    public void indexProduct(Product product) {
        log.info("Ürün indexleniyor: {}", product.getName());
        
        // TODO: Elasticsearch indexleme işlemi eklenecek
        // ProductDocument document = ProductDocument.fromProduct(product);
        // productSearchRepository.save(document);
    }
    
    @Override
    public void deleteProduct(String productId) {
        log.info("Ürün Elasticsearch'ten siliniyor: {}", productId);
        
        // TODO: Elasticsearch silme işlemi eklenecek
        // productSearchRepository.deleteById(productId);
    }
    
    @Override
    public List<Product> searchProducts(String keyword) {
        log.info("Elasticsearch'te arama yapılıyor: {}", keyword);
        
        // TODO: Elasticsearch arama işlemi eklenecek
        // List<ProductDocument> documents = productSearchRepository.findByNameContainingIgnoreCase(keyword);
        // return documents.stream()
        //     .map(this::convertToProduct)
        //     .collect(Collectors.toList());
        
        // Şimdilik normal SQL araması yapıyoruz
        return productRepository.searchProducts(keyword, null).getContent();
    }
    
    @Override
    public List<Product> searchByCategory(String categoryName) {
        log.info("Kategoriye göre arama: {}", categoryName);
        
        // TODO: Elasticsearch kategori araması eklenecek
        // List<ProductDocument> documents = productSearchRepository.findByCategoryNameContainingIgnoreCase(categoryName);
        // return documents.stream()
        //     .map(this::convertToProduct)
        //     .collect(Collectors.toList());
        
        // Şimdilik normal SQL araması yapıyoruz
        return productRepository.findByCategory(categoryName);
    }
    
    @Override
    public List<Product> searchByStore(String storeName) {
        log.info("Mağazaya göre arama: {}", storeName);
        
        // TODO: Elasticsearch mağaza araması eklenecek
        // List<ProductDocument> documents = productSearchRepository.findByStoreNameContainingIgnoreCase(storeName);
        // return documents.stream()
        //     .map(this::convertToProduct)
        //     .collect(Collectors.toList());
        
        // Şimdilik boş liste döndürüyoruz
        return List.of();
    }
    
    @Override
    public List<Product> searchByPriceRange(Double minPrice, Double maxPrice) {
        log.info("Fiyat aralığına göre arama: {} - {}", minPrice, maxPrice);
        
        // TODO: Elasticsearch fiyat araması eklenecek
        // List<ProductDocument> documents = productSearchRepository.findByPriceBetween(minPrice, maxPrice);
        // return documents.stream()
        //     .map(this::convertToProduct)
        //     .collect(Collectors.toList());
        
        // Şimdilik normal SQL araması yapıyoruz
        return productRepository.findByPriceRange(minPrice, maxPrice);
    }
    
    @Override
    public boolean isElasticsearchAvailable() {
        // TODO: Elasticsearch bağlantı kontrolü eklenecek
        // try {
        //     return productSearchRepository.count() >= 0;
        // } catch (Exception e) {
        //     return false;
        // }
        
        // Şimdilik false döndürüyoruz
        return false;
    }
    
    /**
     * ProductDocument'i Product'a çevirir.
     */
    private Product convertToProduct(ProductDocument document) {
        // TODO: ProductDocument'ten Product'a çevirme işlemi eklenecek
        return productRepository.findById(document.getId()).orElse(null);
    }
} 