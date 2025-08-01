package com.bahattintok.e_commerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
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
        @RequestParam(value = "sort", required = false) String sort,
        @PageableDefault(size = 12) Pageable pageable
    ) {
        Page<Product> products;
        if (storeName != null && !storeName.isEmpty()) {
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
        return ResponseEntity.ok(products);
    }
    
    /**
     * ID'ye göre ürün getirir.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieve a specific product by its ID")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        Map<String, Object> dto = Map.of(
            "id", product.getId(),
            "name", product.getName(),
            "price", product.getPrice(),
            "description", product.getDescription(),
            "stock", product.getStock(),
            "imageUrl", product.getImageUrl(),
            "category", product.getCategory(),
            "storeName", product.getStore() != null ? product.getStore().getName() : null
        );
        return ResponseEntity.ok(dto);
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