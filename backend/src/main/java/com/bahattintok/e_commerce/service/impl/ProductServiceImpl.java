package com.bahattintok.e_commerce.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.dto.ProductRequest;
import com.bahattintok.e_commerce.model.Category;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.CategoryRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.ElasticsearchService;
import com.bahattintok.e_commerce.service.ProductService;

import lombok.RequiredArgsConstructor;

/**
 * Ürün işlemlerini yöneten servis implementasyonu.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    
    @Autowired(required = false)
    private ElasticsearchService elasticsearchService;
    
    /**
     * Tüm ürünleri getirir (sadece onaylanmış satıcıların).
     */
    @Override
    public List<Product> getAllProducts() {
        return productRepository.findActiveProductsFromApprovedSellers();
    }
    
    /**
     * Tüm ürünleri sayfalı getirir (sadece onaylanmış satıcıların).
     */
    @Override
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findActiveProductsFromApprovedSellers(pageable);
    }
    
    /**
     * ID'ye göre ürün getirir.
     */
    @Override
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    /**
     * Yeni ürün oluşturur.
     */
    @Override
    public Product createProduct(ProductRequest request) {
        // Mevcut kullanıcıyı al
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        // Kullanıcının mağazasını bul
        Store store = storeRepository.findBySeller(currentUser)
                .orElseThrow(() -> new RuntimeException("Mağaza bulunamadı"));
        
        // Satıcı onay kontrolü
        if (currentUser.getSellerStatus() == null || 
            (!currentUser.getSellerStatus().name().equals("APPROVED") && 
             !currentUser.getSellerStatus().name().equals("ACTIVE"))) {
            throw new RuntimeException("Ürün yayınlamak için satıcı hesabınızın onaylanmış olması gerekiyor. Lütfen admin onayını bekleyin.");
        }
        
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setImageUrl1(request.getImageUrl1());
        product.setImageUrl2(request.getImageUrl2());
        product.setImageUrl3(request.getImageUrl3());
        product.setImageUrl4(request.getImageUrl4());
        product.setImageUrl5(request.getImageUrl5());
        product.setStoreId(store.getId()); // Mağaza ID'sini set et
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);
        
        Product savedProduct = productRepository.save(product);
        
        // Elasticsearch'e indexle (eğer varsa)
        if (elasticsearchService != null) {
            try {
                elasticsearchService.indexProduct(savedProduct);
            } catch (Exception e) {
                // Elasticsearch hatası ürün oluşturmayı engellemez
                System.err.println("Elasticsearch indexing failed: " + e.getMessage());
            }
        }
        
        return savedProduct;
    }
    
    /**
     * Ürünü günceller.
     */
    @Override
    public Product updateProduct(String id, ProductRequest request) {
        Product product = getProductById(id);
        
        // Mevcut kullanıcıyı al
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        // Kullanıcının mağazasını bul
        Store store = storeRepository.findBySeller(currentUser)
                .orElseThrow(() -> new RuntimeException("Mağaza bulunamadı"));
        
        // Satıcı onay kontrolü
        if (currentUser.getSellerStatus() == null || 
            (!currentUser.getSellerStatus().name().equals("APPROVED") && 
             !currentUser.getSellerStatus().name().equals("ACTIVE"))) {
            throw new RuntimeException("Ürün güncellemek için satıcı hesabınızın onaylanmış olması gerekiyor. Lütfen admin onayını bekleyin.");
        }
        
        // Ürünün bu satıcıya ait olduğunu kontrol et
        if (!store.getId().equals(product.getStoreId())) {
            throw new RuntimeException("Bu ürünü güncelleme yetkiniz yok");
        }
        
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setImageUrl1(request.getImageUrl1());
        product.setImageUrl2(request.getImageUrl2());
        product.setImageUrl3(request.getImageUrl3());
        product.setImageUrl4(request.getImageUrl4());
        product.setImageUrl5(request.getImageUrl5());
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);
        
        Product updatedProduct = productRepository.save(product);
        
        // Elasticsearch'i güncelle (eğer varsa)
        if (elasticsearchService != null) {
            try {
                elasticsearchService.updateProduct(updatedProduct);
            } catch (Exception e) {
                // Elasticsearch hatası ürün güncellemeyi engellemez
                System.err.println("Elasticsearch update failed: " + e.getMessage());
            }
        }
        
        return updatedProduct;
    }
    
    /**
     * Ürünü siler.
     */
    @Override
    public void deleteProduct(String id) {
        Product product = getProductById(id);
        
        // Mevcut kullanıcıyı al
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        User currentUser = userRepository.findByEmail(currentUsername)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        // Kullanıcının mağazasını bul
        Store store = storeRepository.findBySeller(currentUser)
                .orElseThrow(() -> new RuntimeException("Mağaza bulunamadı"));
        
        // Satıcı onay kontrolü
        if (currentUser.getSellerStatus() == null || 
            (!currentUser.getSellerStatus().name().equals("APPROVED") && 
             !currentUser.getSellerStatus().name().equals("ACTIVE"))) {
            throw new RuntimeException("Ürün silmek için satıcı hesabınızın onaylanmış olması gerekiyor. Lütfen admin onayını bekleyin.");
        }
        
        // Ürünün bu satıcıya ait olduğunu kontrol et
        if (!store.getId().equals(product.getStoreId())) {
            throw new RuntimeException("Bu ürünü silme yetkiniz yok");
        }
        
        // Önce Elasticsearch'ten sil (eğer varsa)
        if (elasticsearchService != null) {
            try {
                elasticsearchService.deleteProduct(id);
            } catch (Exception e) {
                // Elasticsearch hatası ürün silmeyi engellemez
                System.err.println("Elasticsearch delete failed: " + e.getMessage());
            }
        }
        
        productRepository.deleteById(id);
    }
    
    /**
     * Kategori adına göre ürünleri getirir (sadece onaylanmış satıcıların).
     */
    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .filter(product -> "AKTİF".equals(product.getStatus()) && product.isSellerApproved())
                .collect(Collectors.toList());
    }
    
    /**
     * İsme göre arama yapar (sayfalı, sadece onaylanmış satıcıların).
     */
    @Override
    public Page<Product> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.searchProducts(keyword, pageable);
        List<Product> activeProducts = products.getContent().stream()
                .filter(product -> "AKTİF".equals(product.getStatus()) && product.isSellerApproved())
                .collect(Collectors.toList());
        return new PageImpl<>(activeProducts, pageable, activeProducts.size());
    }
    
    /**
     * Fiyat aralığına göre ürünleri getirir.
     */
    @Override
    public List<Product> getProductsByPriceRange(Double minPrice, Double maxPrice) {
        return productRepository.findByPriceRange(minPrice, maxPrice).stream()
                .filter(product -> "AKTİF".equals(product.getStatus()))
                .collect(Collectors.toList());
    }
    
    /**
     * Fiyat aralığına göre ürünleri sayfalı getirir.
     */
    @Override
    public Page<Product> getProductsByPriceRange(Double minPrice, Double maxPrice, Pageable pageable) {
        Page<Product> products = productRepository.findByPriceRange(minPrice, maxPrice, pageable);
        List<Product> activeProducts = products.getContent().stream()
                .filter(product -> "AKTİF".equals(product.getStatus()))
                .collect(Collectors.toList());
        return new PageImpl<>(activeProducts, pageable, activeProducts.size());
    }
    
    /**
     * Kategori ID'sine göre ürünleri getirir.
     */
    @Override
    public List<Product> getProductsByCategoryId(String categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .filter(product -> "AKTİF".equals(product.getStatus()))
                .collect(Collectors.toList());
    }
    
    /**
     * Kategori ID'sine göre ürünleri sayfalı getirir.
     */
    @Override
    public Page<Product> getProductsByCategoryId(String categoryId, Pageable pageable) {
        Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);
        List<Product> activeProducts = products.getContent().stream()
                .filter(product -> "AKTİF".equals(product.getStatus()))
                .collect(Collectors.toList());
        return new PageImpl<>(activeProducts, pageable, activeProducts.size());
    }
    
    /**
     * Mağaza adına göre ürünleri sayfalı getirir.
     */
    @Override
    public Page<Product> getProductsByStoreName(String storeName, Pageable pageable) {
        var storeOpt = storeRepository.findByNameIgnoreCase(storeName);
        if (storeOpt.isEmpty()) return Page.empty(pageable);
        return productRepository.findActiveProductsByStore(storeOpt.get(), pageable);
    }
    
    /**
     * Mağaza ID'sine göre ürünleri sayfalı getirir.
     */
    @Override
    public Page<Product> getProductsByStoreId(String storeId, Pageable pageable) {
        return productRepository.findByStoreId(storeId, pageable);
    }
    
    @Override
    public Page<Product> getMostPopularProducts(Pageable pageable) {
        Page<Product> products = productRepository.findMostPopularProducts(pageable);
        List<Product> activeProducts = products.getContent().stream()
                .filter(product -> "AKTİF".equals(product.getStatus()))
                .collect(Collectors.toList());
        return new PageImpl<>(activeProducts, pageable, activeProducts.size());
    }

    /**
     * Mevcut satıcının ürünlerini getirir.
     */
    @Override
    public List<Product> getProductsByCurrentSeller() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                throw new RuntimeException("User not authenticated");
            }
            
            String username = authentication.getName();
            System.out.println("Current user: " + username);
            
            User currentUser = userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
            
            System.out.println("Found user: " + currentUser.getUsername() + ", Role: " + currentUser.getRole());
            
            // Satıcının mağazasını bul
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + username));
            
            System.out.println("Found store: " + sellerStore.getName() + " for seller: " + username);
            
            // Mağazaya ait ürünleri getir (tümünü almak için Pageable.unpaged() kullan)
            List<Product> products = productRepository.findByStore(sellerStore, Pageable.unpaged()).getContent();
            System.out.println("Found " + products.size() + " products for store: " + sellerStore.getName());
            
            return products;
        } catch (Exception e) {
            System.err.println("Error in getProductsByCurrentSeller: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Ürün durumunu değiştirir (AKTİF/PASİF).
     */
    @Override
    public Product toggleProductStatus(String productId) {
        Product product = getProductById(productId);
        
        // Mevcut durumu kontrol et ve değiştir
        if ("AKTİF".equals(product.getStatus())) {
            product.setStatus("PASİF");
        } else {
            product.setStatus("AKTİF");
        }
        
        return productRepository.save(product);
    }
    
    /**
     * İndirimli ürünleri sayfalı getirir.
     */
    @Override
    public Page<Product> getDiscountedProducts(Pageable pageable) {
        return productRepository.findDiscountedProducts(pageable);
    }
    
    /**
     * Bu servis şu işlevleri sağlar:
     * 
     * 1. Ürün CRUD İşlemleri: Ürün oluşturma, okuma, güncelleme ve silme
     * 2. Ürün Arama: İsme ve açıklamaya göre arama yapma
     * 3. Kategori Filtreleme: Kategoriye göre ürün listeleme
     * 4. Fiyat Filtreleme: Fiyat aralığına göre ürün filtreleme
     * 5. Mağaza Filtreleme: Mağazaya göre ürün listeleme
     * 6. Popülerlik Sıralaması: En çok satan ürünleri getirme
     * 7. Sayfalama Desteği: Büyük veri setleri için sayfalama
     * 8. Hata Yönetimi: Ürün bulunamadığında uygun exception fırlatma
     * 
     * Bu servis sayesinde ürün yönetimi kapsamlı ve güvenli şekilde yapılabilir!
     */
} 