package com.bahattintok.e_commerce.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.bahattintok.e_commerce.dto.ProductRequest;
import com.bahattintok.e_commerce.model.Product;

/**
 * Ürün işlemlerini yöneten servis arayüzü.
 */
public interface ProductService {
    /**
     * Tüm ürünleri getirir.
     */
    List<Product> getAllProducts();
    /**
     * ID'ye göre ürün getirir.
     */
    Product getProductById(Long id);
    /**
     * Yeni ürün oluşturur.
     */
    Product createProduct(ProductRequest request);
    /**
     * Ürünü günceller.
     */
    Product updateProduct(Long id, ProductRequest request);
    /**
     * Ürünü siler.
     */
    void deleteProduct(Long id);
    /**
     * Kategori adına göre ürünleri getirir.
     */
    List<Product> getProductsByCategory(String category);
    /**
     * Fiyat aralığına göre ürünleri getirir.
     */
    List<Product> getProductsByPriceRange(Double minPrice, Double maxPrice);
    /**
     * Fiyat aralığına göre ürünleri sayfalı getirir.
     */
    Page<Product> getProductsByPriceRange(Double minPrice, Double maxPrice, Pageable pageable);
    /**
     * Kategori ID'sine göre ürünleri getirir.
     */
    List<Product> getProductsByCategoryId(Long categoryId);
    /**
     * Tüm ürünleri sayfalı getirir.
     */
    Page<Product> getAllProducts(Pageable pageable);
    /**
     * Kategori ID'sine göre ürünleri sayfalı getirir.
     */
    Page<Product> getProductsByCategoryId(Long categoryId, Pageable pageable);
    /**
     * İsme göre arama yapar (sayfalı).
     */
    Page<Product> searchProducts(String keyword, Pageable pageable);
    /**
     * Mağaza adına göre ürünleri sayfalı getirir.
     */
    Page<Product> getProductsByStoreName(String storeName, Pageable pageable);
    
    /**
     * En popüler ürünleri getirir (en çok satılan).
     */
    Page<Product> getMostPopularProducts(Pageable pageable);
    
    /**
     * Bu interface şu işlevleri sağlar:
     * 
     * 1. Ürün CRUD İşlemleri: Ürün oluşturma, okuma, güncelleme ve silme
     * 2. Ürün Arama: İsme ve açıklamaya göre arama yapma
     * 3. Kategori Filtreleme: Kategoriye göre ürün listeleme
     * 4. Fiyat Filtreleme: Fiyat aralığına göre ürün filtreleme
     * 5. Mağaza Filtreleme: Mağazaya göre ürün listeleme
     * 6. Popülerlik Sıralaması: En çok satan ürünleri getirme
     * 7. Sayfalama Desteği: Büyük veri setleri için sayfalama
     * 8. Interface Tasarımı: Servis implementasyonları için sözleşme tanımlama
     * 
     * Bu interface sayesinde ürün yönetimi standart ve kapsamlı şekilde yapılabilir!
     */
} 