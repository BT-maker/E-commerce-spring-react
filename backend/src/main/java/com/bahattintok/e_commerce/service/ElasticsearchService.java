package com.bahattintok.e_commerce.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.bahattintok.e_commerce.model.Category;
import com.bahattintok.e_commerce.model.CategoryDocument;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.ProductDocument;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.StoreDocument;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.model.UserDocument;

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
    
    // ==================== CATEGORY METHODS ====================
    
    /**
     * Tüm kategorileri Elasticsearch'e indexler
     */
    void indexAllCategories();
    
    /**
     * Tek bir kategoriyi Elasticsearch'e indexler
     */
    void indexCategory(Category category);
    
    /**
     * Kategoriyi Elasticsearch'ten siler
     */
    void deleteCategory(String categoryId);
    
    /**
     * Kategoriyi Elasticsearch'te günceller
     */
    void updateCategory(Category category);
    
    /**
     * Kategori araması yapar
     */
    Page<CategoryDocument> searchCategoriesByKeyword(String keyword, Pageable pageable);
    
    /**
     * Popüler kategorileri getirir
     */
    List<CategoryDocument> findPopularCategories();
    
    // ==================== STORE METHODS ====================
    
    /**
     * Tüm mağazaları Elasticsearch'e indexler
     */
    void indexAllStores();
    
    /**
     * Tek bir mağazayı Elasticsearch'e indexler
     */
    void indexStore(Store store);
    
    /**
     * Mağazayı Elasticsearch'ten siler
     */
    void deleteStore(String storeId);
    
    /**
     * Mağazayı Elasticsearch'te günceller
     */
    void updateStore(Store store);
    
    /**
     * Mağaza araması yapar
     */
    Page<StoreDocument> searchStoresByKeyword(String keyword, Pageable pageable);
    
    /**
     * Popüler mağazaları getirir
     */
    List<StoreDocument> findPopularStores();
    
    // ==================== USER METHODS ====================
    
    /**
     * Tüm kullanıcıları Elasticsearch'e indexler
     */
    void indexAllUsers();
    
    /**
     * Tek bir kullanıcıyı Elasticsearch'e indexler
     */
    void indexUser(User user);
    
    /**
     * Kullanıcıyı Elasticsearch'ten siler
     */
    void deleteUser(String userId);
    
    /**
     * Kullanıcıyı Elasticsearch'te günceller
     */
    void updateUser(User user);
    
    /**
     * Kullanıcı araması yapar
     */
    Page<UserDocument> searchUsersByKeyword(String keyword, Pageable pageable);
    
    /**
     * Satıcıları getirir
     */
    List<UserDocument> findSellers();
    
    /**
     * Onay bekleyen satıcıları getirir
     */
    List<UserDocument> findPendingSellers();
    
    /**
     * En çok sipariş veren kullanıcıları getirir
     */
    List<UserDocument> findTopCustomers();
    
    /**
     * En çok harcama yapan kullanıcıları getirir
     */
    List<UserDocument> findTopSpenders();
} 