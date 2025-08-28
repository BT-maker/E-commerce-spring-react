package com.bahattintok.e_commerce.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.dto.ProductRequest;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.service.ProductSearchService;
import com.bahattintok.e_commerce.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Ürün CRUD ve listeleme işlemlerini yöneten controller.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management APIs")
public class ProductController {
    
    private final ProductService productService;
    private final StoreRepository storeRepository;
    private final ProductSearchService productSearchService;
    
    /**
     * Ürünleri getirir (arama, kategori ve sayfalama destekler).
     */
    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieve all available products")
    public ResponseEntity<Page<Product>> getAllProducts(
        @RequestParam(value = "categoryId", required = false) String categoryId,
        @RequestParam(value = "search", required = false) String search,
        @RequestParam(value = "minPrice", required = false) Double minPrice,
        @RequestParam(value = "maxPrice", required = false) Double maxPrice,
        @RequestParam(value = "storeName", required = false) String storeName,
        @RequestParam(value = "storeId", required = false) String storeId,
        @RequestParam(value = "sort", required = false) String sort,
        @RequestParam(value = "includeInactive", required = false, defaultValue = "false") Boolean includeInactive,
        @PageableDefault(size = 12) Pageable pageable
    ) {
        try {
            Page<Product> products;
            if (storeId != null && !storeId.isEmpty()) {
                products = productService.getProductsByStoreId(storeId, pageable);
            } else if (storeName != null && !storeName.isEmpty()) {
                products = productService.getProductsByStoreName(storeName, pageable);
            } else if (search != null && !search.isEmpty()) {
                products = productService.searchProducts(search, pageable);
            } else if (minPrice != null && maxPrice != null) {
                // Fiyat aralığı ve sayfalama
                products = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);
            } else if (categoryId != null) {
                products = productService.getProductsByCategoryId(categoryId, pageable);
            } else if ("popular".equals(sort)) {
                // Popüler ürünler
                products = productService.getMostPopularProducts(pageable);
            } else {
                products = productService.getAllProducts(pageable);
            }
            
            // Eğer includeInactive false ise sadece aktif ürünleri filtrele
            if (!includeInactive) {
                List<Product> activeProducts = products.getContent().stream()
                    .filter(product -> "AKTİF".equals(product.getStatus()))
                    .collect(Collectors.toList());
                
                // Yeni bir Page nesnesi oluştur
                products = new PageImpl<>(activeProducts, pageable, activeProducts.size());
            }
            
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.err.println("Ürün listesi alınırken hata: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new PageImpl<>(new ArrayList<>(), pageable, 0));
        }
    }
    
    /**
     * İndirimli ürünleri getirir.
     */
    @GetMapping("/discounted")
    @Operation(summary = "Get discounted products", description = "Retrieve all products with active discounts")
    public ResponseEntity<Page<Product>> getDiscountedProducts(
        @PageableDefault(size = 12) Pageable pageable
    ) {
        Page<Product> discountedProducts = productService.getDiscountedProducts(pageable);
        return ResponseEntity.ok(discountedProducts);
    }
    
    /**
     * ID'ye göre ürün getirir.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieve a specific product by its ID")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable String id) {
        try {
            Product product = productService.getProductById(id);
            
            // Map.of sınırlı sayıda parametre alabilir ve null değerleri kabul etmez
            // Bu nedenle HashMap kullanarak daha esnek bir yaklaşım uygulayalım
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", product.getId());
            dto.put("name", product.getName());
            dto.put("price", product.getPrice());
            dto.put("description", product.getDescription());
            dto.put("stock", product.getStock());
            dto.put("imageUrl", product.getImageUrl());
            dto.put("imageUrl1", product.getImageUrl1());
            dto.put("imageUrl2", product.getImageUrl2());
            dto.put("imageUrl3", product.getImageUrl3());
            dto.put("imageUrl4", product.getImageUrl4());
            dto.put("imageUrl5", product.getImageUrl5());
            
            // Category bilgisini güvenli bir şekilde ekle
            if (product.getCategory() != null) {
                Map<String, Object> categoryMap = new HashMap<>();
                categoryMap.put("id", product.getCategory().getId());
                categoryMap.put("name", product.getCategory().getName());
                dto.put("category", categoryMap);
            } else {
                dto.put("category", null);
            }
            
            dto.put("storeName", product.getStore() != null ? product.getStore().getName() : null);
            dto.put("storeId", product.getStoreId());
            
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            // Hata durumunda detaylı log ve uygun hata yanıtı
            System.err.println("Ürün detayı alınırken hata: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Ürün detayı alınamadı: " + e.getMessage()));
        }
    }
    
    /**
     * Satıcının kendi ürünlerini getirir.
     */
    @GetMapping("/my-products")
    @PreAuthorize("hasRole('SELLER')")
    @Operation(summary = "Get seller's own products", description = "Retrieve products belonging to the authenticated seller")
    public ResponseEntity<List<Product>> getMyProducts() {
        List<Product> products = productService.getProductsByCurrentSeller();
        return ResponseEntity.ok(products);
    }

