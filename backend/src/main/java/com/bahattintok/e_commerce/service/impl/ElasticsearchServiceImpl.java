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

import com.bahattintok.e_commerce.model.Category;
import com.bahattintok.e_commerce.model.CategoryDocument;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.ProductDocument;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.StoreDocument;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.model.UserDocument;
import com.bahattintok.e_commerce.repository.CategoryRepository;
import com.bahattintok.e_commerce.repository.CategorySearchRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.ProductSearchRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.repository.StoreSearchRepository;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.repository.UserSearchRepository;
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
    
    @Autowired(required = false)
    private CategorySearchRepository categorySearchRepository;
    
    @Autowired(required = false)
    private StoreSearchRepository storeSearchRepository;
    
    @Autowired(required = false)
    private UserSearchRepository userSearchRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private StoreRepository storeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
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
    
    // ==================== CATEGORY METHODS ====================
    
    @Override
    public void indexAllCategories() {
        if (categorySearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping category indexing");
            return;
        }
        
        try {
            log.info("Tüm kategoriler Elasticsearch'e indexleniyor...");
            List<Category> categories = categoryRepository.findAll();
            
            for (Category category : categories) {
                indexCategory(category);
            }
            
            log.info("{} kategori başarıyla indexlendi", categories.size());
        } catch (Exception e) {
            log.error("Kategoriler indexlenirken hata oluştu", e);
        }
    }
    
    @Override
    public void indexCategory(Category category) {
        if (categorySearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping category indexing");
            return;
        }
        
        try {
            CategoryDocument document = CategoryDocument.fromCategory(category);
            categorySearchRepository.save(document);
            log.debug("Kategori indexlendi: {}", category.getName());
        } catch (Exception e) {
            log.error("Kategori indexlenirken hata oluştu: {}", category.getName(), e);
        }
    }
    
    @Override
    public void deleteCategory(String categoryId) {
        if (categorySearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping category deletion");
            return;
        }
        
        try {
            categorySearchRepository.deleteById(categoryId);
            log.debug("Kategori Elasticsearch'ten silindi: {}", categoryId);
        } catch (Exception e) {
            log.error("Kategori silinirken hata oluştu: {}", categoryId, e);
        }
    }
    
    @Override
    public void updateCategory(Category category) {
        if (categorySearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping category update");
            return;
        }
        
        try {
            CategoryDocument document = CategoryDocument.fromCategory(category);
            categorySearchRepository.save(document);
            log.debug("Kategori güncellendi: {}", category.getName());
        } catch (Exception e) {
            log.error("Kategori güncellenirken hata oluştu: {}", category.getName(), e);
        }
    }
    
    @Override
    public Page<CategoryDocument> searchCategoriesByKeyword(String keyword, Pageable pageable) {
        if (categorySearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return Page.empty(pageable);
        }
        
        try {
            if (keyword == null || keyword.trim().isEmpty()) {
                return categorySearchRepository.findAll(pageable);
            }
            
            return categorySearchRepository.searchByKeyword(keyword.trim(), pageable);
        } catch (Exception e) {
            log.error("Kategori araması yapılırken hata oluştu: {}", keyword, e);
            return Page.empty(pageable);
        }
    }
    
    @Override
    public List<CategoryDocument> findPopularCategories() {
        if (categorySearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return List.of();
        }
        
        try {
            return categorySearchRepository.findPopularCategories();
        } catch (Exception e) {
            log.error("Popüler kategoriler aranırken hata oluştu", e);
            return List.of();
        }
    }
    
    // ==================== STORE METHODS ====================
    
    @Override
    public void indexAllStores() {
        if (storeSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping store indexing");
            return;
        }
        
        try {
            log.info("Tüm mağazalar Elasticsearch'e indexleniyor...");
            List<Store> stores = storeRepository.findAll();
            
            for (Store store : stores) {
                indexStore(store);
            }
            
            log.info("{} mağaza başarıyla indexlendi", stores.size());
        } catch (Exception e) {
            log.error("Mağazalar indexlenirken hata oluştu", e);
        }
    }
    
    @Override
    public void indexStore(Store store) {
        if (storeSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping store indexing");
            return;
        }
        
        try {
            StoreDocument document = StoreDocument.fromStore(store);
            storeSearchRepository.save(document);
            log.debug("Mağaza indexlendi: {}", store.getName());
        } catch (Exception e) {
            log.error("Mağaza indexlenirken hata oluştu: {}", store.getName(), e);
        }
    }
    
    @Override
    public void deleteStore(String storeId) {
        if (storeSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping store deletion");
            return;
        }
        
        try {
            storeSearchRepository.deleteById(storeId);
            log.debug("Mağaza Elasticsearch'ten silindi: {}", storeId);
        } catch (Exception e) {
            log.error("Mağaza silinirken hata oluştu: {}", storeId, e);
        }
    }
    
    @Override
    public void updateStore(Store store) {
        if (storeSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping store update");
            return;
        }
        
        try {
            StoreDocument document = StoreDocument.fromStore(store);
            storeSearchRepository.save(document);
            log.debug("Mağaza güncellendi: {}", store.getName());
        } catch (Exception e) {
            log.error("Mağaza güncellenirken hata oluştu: {}", store.getName(), e);
        }
    }
    
    @Override
    public Page<StoreDocument> searchStoresByKeyword(String keyword, Pageable pageable) {
        if (storeSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return Page.empty(pageable);
        }
        
        try {
            if (keyword == null || keyword.trim().isEmpty()) {
                return storeSearchRepository.findAll(pageable);
            }
            
            return storeSearchRepository.searchByKeyword(keyword.trim(), pageable);
        } catch (Exception e) {
            log.error("Mağaza araması yapılırken hata oluştu: {}", keyword, e);
            return Page.empty(pageable);
        }
    }
    
    @Override
    public List<StoreDocument> findPopularStores() {
        if (storeSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return List.of();
        }
        
        try {
            return storeSearchRepository.findPopularStores();
        } catch (Exception e) {
            log.error("Popüler mağazalar aranırken hata oluştu", e);
            return List.of();
        }
    }
    
    // ==================== USER METHODS ====================
    
    @Override
    public void indexAllUsers() {
        if (userSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping user indexing");
            return;
        }
        
        try {
            log.info("Tüm kullanıcılar Elasticsearch'e indexleniyor...");
            List<User> users = userRepository.findAll();
            
            for (User user : users) {
                indexUser(user);
            }
            
            log.info("{} kullanıcı başarıyla indexlendi", users.size());
        } catch (Exception e) {
            log.error("Kullanıcılar indexlenirken hata oluştu", e);
        }
    }
    
    @Override
    public void indexUser(User user) {
        if (userSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping user indexing");
            return;
        }
        
        try {
            UserDocument document = UserDocument.fromUser(user);
            userSearchRepository.save(document);
            log.debug("Kullanıcı indexlendi: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Kullanıcı indexlenirken hata oluştu: {}", user.getEmail(), e);
        }
    }
    
    @Override
    public void deleteUser(String userId) {
        if (userSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping user deletion");
            return;
        }
        
        try {
            userSearchRepository.deleteById(userId);
            log.debug("Kullanıcı Elasticsearch'ten silindi: {}", userId);
        } catch (Exception e) {
            log.error("Kullanıcı silinirken hata oluştu: {}", userId, e);
        }
    }
    
    @Override
    public void updateUser(User user) {
        if (userSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, skipping user update");
            return;
        }
        
        try {
            UserDocument document = UserDocument.fromUser(user);
            userSearchRepository.save(document);
            log.debug("Kullanıcı güncellendi: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Kullanıcı güncellenirken hata oluştu: {}", user.getEmail(), e);
        }
    }
    
    @Override
    public Page<UserDocument> searchUsersByKeyword(String keyword, Pageable pageable) {
        if (userSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return Page.empty(pageable);
        }
        
        try {
            if (keyword == null || keyword.trim().isEmpty()) {
                return userSearchRepository.findAll(pageable);
            }
            
            return userSearchRepository.searchByKeyword(keyword.trim(), pageable);
        } catch (Exception e) {
            log.error("Kullanıcı araması yapılırken hata oluştu: {}", keyword, e);
            return Page.empty(pageable);
        }
    }
    
    @Override
    public List<UserDocument> findSellers() {
        if (userSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return List.of();
        }
        
        try {
            return userSearchRepository.findByRoleOrderByRegistrationDateDesc("SELLER");
        } catch (Exception e) {
            log.error("Satıcılar aranırken hata oluştu", e);
            return List.of();
        }
    }
    
    @Override
    public List<UserDocument> findPendingSellers() {
        if (userSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return List.of();
        }
        
        try {
            return userSearchRepository.findByRoleAndSellerStatusOrderBySellerApplicationDateDesc("SELLER", "PENDING");
        } catch (Exception e) {
            log.error("Onay bekleyen satıcılar aranırken hata oluştu", e);
            return List.of();
        }
    }
    
    @Override
    public List<UserDocument> findTopCustomers() {
        if (userSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return List.of();
        }
        
        try {
            return userSearchRepository.findTopCustomers();
        } catch (Exception e) {
            log.error("En çok sipariş veren kullanıcılar aranırken hata oluştu", e);
            return List.of();
        }
    }
    
    @Override
    public List<UserDocument> findTopSpenders() {
        if (userSearchRepository == null) {
            log.warn("Elasticsearch is not enabled, returning empty results");
            return List.of();
        }
        
        try {
            return userSearchRepository.findTopSpenders();
        } catch (Exception e) {
            log.error("En çok harcama yapan kullanıcılar aranırken hata oluştu", e);
            return List.of();
        }
    }
} 