    /**
     * Elasticsearch'te arama yapar.
     */
    @GetMapping("/search/elastic")
    @Operation(summary = "Search products with Elasticsearch", description = "Search products using Elasticsearch")
    public ResponseEntity<List<Product>> searchWithElasticsearch(@RequestParam String keyword) {
        List<Product> products = productSearchService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }
    
    /**
     * Tüm ürünleri Elasticsearch'e indexler.
     */
    @PostMapping("/index-all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Index all products to Elasticsearch", description = "Index all products to Elasticsearch (Admin only)")
    public ResponseEntity<String> indexAllProducts() {
        productSearchService.indexAllProducts();
        return ResponseEntity.ok("Tüm ürünler Elasticsearch'e indexlendi");
    }
    
    /**
     * Elasticsearch durumunu kontrol eder.
     */
    @GetMapping("/elasticsearch/status")
    @Operation(summary = "Check Elasticsearch status", description = "Check if Elasticsearch is available")
    public ResponseEntity<Map<String, Object>> checkElasticsearchStatus() {
        boolean isAvailable = productSearchService.isElasticsearchAvailable();
        Map<String, Object> status = Map.of(
            "available", isAvailable,
            "message", isAvailable ? "Elasticsearch çalışıyor" : "Elasticsearch çalışmıyor"
        );
        return ResponseEntity.ok(status);
    }
    
    /**
     * Yeni ürün oluşturur (sadece admin).
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create product", description = "Create a new product (Admin only)")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequest request) {
        Product product = productService.createProduct(request);
        return ResponseEntity.ok(product);
    }
    
    /**
     * Ürünü günceller (sadece admin).
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product", description = "Update an existing product (Admin only)")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @Valid @RequestBody ProductRequest request) {
        Product product = productService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }
    
    /**
     * Ürünü siler (sadece admin).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete product", description = "Delete a product (Admin only)")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Ürün durumunu değiştirir (AKTİF/PASİF).
     */
    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    @Operation(summary = "Toggle product status", description = "Toggle product status between active and inactive")
    public ResponseEntity<Product> toggleProductStatus(@PathVariable String id) {
        Product product = productService.toggleProductStatus(id);
        return ResponseEntity.ok(product);
    }
    
    /**
     * Kategoriye göre ürünleri getirir.
     */
    @GetMapping("/category/{category}")
    @Operation(summary = "Get products by category", description = "Retrieve products filtered by category")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }
    
    /**
     * Fiyat aralığına göre ürünleri getirir.
     */
    @GetMapping("/price-range")
    @Operation(summary = "Get products by price range", description = "Retrieve products within a price range")
    public ResponseEntity<List<Product>> getProductsByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        List<Product> products = productService.getProductsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(products);
    }
    
    /**
     * Tüm mağazaları getirir.
     */
    @GetMapping("/stores")
    @Operation(summary = "Get all stores", description = "Retrieve all available stores")
    public ResponseEntity<List<Map<String, Object>>> getAllStores() {
        List<Store> stores = storeRepository.findAll();
        List<Map<String, Object>> storeDtos = stores.stream()
            .map(store -> Map.of(
                "id", (Object) store.getId(),
                "name", (Object) store.getName()
            ))
            .toList();
        return ResponseEntity.ok(storeDtos);
    }
    
    /**
     * Bu controller şu işlevleri sağlar:
     * 
     * 1. Ürün Listeleme: Tüm ürünleri getirir (GET /api/products) - Arama, filtreleme ve sayfalama destekler
     * 2. Ürün Detayı: ID'ye göre ürün bilgilerini getirir (GET /api/products/{id})
     * 3. Ürün Oluşturma: Yeni ürün ekler (POST /api/products) - Sadece ADMIN
     * 4. Ürün Güncelleme: Mevcut ürünü düzenler (PUT /api/products/{id}) - Sadece ADMIN
     * 5. Ürün Silme: Ürünü kaldırır (DELETE /api/products/{id}) - Sadece ADMIN
     * 6. Kategori Filtreleme: Kategoriye göre ürünleri getirir (GET /api/products/category/{category})
     * 7. Fiyat Filtreleme: Fiyat aralığına göre ürünleri getirir (GET /api/products/price-range)
     * 8. Mağaza Listesi: Tüm mağazaları getirir (GET /api/products/stores)
     * 
     * Bu controller sayesinde ürünler yönetilebilir, aranabilir ve filtrelenebilir!
     */
}