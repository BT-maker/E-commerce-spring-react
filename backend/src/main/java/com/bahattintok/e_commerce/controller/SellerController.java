package com.bahattintok.e_commerce.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bahattintok.e_commerce.event.OrderStatusChangedEvent;
import com.bahattintok.e_commerce.model.Campaign;
import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.OrderItem;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Review;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.CampaignRepository;
import com.bahattintok.e_commerce.repository.OrderRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.ReviewRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.ElasticsearchService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/seller")
@Tag(name = "Seller", description = "Seller management endpoints")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SellerController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CampaignRepository campaignRepository;
    
    @Autowired(required = false)
    private ElasticsearchService elasticsearchService;
    
    @Autowired
    private org.springframework.context.ApplicationEventPublisher eventPublisher;

    // Ürün CRUD Endpoint'leri

    @GetMapping("/test")
    @Operation(summary = "Test endpoint", description = "Simple test endpoint to check if API is working")
    public ResponseEntity<Map<String, String>> testEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Seller API is working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/fix-store-ids")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Fix store IDs", description = "Fix null store IDs for seller's products")
    public ResponseEntity<Map<String, Object>> fixStoreIds() {
        try {
            System.out.println("=== FIX STORE IDS DEBUG ===");
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            System.out.println("Current user email: " + email);
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            System.out.println("Seller store ID: " + sellerStore.getId());
            
            // Tüm ürünleri çek
            List<Product> allProducts = productRepository.findAll();
            System.out.println("Total products in DB: " + allProducts.size());
            
            int fixedCount = 0;
            List<String> fixedProducts = new ArrayList<>();
            
            for (Product product : allProducts) {
                if (product.getStoreId() == null) {
                    System.out.println("Fixing product: " + product.getName() + " (ID: " + product.getId() + ")");
                    product.setStoreId(sellerStore.getId());
                    product.setStore(sellerStore);
                    productRepository.save(product);
                    fixedCount++;
                    fixedProducts.add(product.getName());
                }
            }
            
            System.out.println("Fixed " + fixedCount + " products");
            System.out.println("=== END FIX STORE IDS DEBUG ===");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Store IDs fixed successfully");
            response.put("fixedCount", fixedCount);
            response.put("fixedProducts", fixedProducts);
            response.put("sellerStoreId", sellerStore.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error in fixStoreIds: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Store ID'leri düzeltilirken hata oluştu");
            errorResponse.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/products")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Get seller's products", description = "Retrieve all products belonging to the authenticated seller with pagination")
    public ResponseEntity<Map<String, Object>> getSellerProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            System.out.println("=== GET SELLER PRODUCTS DEBUG ===");
            System.out.println("Page: " + page + ", Size: " + size);
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            System.out.println("Current user email: " + email);
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            System.out.println("Found user: " + currentUser.getEmail() + ", Role: " + currentUser.getRole().getName());
            
            if (!currentUser.getRole().getName().equals("SELLER") && !currentUser.getRole().isSeller()) {
                System.out.println("User is not a seller, returning 403");
                return ResponseEntity.status(403).build();
            }
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            System.out.println("Found store: " + sellerStore.getName() + " (ID: " + sellerStore.getId() + ")");
            
            // Tüm ürünleri çek ve debug et
            List<Product> allProducts = productRepository.findAll();
            System.out.println("Total products in DB: " + allProducts.size());
            
            // Her ürünün store ID'sini ve status'unu kontrol et
            System.out.println("=== STORE ID AND STATUS DEBUG ===");
            for (Product p : allProducts) {
                System.out.println("Product: " + p.getName() + " | Store ID: " + p.getStoreId() + " | Status: " + p.getStatus() + " | Looking for: " + sellerStore.getId());
            }
            System.out.println("=== END STORE ID AND STATUS DEBUG ===");
            
            // Store ID'sine göre ürünleri filtrele
            List<Product> sellerProducts = allProducts.stream()
                .filter(p -> p.getStoreId() != null && p.getStoreId().equals(sellerStore.getId()))
                .collect(java.util.stream.Collectors.toList());
            
            // Alternatif olarak ProductRepository'nin yeni metodunu kullan
            // List<Product> sellerProducts = productRepository.findActiveProductsByStore(sellerStore);
            
            System.out.println("Found " + sellerProducts.size() + " products for seller");
            System.out.println("Seller store ID: " + sellerStore.getId());
            
            // Status bilgilerini kontrol et
            System.out.println("=== STATUS DEBUG ===");
            for (Product p : sellerProducts) {
                System.out.println("Product: " + p.getName() + " | Status: " + p.getStatus());
            }
            System.out.println("=== END STATUS DEBUG ===");
            
            // Sayfalama hesaplamaları
            int totalProducts = sellerProducts.size();
            int totalPages = (int) Math.ceil((double) totalProducts / size);
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, totalProducts);
            
            // Sayfa için ürünleri al
            List<Product> productsForPage = sellerProducts.subList(startIndex, endIndex);
            
            System.out.println("Returning " + productsForPage.size() + " products for page " + page);
            System.out.println("Total pages: " + totalPages);
            System.out.println("=== END GET SELLER PRODUCTS DEBUG ===");
            
            Map<String, Object> response = new HashMap<>();
            response.put("products", productsForPage);
            response.put("currentPage", page);
            response.put("totalPages", totalPages);
            response.put("totalProducts", totalProducts);
            response.put("pageSize", size);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error in getSellerProducts: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Ürünler çekilirken hata oluştu");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Add new product", description = "Add a new product to the seller's store")
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            System.out.println("=== ADD PRODUCT DEBUG ===");
            System.out.println("Received product data: " + product);
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            System.out.println("Current user email: " + email);
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            System.out.println("Found user: " + currentUser.getEmail() + ", Role: " + currentUser.getRole().getName());
            
            if (!currentUser.getRole().getName().equals("SELLER") && !currentUser.getRole().isSeller()) {
                System.out.println("User is not a seller, returning 403");
                return ResponseEntity.status(403).build();
            }
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            System.out.println("Found store: " + sellerStore.getName() + " (ID: " + sellerStore.getId() + ")");
            
            product.setStore(sellerStore);
            
            // Category ID'yi doğru şekilde set et
            if (product.getCategory() != null && product.getCategory().getId() != null) {
                product.setCategoryId(product.getCategory().getId());
                System.out.println("Category ID set to: " + product.getCategory().getId());
            } else {
                System.out.println("WARNING: Category is null or has no ID!");
            }
            
            // Store ID'yi de set et
            product.setStoreId(sellerStore.getId());
            System.out.println("Store ID set to: " + sellerStore.getId());
            
            System.out.println("Product before save: " + product);
            
            Product savedProduct = productRepository.save(product);
            System.out.println("Product saved successfully: " + savedProduct);
            
            // Elasticsearch'e indexle (eğer varsa)
            if (elasticsearchService != null) {
                try {
                    elasticsearchService.indexProduct(savedProduct);
                    System.out.println("Product indexed to Elasticsearch successfully");
                } catch (Exception e) {
                    System.err.println("Elasticsearch indexing failed: " + e.getMessage());
                    // Elasticsearch hatası ürün oluşturmayı engellemez
                }
            } else {
                System.out.println("Elasticsearch service not available, skipping indexing");
            }
            
            System.out.println("=== END ADD PRODUCT DEBUG ===");
            
            return ResponseEntity.ok(savedProduct);
            
        } catch (Exception e) {
            System.err.println("=== ERROR IN ADD PRODUCT ===");
            System.err.println("Error message: " + e.getMessage());
            System.err.println("Error type: " + e.getClass().getSimpleName());
            System.err.println("Error cause: " + (e.getCause() != null ? e.getCause().getMessage() : "No cause"));
            e.printStackTrace();
            
            // Daha detaylı hata mesajı döndür
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to add product: " + e.getMessage());
            errorResponse.put("message", e.getMessage());
            errorResponse.put("timestamp", java.time.LocalDateTime.now().toString());
            errorResponse.put("details", e.getClass().getSimpleName());
            errorResponse.put("cause", e.getCause() != null ? e.getCause().getMessage() : "No cause");
            
            System.err.println("Sending error response: " + errorResponse);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Update product", description = "Update an existing product")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product product) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            if (!currentUser.getRole().getName().equals("SELLER") && !currentUser.getRole().isSeller()) {
                return ResponseEntity.status(403).build();
            }
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            Product existingProduct = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + id));
            
            // Ürünün bu satıcıya ait olduğunu kontrol et
            if (!existingProduct.getStore().getId().equals(sellerStore.getId())) {
                return ResponseEntity.status(403).build();
            }
            
            // Ürün bilgilerini güncelle
            existingProduct.setName(product.getName());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setStock(product.getStock());
            existingProduct.setImageUrl(product.getImageUrl());
            existingProduct.setImageUrl1(product.getImageUrl1());
            existingProduct.setCategory(product.getCategory());
            
            // Category ID'yi doğru şekilde set et
            if (product.getCategory() != null && product.getCategory().getId() != null) {
                existingProduct.setCategoryId(product.getCategory().getId());
                System.out.println("Category ID updated to: " + product.getCategory().getId());
            } else {
                System.out.println("WARNING: Category is null or has no ID!");
            }
            
            // Store ID'yi de güncelle
            existingProduct.setStoreId(sellerStore.getId());
            System.out.println("Store ID updated to: " + sellerStore.getId());
            
            Product updatedProduct = productRepository.save(existingProduct);
            
            // Elasticsearch'i güncelle (eğer varsa)
            if (elasticsearchService != null) {
                try {
                    elasticsearchService.updateProduct(updatedProduct);
                    System.out.println("Product updated in Elasticsearch successfully");
                } catch (Exception e) {
                    System.err.println("Elasticsearch update failed: " + e.getMessage());
                    // Elasticsearch hatası ürün güncellemeyi engellemez
                }
            } else {
                System.out.println("Elasticsearch service not available, skipping update");
            }
            
            return ResponseEntity.ok(updatedProduct);
            
        } catch (Exception e) {
            System.err.println("Error in updateProduct: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Delete product", description = "Delete a product from the seller's store")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        try {
            System.out.println("=== DELETE PRODUCT DEBUG ===");
            System.out.println("Product ID to delete: " + id);
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            System.out.println("Current user email: " + email);
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            System.out.println("Found user: " + currentUser.getEmail() + ", Role: " + currentUser.getRole().getName());
            
            if (!currentUser.getRole().getName().equals("SELLER") && !currentUser.getRole().isSeller()) {
                System.out.println("User is not a seller, returning 403");
                return ResponseEntity.status(403).build();
            }
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            System.out.println("Found store: " + sellerStore.getName() + " (ID: " + sellerStore.getId() + ")");
            
            // Ürünün bu satıcıya ait olup olmadığını kontrol et
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + id));
            
            if (!sellerStore.getId().equals(product.getStoreId())) {
                System.out.println("Product does not belong to this seller, returning 403");
                return ResponseEntity.status(403).build();
            }
            
            System.out.println("Product found: " + product.getName() + " (ID: " + product.getId() + ")");
            System.out.println("Product store ID: " + product.getStoreId());
            System.out.println("Seller store ID: " + sellerStore.getId());
            
            productRepository.deleteById(id);
            System.out.println("Product deleted successfully");
            
            // Elasticsearch'ten de sil (eğer varsa)
            if (elasticsearchService != null) {
                try {
                    elasticsearchService.deleteProduct(id);
                    System.out.println("Product deleted from Elasticsearch successfully");
                } catch (Exception e) {
                    System.err.println("Elasticsearch deletion failed: " + e.getMessage());
                    // Elasticsearch hatası ürün silmeyi engellemez
                }
            } else {
                System.out.println("Elasticsearch service not available, skipping deletion");
            }
            
            System.out.println("=== END DELETE PRODUCT DEBUG ===");
            
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            System.err.println("=== ERROR IN DELETE PRODUCT ===");
            System.err.println("Error message: " + e.getMessage());
            System.err.println("Error type: " + e.getClass().getSimpleName());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete product: " + e.getMessage());
        }
    }
    
    /**
     * Ürün durumunu değiştirir (AKTİF/PASİF).
     */
    @PutMapping("/products/{id}/toggle-status")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Toggle product status", description = "Toggle product status between active and inactive")
    public ResponseEntity<Product> toggleProductStatus(@PathVariable String id) {
        try {
            System.out.println("=== TOGGLE PRODUCT STATUS DEBUG ===");
            System.out.println("Product ID to toggle: " + id);
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            System.out.println("Current user email: " + email);
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            System.out.println("Found user: " + currentUser.getEmail() + ", Role: " + currentUser.getRole().getName());
            
            if (!currentUser.getRole().getName().equals("SELLER") && !currentUser.getRole().isSeller()) {
                System.out.println("User is not a seller, returning 403");
                return ResponseEntity.status(403).build();
            }
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            System.out.println("Found store: " + sellerStore.getName() + " (ID: " + sellerStore.getId() + ")");
            
            // Ürünün bu satıcıya ait olup olmadığını kontrol et
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + id));
            
            if (!sellerStore.getId().equals(product.getStoreId())) {
                System.out.println("Product does not belong to this seller, returning 403");
                return ResponseEntity.status(403).build();
            }
            
            System.out.println("Product found: " + product.getName() + " (ID: " + product.getId() + ")");
            System.out.println("Current status: " + product.getStatus());
            
            // Durumu değiştir
            if ("AKTİF".equals(product.getStatus())) {
                product.setStatus("PASİF");
                System.out.println("Status changed to: PASİF");
            } else {
                product.setStatus("AKTİF");
                System.out.println("Status changed to: AKTİF");
            }
            
            Product updatedProduct = productRepository.save(product);
            System.out.println("Product status updated successfully");
            
            // Elasticsearch'i güncelle (eğer varsa)
            if (elasticsearchService != null) {
                try {
                    elasticsearchService.indexProduct(updatedProduct);
                    System.out.println("Product updated in Elasticsearch successfully");
                } catch (Exception e) {
                    System.err.println("Elasticsearch update failed: " + e.getMessage());
                    // Elasticsearch hatası ürün güncellemeyi engellemez
                }
            } else {
                System.out.println("Elasticsearch service not available, skipping update");
            }
            
            System.out.println("=== END TOGGLE PRODUCT STATUS DEBUG ===");
            
            return ResponseEntity.ok(updatedProduct);
            
        } catch (Exception e) {
            System.err.println("=== ERROR IN TOGGLE PRODUCT STATUS ===");
            System.err.println("Error message: " + e.getMessage());
            System.err.println("Error type: " + e.getClass().getSimpleName());
            e.printStackTrace();
            throw new RuntimeException("Failed to toggle product status: " + e.getMessage());
        }
    }

    // Mevcut Dashboard Endpoint'leri

    @GetMapping("/stats")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Get seller statistics", description = "Retrieve statistics for the authenticated seller")
    public ResponseEntity<Map<String, Object>> getSellerStats(
            @RequestParam(defaultValue = "week") String period) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            if (!currentUser.getRole().getName().equals("SELLER") && !currentUser.getRole().isSeller()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Access denied. User is not a seller.");
                return ResponseEntity.status(403).body(error);
            }
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Get seller's products
            List<Product> sellerProducts = productRepository.findByStore(sellerStore, org.springframework.data.domain.Pageable.unpaged()).getContent();
            int totalProducts = sellerProducts.size();
            
            // Get all orders and filter by seller's products
            List<Order> allOrders = orderRepository.findAll();
            List<Order> sellerOrders = new ArrayList<>();
            Set<String> uniqueCustomers = new HashSet<>();
            double totalRevenue = 0.0;
            int totalSales = 0;
            
            for (Order order : allOrders) {
                boolean hasSellerProduct = false;
                double orderRevenue = 0.0;
                
                for (OrderItem item : order.getItems()) {
                    if (item.getProduct().getStore() != null && 
                        item.getProduct().getStore().getId().equals(sellerStore.getId())) {
                        hasSellerProduct = true;
                        orderRevenue += item.getPrice().doubleValue() * item.getQuantity();
                        totalSales += item.getQuantity();
                    }
                }
                
                if (hasSellerProduct) {
                    sellerOrders.add(order);
                    totalRevenue += orderRevenue;
                    uniqueCustomers.add(order.getUser().getId());
                }
            }
            
            int totalOrders = sellerOrders.size();
            int totalCustomers = uniqueCustomers.size();
            
            // Calculate average order value
            double averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0.0;
            
            // Calculate average rating for seller's products
            double averageRating = calculateAverageRating(sellerProducts);
            
            // Generate real chart data based on period
            List<Map<String, Object>> salesData = generateRealSalesData(sellerOrders, period);
            List<Map<String, Object>> revenueData = generateRealRevenueData(sellerOrders, period);
            List<Map<String, Object>> categoryData = generateRealCategoryData(sellerProducts, sellerOrders);
            
            // Get top product and category
            Map<String, Object> topProduct = getTopProduct(sellerProducts, sellerOrders);
            Map<String, Object> topCategory = getTopCategory(categoryData);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalProducts", totalProducts);
            stats.put("totalSales", totalSales);
            stats.put("totalCustomers", totalCustomers);
            stats.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
            stats.put("totalOrders", totalOrders);
            stats.put("averageRating", Math.round(averageRating * 10.0) / 10.0);
            stats.put("averageOrderValue", Math.round(averageOrderValue * 100.0) / 100.0);
            
            // Chart data
            stats.put("salesData", salesData);
            stats.put("revenueData", revenueData);
            stats.put("categoryData", categoryData);
            
            // Top performers
            stats.put("topProduct", topProduct);
            stats.put("topCategory", topCategory);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            System.err.println("Error in getSellerStats: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get seller statistics: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Helper methods for generating real chart data
    private double calculateAverageRating(List<Product> products) {
        if (products.isEmpty()) return 0.0;
        
        double totalRating = 0.0;
        int reviewCount = 0;
        
        for (Product product : products) {
            List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(product.getId());
            for (Review review : reviews) {
                totalRating += review.getRating();
                reviewCount++;
            }
        }
        
        return reviewCount > 0 ? totalRating / reviewCount : 0.0;
    }

    private List<Map<String, Object>> generateRealSalesData(List<Order> orders, String period) {
        List<Map<String, Object>> data = new ArrayList<>();
        int days = period.equals("week") ? 7 : period.equals("month") ? 30 : 365;
        
        // Group orders by date
        Map<String, Integer> dailySales = new HashMap<>();
        
        for (Order order : orders) {
            String dateKey = getDateLabel(period, order.getCreatedAt());
            int salesCount = order.getItems().size();
            dailySales.put(dateKey, dailySales.getOrDefault(dateKey, 0) + salesCount);
        }
        
        // Fill in missing dates with 0
        for (int i = days - 1; i >= 0; i--) {
            String dateLabel = getDateLabel(period, i);
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", dateLabel);
            dayData.put("count", dailySales.getOrDefault(dateLabel, 0));
            data.add(dayData);
        }
        
        return data;
    }

    private List<Map<String, Object>> generateRealRevenueData(List<Order> orders, String period) {
        List<Map<String, Object>> data = new ArrayList<>();
        int days = period.equals("week") ? 7 : period.equals("month") ? 30 : 365;
        
        // Group orders by date
        Map<String, Double> dailyRevenue = new HashMap<>();
        
        for (Order order : orders) {
            String dateKey = getDateLabel(period, order.getCreatedAt());
            double orderRevenue = order.getTotalPrice().doubleValue();
            dailyRevenue.put(dateKey, dailyRevenue.getOrDefault(dateKey, 0.0) + orderRevenue);
        }
        
        // Fill in missing dates with 0
        for (int i = days - 1; i >= 0; i--) {
            String dateLabel = getDateLabel(period, i);
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", dateLabel);
            dayData.put("amount", Math.round(dailyRevenue.getOrDefault(dateLabel, 0.0) * 100.0) / 100.0);
            data.add(dayData);
        }
        
        return data;
    }

    private List<Map<String, Object>> generateRealCategoryData(List<Product> products, List<Order> orders) {
        List<Map<String, Object>> data = new ArrayList<>();
        
        // Count sales by category from orders
        Map<String, Integer> categorySales = new HashMap<>();
        
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                if (product.getCategory() != null) {
                    String categoryName = product.getCategory().getName();
                    categorySales.put(categoryName, categorySales.getOrDefault(categoryName, 0) + item.getQuantity());
                }
            }
        }
        
        // Convert to list format
        for (Map.Entry<String, Integer> entry : categorySales.entrySet()) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("categoryName", entry.getKey());
            categoryData.put("salesCount", entry.getValue());
            data.add(categoryData);
        }
        
        return data;
    }

    private String getDateLabel(String period, int daysAgo) {
        java.time.LocalDate date = java.time.LocalDate.now().minusDays(daysAgo);
        
        if (period.equals("week")) {
            return date.getDayOfWeek().getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale.forLanguageTag("tr"));
        } else if (period.equals("month")) {
            return date.getDayOfMonth() + "/" + date.getMonthValue();
        } else {
            return date.getMonth().getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale.forLanguageTag("tr"));
        }
    }

    private String getDateLabel(String period, java.time.LocalDateTime dateTime) {
        java.time.LocalDate date = dateTime.toLocalDate();
        
        if (period.equals("week")) {
            return date.getDayOfWeek().getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale.forLanguageTag("tr"));
        } else if (period.equals("month")) {
            return date.getDayOfMonth() + "/" + date.getMonthValue();
        } else {
            return date.getMonth().getDisplayName(java.time.format.TextStyle.SHORT, java.util.Locale.forLanguageTag("tr"));
        }
    }

    private Map<String, Object> getTopProduct(List<Product> products, List<Order> orders) {
        if (products.isEmpty()) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("name", "Veri yok");
            empty.put("salesCount", 0);
            return empty;
        }
        
        // Count sales for each product
        Map<String, Integer> productSales = new HashMap<>();
        
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                String productId = item.getProduct().getId();
                productSales.put(productId, productSales.getOrDefault(productId, 0) + item.getQuantity());
            }
        }
        
        // Find top selling product
        String topProductId = productSales.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(null);
        
        if (topProductId != null) {
            Product topProduct = products.stream()
                .filter(p -> p.getId().equals(topProductId))
                .findFirst()
                .orElse(products.get(0));
            
            Map<String, Object> result = new HashMap<>();
            result.put("name", topProduct.getName());
            result.put("salesCount", productSales.get(topProductId));
            return result;
        } else {
            Product topProduct = products.get(0);
            Map<String, Object> result = new HashMap<>();
            result.put("name", topProduct.getName());
            result.put("salesCount", 0);
            return result;
        }
    }

    private Map<String, Object> getTopCategory(List<Map<String, Object>> categoryData) {
        if (categoryData.isEmpty()) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("name", "Veri yok");
            empty.put("salesCount", 0);
            return empty;
        }
        
        return categoryData.stream()
            .max((a, b) -> Integer.compare((Integer) a.get("salesCount"), (Integer) b.get("salesCount")))
            .orElse(categoryData.get(0));
    }

    @GetMapping("/recent-orders")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Get recent orders", description = "Retrieve recent orders for the authenticated seller")
    public ResponseEntity<List<Order>> getRecentOrders() {
        try {
            // For demo purposes, return all orders
            // In real app, you'd filter by seller's store
            List<Order> recentOrders = orderRepository.findAll();
            return ResponseEntity.ok(recentOrders);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/welcome-dashboard")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Get welcome dashboard data", description = "Retrieve welcome dashboard data for the authenticated seller")
    public ResponseEntity<Map<String, Object>> getWelcomeDashboard() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            System.out.println("Welcome Dashboard - Current user email: " + email);
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            System.out.println("Found user: " + currentUser.getEmail() + ", Role: " + currentUser.getRole().getName()); // Debug log
            
            // Check if user is a seller
            if (!currentUser.getRole().getName().equals("SELLER") && !currentUser.getRole().isSeller()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Access denied. User is not a seller.");
                return ResponseEntity.status(403).body(error);
            }
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Get today's date
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalDate weekStart = today.minusDays(7);
            
            // Get recent orders for this seller's store (last 5)
            List<Order> allOrders = orderRepository.findAll();
            List<Order> sellerOrders = allOrders.stream()
                .filter(order -> order.getItems().stream()
                    .anyMatch(item -> item.getProduct().getStore().getId().equals(sellerStore.getId())))
                .collect(java.util.stream.Collectors.toList());
            
            List<Order> recentOrders = sellerOrders.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .collect(java.util.stream.Collectors.toList());
            
            // Get today's sales for this seller's store
            List<Order> allTodayOrders = orderRepository.findByCreatedAtBetween(
                today.atStartOfDay(), 
                today.atTime(23, 59, 59)
            );
            List<Order> todayOrders = allTodayOrders.stream()
                .filter(order -> order.getItems().stream()
                    .anyMatch(item -> item.getProduct().getStore().getId().equals(sellerStore.getId())))
                .collect(java.util.stream.Collectors.toList());
            
            // Get this week's sales for this seller's store
            List<Order> allWeekOrders = orderRepository.findByCreatedAtBetween(
                weekStart.atStartOfDay(),
                today.atTime(23, 59, 59)
            );
            List<Order> weekOrders = allWeekOrders.stream()
                .filter(order -> order.getItems().stream()
                    .anyMatch(item -> item.getProduct().getStore().getId().equals(sellerStore.getId())))
                .collect(java.util.stream.Collectors.toList());
            
            // Calculate today's revenue for this seller's products only
            double todayRevenue = todayOrders.stream()
                .mapToDouble(order -> order.getItems().stream()
                    .filter(item -> item.getProduct().getStore().getId().equals(sellerStore.getId()))
                    .mapToDouble(item -> item.getPrice().doubleValue() * item.getQuantity())
                    .sum())
                .sum();
            
            // Calculate this week's revenue for this seller's products only
            double weekRevenue = weekOrders.stream()
                .mapToDouble(order -> order.getItems().stream()
                    .filter(item -> item.getProduct().getStore().getId().equals(sellerStore.getId()))
                    .mapToDouble(item -> item.getPrice().doubleValue() * item.getQuantity())
                    .sum())
                .sum();
            
            // Get low stock products (stock < 10)
            List<Product> lowStockProducts = productRepository.findByStoreAndStockLessThan(sellerStore, 10);
            
            // Get recent reviews (last 3)
            List<Review> recentReviews = reviewRepository.findTop3ByProductStoreOrderByCreatedAtDesc(sellerStore);
            
            // Prepare dashboard data
            Map<String, Object> dashboardData = new HashMap<>();
            
            // Welcome message
            dashboardData.put("welcomeMessage", "Hoş geldin");
            dashboardData.put("storeName", sellerStore.getName());
            dashboardData.put("today", today.toString());
            
            // Quick stats
            Map<String, Object> quickStats = new HashMap<>();
            quickStats.put("todayOrders", todayOrders.size());
            quickStats.put("todayRevenue", Math.round(todayRevenue * 100.0) / 100.0);
            quickStats.put("weekOrders", weekOrders.size());
            quickStats.put("weekRevenue", Math.round(weekRevenue * 100.0) / 100.0);
            quickStats.put("lowStockCount", lowStockProducts.size());
            dashboardData.put("quickStats", quickStats);
            
            // Recent orders
            List<Map<String, Object>> recentOrdersData = recentOrders.stream()
                .map(order -> {
                    // Sadece seller'ın ürünlerini filtrele
                    List<OrderItem> sellerItems = order.getItems().stream()
                        .filter(item -> item.getProduct().getStore().getId().equals(sellerStore.getId()))
                        .collect(java.util.stream.Collectors.toList());
                    
                    // Seller'ın ürünlerinin toplam tutarını hesapla
                    double sellerTotal = sellerItems.stream()
                        .mapToDouble(item -> item.getPrice().doubleValue() * item.getQuantity())
                        .sum();
                    
                    Map<String, Object> orderData = new HashMap<>();
                    orderData.put("id", order.getId());
                    orderData.put("customerName", order.getUser().getUsername());
                    orderData.put("totalAmount", sellerTotal);
                    orderData.put("status", order.getStatus());
                    orderData.put("createdAt", order.getCreatedAt());
                    orderData.put("itemCount", sellerItems.size());
                    return orderData;
                })
                .collect(java.util.stream.Collectors.toList());
            dashboardData.put("recentOrders", recentOrdersData);
            
            // Low stock alerts
            List<Map<String, Object>> lowStockData = lowStockProducts.stream()
                .map(product -> {
                    Map<String, Object> productData = new HashMap<>();
                    productData.put("id", product.getId());
                    productData.put("name", product.getName());
                    productData.put("stock", product.getStock());
                    productData.put("imageUrl1", product.getImageUrl1());
                    productData.put("imageUrl", product.getImageUrl());
                    return productData;
                })
                .collect(java.util.stream.Collectors.toList());
            dashboardData.put("lowStockProducts", lowStockData);
            
            // Recent reviews
            List<Map<String, Object>> recentReviewsData = recentReviews.stream()
                .map(review -> {
                    Map<String, Object> reviewData = new HashMap<>();
                    reviewData.put("id", review.getId());
                    reviewData.put("productName", review.getProduct().getName());
                    reviewData.put("rating", review.getRating());
                    reviewData.put("comment", review.getComment());
                    reviewData.put("userName", review.getUser().getUsername());
                    reviewData.put("createdAt", review.getCreatedAt());
                    return reviewData;
                })
                .collect(java.util.stream.Collectors.toList());
            dashboardData.put("recentReviews", recentReviewsData);
            
            // Quick actions
            List<Map<String, Object>> quickActions = Arrays.asList(
                Map.of("title", "Yeni Ürün Ekle", "icon", "add", "link", "/seller-panel/products", "color", "blue"),
                Map.of("title", "Siparişleri Görüntüle", "icon", "orders", "link", "/seller-panel/orders", "color", "green"),
                Map.of("title", "Stok Yönetimi", "icon", "inventory", "link", "/seller-panel/inventory", "color", "orange"),
                Map.of("title", "Müşteri Yorumları", "icon", "reviews", "link", "/seller-panel/reviews", "color", "purple")
            );
            dashboardData.put("quickActions", quickActions);
            
            System.out.println("Welcome Dashboard data prepared successfully");
            
            return ResponseEntity.ok(dashboardData);
            
        } catch (Exception e) {
            System.err.println("Error in getWelcomeDashboard: " + e.getMessage());
            e.printStackTrace();
            
            // Daha detaylı hata mesajı
            String errorMessage = "Failed to get welcome dashboard data: " + e.getMessage();
            if (e.getCause() != null) {
                errorMessage += " (Cause: " + e.getCause().getMessage() + ")";
            }
            
            Map<String, Object> error = new HashMap<>();
            error.put("error", errorMessage);
            error.put("timestamp", java.time.LocalDateTime.now().toString());
            error.put("details", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(error);
        }
    }

    // Seller Siparişleri Endpoint'leri

    @GetMapping("/orders")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Get seller orders", description = "Retrieve all orders for the authenticated seller with pagination and filtering")
    public ResponseEntity<Map<String, Object>> getSellerOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "all") String status) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Seller'ın ürünlerini çek
            List<Product> sellerProducts = productRepository.findByStore(sellerStore, org.springframework.data.domain.Pageable.unpaged()).getContent();
            Set<String> sellerProductIds = new HashSet<>();
            for (Product product : sellerProducts) {
                sellerProductIds.add(product.getId());
            }
            
            // Tüm siparişleri çek
            List<Order> allOrders = orderRepository.findAll();
            
            // Seller'ın ürünlerini içeren siparişleri filtrele
            List<Order> sellerOrders = new ArrayList<>();
            for (Order order : allOrders) {
                boolean hasSellerProduct = false;
                for (OrderItem item : order.getItems()) {
                    if (sellerProductIds.contains(item.getProduct().getId())) {
                        hasSellerProduct = true;
                        break;
                    }
                }
                if (hasSellerProduct) {
                    sellerOrders.add(order);
                }
            }
            
            // Status filtresi uygula
            if (!"all".equals(status)) {
                sellerOrders = sellerOrders.stream()
                    .filter(order -> status.equalsIgnoreCase(order.getStatus()))
                    .collect(java.util.stream.Collectors.toList());
            }
            
            // Toplam sipariş sayısı
            int totalOrders = sellerOrders.size();
            
            // Pagination uygula
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, totalOrders);
            
            List<Order> paginatedOrders = new ArrayList<>();
            if (startIndex < totalOrders) {
                paginatedOrders = sellerOrders.subList(startIndex, endIndex);
            }
            
            // Toplam sayfa sayısı
            int totalPages = (int) Math.ceil((double) totalOrders / size);
            
            // Order objelerini Map'lere dönüştür
            List<Map<String, Object>> orderMaps = new ArrayList<>();
            for (Order order : paginatedOrders) {
                Map<String, Object> orderMap = new HashMap<>();
                orderMap.put("id", order.getId());
                orderMap.put("createdAt", order.getCreatedAt());
                orderMap.put("status", order.getStatus());
                orderMap.put("totalPrice", order.getTotalPrice());
                
                // User bilgilerini ekle
                Map<String, Object> userMap = new HashMap<>();
                if (order.getUser() != null) {
                    userMap.put("id", order.getUser().getId());
                    userMap.put("username", order.getUser().getUsername());
                    userMap.put("email", order.getUser().getEmail());
                }
                orderMap.put("user", userMap);
                
                // Order items'ları ekle
                List<Map<String, Object>> itemMaps = new ArrayList<>();
                for (OrderItem item : order.getItems()) {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("id", item.getId());
                    itemMap.put("quantity", item.getQuantity());
                    itemMap.put("price", item.getPrice());
                    
                    // Product bilgilerini ekle
                    Map<String, Object> productMap = new HashMap<>();
                    if (item.getProduct() != null) {
                        productMap.put("id", item.getProduct().getId());
                        productMap.put("name", item.getProduct().getName());
                        productMap.put("imageUrl1", item.getProduct().getImageUrl1());
                        productMap.put("imageUrl", item.getProduct().getImageUrl());
                        
                        // Category bilgilerini ekle
                        Map<String, Object> categoryMap = new HashMap<>();
                        if (item.getProduct().getCategory() != null) {
                            categoryMap.put("id", item.getProduct().getCategory().getId());
                            categoryMap.put("name", item.getProduct().getCategory().getName());
                        }
                        productMap.put("category", categoryMap);
                    }
                    itemMap.put("product", productMap);
                    
                    itemMaps.add(itemMap);
                }
                orderMap.put("items", itemMaps);
                
                orderMaps.add(orderMap);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("orders", orderMaps);
            response.put("totalOrders", totalOrders);
            response.put("totalPages", totalPages);
            response.put("currentPage", page);
            response.put("pageSize", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Get seller orders error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/orders/{orderId}/status")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Update order status", description = "Update the status of a specific order")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
            }
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Siparişi bul
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
            
            // Seller'ın bu siparişte ürünü olup olmadığını kontrol et
            List<Product> sellerProducts = productRepository.findByStore(sellerStore, org.springframework.data.domain.Pageable.unpaged()).getContent();
            Set<String> sellerProductIds = new HashSet<>();
            for (Product product : sellerProducts) {
                sellerProductIds.add(product.getId());
            }
            
            boolean hasSellerProduct = false;
            for (OrderItem item : order.getItems()) {
                if (sellerProductIds.contains(item.getProduct().getId())) {
                    hasSellerProduct = true;
                    break;
                }
            }
            
            if (!hasSellerProduct) {
                return ResponseEntity.badRequest().body(Map.of("error", "You can only update orders that contain your products"));
            }
            
            // Eski durumu kaydet
            String oldStatus = order.getStatus();
            
            // Sipariş durumunu güncelle
            order.setStatus(newStatus);
            orderRepository.save(order);
            
            // Sipariş durumu değişikliği event'ini yayınla (sadece durum gerçekten değiştiyse)
            if (!oldStatus.equals(newStatus)) {
                eventPublisher.publishEvent(new OrderStatusChangedEvent(this, order, oldStatus, newStatus));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order status updated successfully");
            response.put("orderId", orderId);
            response.put("newStatus", newStatus);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Update order status error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Stok Yönetimi Endpoint'i

    @GetMapping("/stock")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Get low stock products", description = "Retrieve products with low stock for the authenticated seller")
    public ResponseEntity<Map<String, Object>> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Seller'ın düşük stoklu ürünlerini çek
            List<Product> lowStockProducts = productRepository.findByStoreAndStockLessThan(
                sellerStore, 
                threshold + 1
            );
            
            // Product objelerini Map'lere dönüştür
            List<Map<String, Object>> productMaps = new ArrayList<>();
            for (Product product : lowStockProducts) {
                Map<String, Object> productMap = new HashMap<>();
                productMap.put("id", product.getId());
                productMap.put("name", product.getName());
                productMap.put("description", product.getDescription());
                productMap.put("price", product.getPrice());
                productMap.put("stock", product.getStock());
                productMap.put("imageUrl1", product.getImageUrl1());
                productMap.put("imageUrl", product.getImageUrl());
                
                // Category bilgilerini ekle
                Map<String, Object> categoryMap = new HashMap<>();
                if (product.getCategory() != null) {
                    categoryMap.put("id", product.getCategory().getId());
                    categoryMap.put("name", product.getCategory().getName());
                }
                productMap.put("category", categoryMap);
                
                productMaps.add(productMap);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("products", productMaps);
            response.put("totalProducts", productMaps.size());
            response.put("threshold", threshold);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Get low stock products error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Kampanya Yönetimi Endpoint'leri

    @GetMapping("/campaigns")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Get seller campaigns", description = "Retrieve all campaigns for the authenticated seller")
    public ResponseEntity<Map<String, Object>> getSellerCampaigns() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Seller'ın kampanyalarını çek
            List<Campaign> campaigns = campaignRepository.findByStore(sellerStore);
            
            // Campaign objelerini Map'lere dönüştür
            List<Map<String, Object>> campaignMaps = new ArrayList<>();
            for (Campaign campaign : campaigns) {
                Map<String, Object> campaignMap = new HashMap<>();
                campaignMap.put("id", campaign.getId());
                campaignMap.put("name", campaign.getName());
                campaignMap.put("description", campaign.getDescription());
                campaignMap.put("campaignType", campaign.getCampaignType());
                campaignMap.put("targetId", campaign.getTargetId());
                campaignMap.put("discountType", campaign.getDiscountType());
                campaignMap.put("discountValue", campaign.getDiscountValue());
                campaignMap.put("startDate", campaign.getStartDate());
                campaignMap.put("endDate", campaign.getEndDate());
                campaignMap.put("isActive", campaign.isActive());
                campaignMap.put("createdAt", campaign.getCreatedAt());
                campaignMap.put("updatedAt", campaign.getUpdatedAt());
                
                campaignMaps.add(campaignMap);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("campaigns", campaignMaps);
            response.put("totalCampaigns", campaignMaps.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Get seller campaigns error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/campaigns")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Create campaign", description = "Create a new campaign for the authenticated seller")
    public ResponseEntity<Map<String, Object>> createCampaign(@RequestBody Map<String, Object> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Kampanya oluştur
            Campaign campaign = new Campaign();
            campaign.setName((String) request.get("name"));
            campaign.setDescription((String) request.get("description"));
            campaign.setCampaignType((String) request.get("campaignType"));
            campaign.setTargetId((String) request.get("targetId"));
            campaign.setDiscountType((String) request.get("discountType"));
            campaign.setDiscountValue(new java.math.BigDecimal(request.get("discountValue").toString()));
            campaign.setStartDate(java.time.LocalDateTime.parse((String) request.get("startDate") + "T00:00:00"));
            campaign.setEndDate(java.time.LocalDateTime.parse((String) request.get("endDate") + "T23:59:59"));
            campaign.setActive((Boolean) request.get("isActive"));
            campaign.setStore(sellerStore);
            campaign.setCreatedAt(java.time.LocalDateTime.now());
            campaign.setUpdatedAt(java.time.LocalDateTime.now());
            
            Campaign savedCampaign = campaignRepository.save(campaign);
            
            System.out.println("=== KAMPANYA OLUŞTURULDU ===");
            System.out.println("Kampanya ID: " + savedCampaign.getId());
            System.out.println("Kampanya Tipi: " + savedCampaign.getCampaignType());
            System.out.println("Hedef ID: " + savedCampaign.getTargetId());
            System.out.println("Aktif mi: " + savedCampaign.isActive());
            System.out.println("İndirim Tipi: " + savedCampaign.getDiscountType());
            System.out.println("İndirim Değeri: " + savedCampaign.getDiscountValue());
            
            // Kampanya aktifse ürünlerin indirim bilgilerini güncelle (hem product hem category için)
            if (savedCampaign.isActive()) {
                System.out.println("Ürün indirimleri güncelleniyor...");
                updateProductDiscounts(savedCampaign);
            } else {
                System.out.println("Kampanya pasif, ürün güncellemesi yapılmıyor.");
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Kampanya başarıyla oluşturuldu");
            response.put("campaignId", savedCampaign.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Create campaign error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/campaigns/{campaignId}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Update campaign", description = "Update an existing campaign")
    public ResponseEntity<Map<String, Object>> updateCampaign(
            @PathVariable String campaignId,
            @RequestBody Map<String, Object> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Kampanyayı bul
            Campaign campaign = campaignRepository.findById(campaignId)
                    .orElseThrow(() -> new RuntimeException("Campaign not found: " + campaignId));
            
            // Seller'ın bu kampanyaya sahip olup olmadığını kontrol et
            if (!campaign.getStore().getId().equals(sellerStore.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Bu kampanyayı düzenleme yetkiniz yok"));
            }
            
            // Kampanyayı güncelle
            campaign.setName((String) request.get("name"));
            campaign.setDescription((String) request.get("description"));
            campaign.setCampaignType((String) request.get("campaignType"));
            campaign.setTargetId((String) request.get("targetId"));
            campaign.setDiscountType((String) request.get("discountType"));
            campaign.setDiscountValue(new java.math.BigDecimal(request.get("discountValue").toString()));
            campaign.setStartDate(java.time.LocalDateTime.parse((String) request.get("startDate") + "T00:00:00"));
            campaign.setEndDate(java.time.LocalDateTime.parse((String) request.get("endDate") + "T23:59:59"));
            campaign.setActive((Boolean) request.get("isActive"));
            campaign.setUpdatedAt(java.time.LocalDateTime.now());
            
            campaignRepository.save(campaign);
            
            // Kampanya güncellendikten sonra ürünlerin indirim bilgilerini güncelle
            updateProductDiscounts(campaign);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Kampanya başarıyla güncellendi");
            response.put("campaignId", campaignId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Update campaign error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Kampanya bilgilerine göre ürünlerin indirim bilgilerini günceller
     */
    private void updateProductDiscounts(Campaign campaign) {
        try {
            System.out.println("=== UPDATE PRODUCT DISCOUNTS BAŞLADI ===");
            System.out.println("Kampanya Tipi: " + campaign.getCampaignType());
            System.out.println("Hedef ID: " + campaign.getTargetId());
            System.out.println("Store ID: " + campaign.getStore().getId());
            
            if ("product".equals(campaign.getCampaignType())) {
                System.out.println("Ürün kampanyası - belirli ürün güncelleniyor...");
                // Belirli ürün için indirim
                Product product = productRepository.findById(campaign.getTargetId()).orElse(null);
                if (product != null && product.getStoreId().equals(campaign.getStore().getId())) {
                    System.out.println("Ürün bulundu: " + product.getName());
                    updateProductDiscount(product, campaign);
                } else {
                    System.out.println("Ürün bulunamadı veya store ID uyuşmuyor!");
                    System.out.println("Product: " + (product != null ? product.getName() : "null"));
                    System.out.println("Product Store ID: " + (product != null ? product.getStoreId() : "null"));
                }
            } else if ("category".equals(campaign.getCampaignType())) {
                System.out.println("Kategori kampanyası - kategorideki tüm ürünler güncelleniyor...");
                // Kategori için indirim - o kategorideki tüm ürünleri güncelle
                List<Product> categoryProducts = productRepository.findByCategoryIdAndStoreId(
                    campaign.getTargetId(), campaign.getStore().getId());
                
                System.out.println("Kategoride bulunan ürün sayısı: " + categoryProducts.size());
                
                for (Product product : categoryProducts) {
                    System.out.println("Ürün güncelleniyor: " + product.getName());
                    updateProductDiscount(product, campaign);
                }
            } else {
                System.out.println("Bilinmeyen kampanya tipi: " + campaign.getCampaignType());
            }
            
            System.out.println("=== UPDATE PRODUCT DISCOUNTS TAMAMLANDI ===");
        } catch (Exception e) {
            System.err.println("Update product discounts error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Tek bir ürünün indirim bilgilerini günceller
     */
    private void updateProductDiscount(Product product, Campaign campaign) {
        try {
            System.out.println("=== UPDATE PRODUCT DISCOUNT BAŞLADI ===");
            System.out.println("Ürün: " + product.getName() + " (ID: " + product.getId() + ")");
            System.out.println("Mevcut Fiyat: " + product.getPrice());
            System.out.println("Kampanya Aktif mi: " + campaign.isActive());
            System.out.println("İndirim Tipi: " + campaign.getDiscountType());
            System.out.println("İndirim Değeri: " + campaign.getDiscountValue());
            
            if (campaign.isActive()) {
                // İndirim yüzdesi hesapla
                int discountPercentage = 0;
                if ("percentage".equals(campaign.getDiscountType())) {
                    discountPercentage = campaign.getDiscountValue().intValue();
                    System.out.println("Yüzde indirim: %" + discountPercentage);
                } else if ("fixed".equals(campaign.getDiscountType())) {
                    // Sabit tutar indirimi için yüzde hesapla
                    if (product.getPrice().compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal discountAmount = campaign.getDiscountValue();
                        BigDecimal percentage = discountAmount.multiply(new BigDecimal("100"))
                            .divide(product.getPrice(), 2, BigDecimal.ROUND_HALF_UP);
                        discountPercentage = percentage.intValue();
                        System.out.println("Sabit tutar indirimi: " + discountAmount + "₺ (%" + discountPercentage + ")");
                    }
                }
                
                // İndirimli fiyat hesapla
                BigDecimal discountedPrice = null;
                if (discountPercentage > 0) {
                    BigDecimal discountMultiplier = new BigDecimal("100").subtract(new BigDecimal(discountPercentage))
                        .divide(new BigDecimal("100"), 4, BigDecimal.ROUND_HALF_UP);
                    discountedPrice = product.getPrice().multiply(discountMultiplier);
                    System.out.println("İndirimli Fiyat: " + discountedPrice + "₺");
                }
                
                // Ürünü güncelle
                product.setDiscountPercentage(discountPercentage);
                product.setDiscountedPrice(discountedPrice);
                product.setDiscountEndDate(campaign.getEndDate());
                
                Product savedProduct = productRepository.save(product);
                System.out.println("Ürün kaydedildi!");
                System.out.println("Yeni İndirim Yüzdesi: " + savedProduct.getDiscountPercentage());
                System.out.println("Yeni İndirimli Fiyat: " + savedProduct.getDiscountedPrice());
                System.out.println("İndirim Bitiş Tarihi: " + savedProduct.getDiscountEndDate());
                System.out.println("İndirim Aktif mi: " + savedProduct.isDiscountActive());
            } else {
                System.out.println("Kampanya pasif - indirimler kaldırılıyor...");
                // Kampanya pasifse indirimleri kaldır
                product.setDiscountPercentage(null);
                product.setDiscountedPrice(null);
                product.setDiscountEndDate(null);
                
                Product savedProduct = productRepository.save(product);
                System.out.println("İndirimler kaldırıldı!");
            }
            
            System.out.println("=== UPDATE PRODUCT DISCOUNT TAMAMLANDI ===");
        } catch (Exception e) {
            System.err.println("Update product discount error for product " + product.getId() + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Kampanya silindiğinde ürünlerin indirim bilgilerini temizler
     */
    private void clearProductDiscounts(Campaign campaign) {
        try {
            if ("product".equals(campaign.getCampaignType())) {
                // Belirli ürün için indirimleri temizle
                Product product = productRepository.findById(campaign.getTargetId()).orElse(null);
                if (product != null && product.getStoreId().equals(campaign.getStore().getId())) {
                    product.setDiscountPercentage(null);
                    product.setDiscountedPrice(null);
                    product.setDiscountEndDate(null);
                    productRepository.save(product);
                }
            } else if ("category".equals(campaign.getCampaignType())) {
                // Kategori için indirimleri temizle - o kategorideki tüm ürünleri güncelle
                List<Product> categoryProducts = productRepository.findByCategoryIdAndStoreId(
                    campaign.getTargetId(), campaign.getStore().getId());
                
                for (Product product : categoryProducts) {
                    product.setDiscountPercentage(null);
                    product.setDiscountedPrice(null);
                    product.setDiscountEndDate(null);
                    productRepository.save(product);
                }
            }
        } catch (Exception e) {
            System.err.println("Clear product discounts error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @DeleteMapping("/campaigns/{campaignId}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Delete campaign", description = "Delete a campaign")
    public ResponseEntity<Map<String, Object>> deleteCampaign(@PathVariable String campaignId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Kampanyayı bul
            Campaign campaign = campaignRepository.findById(campaignId)
                    .orElseThrow(() -> new RuntimeException("Campaign not found: " + campaignId));
            
            // Seller'ın bu kampanyaya sahip olup olmadığını kontrol et
            if (!campaign.getStore().getId().equals(sellerStore.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Bu kampanyayı silme yetkiniz yok"));
            }
            
            // Kampanya silinmeden önce ürünlerin indirim bilgilerini temizle
            clearProductDiscounts(campaign);
            
            campaignRepository.delete(campaign);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Kampanya başarıyla silindi");
            response.put("campaignId", campaignId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Delete campaign error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Mağaza Ayarları Endpoint'leri

    @GetMapping("/store")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Get store information", description = "Retrieve store information for the authenticated seller")
    public ResponseEntity<Map<String, Object>> getStoreInfo() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", sellerStore.getId());
            response.put("name", sellerStore.getName());
            
            // Yeni alanları güvenli şekilde ekle
            try {
                response.put("description", sellerStore.getDescription());
            } catch (Exception e) {
                response.put("description", "");
            }
            
            try {
                response.put("address", sellerStore.getAddress());
            } catch (Exception e) {
                response.put("address", "");
            }
            
            try {
                response.put("phone", sellerStore.getPhone());
            } catch (Exception e) {
                response.put("phone", "");
            }
            
            try {
                response.put("email", sellerStore.getEmail());
            } catch (Exception e) {
                response.put("email", "");
            }
            
            try {
                response.put("website", sellerStore.getWebsite());
            } catch (Exception e) {
                response.put("website", "");
            }
            
            try {
                response.put("workingHours", sellerStore.getWorkingHours());
            } catch (Exception e) {
                response.put("workingHours", "");
            }
            
            try {
                response.put("logo", sellerStore.getLogo());
            } catch (Exception e) {
                response.put("logo", "");
            }
            
            try {
                response.put("banner", sellerStore.getBanner());
            } catch (Exception e) {
                response.put("banner", "");
            }
            
            // Zaman damgaları için varsayılan değerler
            response.put("createdAt", java.time.LocalDateTime.now());
            response.put("updatedAt", java.time.LocalDateTime.now());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Get store info error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/store")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Update store information", description = "Update store information for the authenticated seller")
    public ResponseEntity<Map<String, Object>> updateStoreInfo(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== UPDATE STORE INFO DEBUG ===");
            System.out.println("Request data: " + request);
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            System.out.println("Current user email: " + email);
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            System.out.println("Found user: " + currentUser.getEmail());
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            System.out.println("Found store: " + sellerStore.getName() + " (ID: " + sellerStore.getId() + ")");
            
            // Mağaza bilgilerini güvenli şekilde güncelle
            if (request.get("name") != null) {
                sellerStore.setName((String) request.get("name"));
                System.out.println("Updated name: " + request.get("name"));
            }
            
            if (request.get("description") != null) {
                sellerStore.setDescription((String) request.get("description"));
                System.out.println("Updated description: " + request.get("description"));
            }
            
            if (request.get("address") != null) {
                sellerStore.setAddress((String) request.get("address"));
                System.out.println("Updated address: " + request.get("address"));
            }
            
            if (request.get("phone") != null) {
                sellerStore.setPhone((String) request.get("phone"));
                System.out.println("Updated phone: " + request.get("phone"));
            }
            
            if (request.get("email") != null) {
                sellerStore.setEmail((String) request.get("email"));
                System.out.println("Updated email: " + request.get("email"));
            }
            
            if (request.get("website") != null) {
                sellerStore.setWebsite((String) request.get("website"));
                System.out.println("Updated website: " + request.get("website"));
            }
            
            if (request.get("workingHours") != null) {
                sellerStore.setWorkingHours((String) request.get("workingHours"));
                System.out.println("Updated workingHours: " + request.get("workingHours"));
            }
            
            if (request.get("logo") != null) {
                sellerStore.setLogo((String) request.get("logo"));
                System.out.println("Updated logo: " + request.get("logo"));
            }
            
            if (request.get("banner") != null) {
                sellerStore.setBanner((String) request.get("banner"));
                System.out.println("Updated banner: " + request.get("banner"));
            }
            
            // Zaman damgalarını güncelle
            sellerStore.setUpdatedAt(java.time.LocalDateTime.now());
            System.out.println("Updated timestamp: " + sellerStore.getUpdatedAt());
            
            if (sellerStore.getCreatedAt() == null) {
                sellerStore.setCreatedAt(java.time.LocalDateTime.now());
                System.out.println("Set created timestamp: " + sellerStore.getCreatedAt());
            }
            
            Store savedStore = storeRepository.save(sellerStore);
            System.out.println("Store saved successfully: " + savedStore.getId());
            System.out.println("=== END UPDATE STORE INFO DEBUG ===");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Mağaza bilgileri başarıyla güncellendi");
            response.put("storeId", sellerStore.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("=== UPDATE STORE INFO ERROR ===");
            System.err.println("Error message: " + e.getMessage());
            System.err.println("Error type: " + e.getClass().getSimpleName());
            System.err.println("Error cause: " + (e.getCause() != null ? e.getCause().getMessage() : "No cause"));
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Mağaza bilgileri güncellenirken bir hata oluştu: " + e.getMessage());
            errorResponse.put("details", e.getClass().getSimpleName());
            errorResponse.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/upload-image")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Upload store image", description = "Upload logo or banner image for the store")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestParam("image") MultipartFile file,
            @RequestParam("type") String type) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Dosya seçilmedi"));
            }

            // Dosya boyutu kontrolü (5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("error", "Dosya boyutu 5MB'dan küçük olmalıdır"));
            }

            // Dosya türü kontrolü
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Sadece resim dosyaları kabul edilir"));
            }

            // Dosya adını oluştur
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String fileName = type + "_" + System.currentTimeMillis() + fileExtension;

            // Dosyayı kaydet (gerçek uygulamada cloud storage kullanılır)
            String uploadDir = "uploads/store-images/";
            java.io.File dir = new java.io.File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            java.io.File destFile = new java.io.File(uploadDir + fileName);
            file.transferTo(destFile);

            // URL oluştur
            String imageUrl = "/api/images/store/" + fileName;

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Resim başarıyla yüklendi");
            response.put("imageUrl", imageUrl);
            response.put("fileName", fileName);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Upload image error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/settings")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Update seller settings", description = "Update notification and appearance settings")
    public ResponseEntity<Map<String, Object>> updateSettings(@RequestBody Map<String, Object> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Ayarlar başarıyla güncellendi");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Update settings error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Elasticsearch Arama Endpoint'leri
    
    @GetMapping("/search/products")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Search seller products with Elasticsearch", description = "Search products using Elasticsearch with filters")
    public ResponseEntity<Map<String, Object>> searchProducts(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "") String category,
            @RequestParam(defaultValue = "0") Double minPrice,
            @RequestParam(defaultValue = "999999") Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Elasticsearch servisi kontrol et
            if (elasticsearchService == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Elasticsearch servisi mevcut değil"));
            }
            
            // Elasticsearch ile arama yap
            List<com.bahattintok.e_commerce.model.ProductDocument> searchResults = 
                elasticsearchService.advancedSearch(query, category, minPrice, maxPrice, sellerStore.getName());
            
            // Sadece bu seller'ın ürünlerini filtrele
            List<com.bahattintok.e_commerce.model.ProductDocument> filteredResults = searchResults.stream()
                .filter(doc -> doc.getStoreId().equals(sellerStore.getId()))
                .toList();
            
            // Pagination uygula
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, filteredResults.size());
            List<com.bahattintok.e_commerce.model.ProductDocument> paginatedResults = 
                filteredResults.subList(startIndex, endIndex);
            
            Map<String, Object> response = new HashMap<>();
            response.put("products", paginatedResults);
            response.put("totalElements", filteredResults.size());
            response.put("totalPages", (int) Math.ceil((double) filteredResults.size() / size));
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Search products error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/search/orders")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Search seller orders with Elasticsearch", description = "Search orders using Elasticsearch with filters")
    public ResponseEntity<Map<String, Object>> searchOrders(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "") String customerName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Tüm siparişleri getir
            List<Order> allOrders = orderRepository.findAll();
            
            // Bu seller'ın ürünlerini içeren siparişleri filtrele
            List<Order> sellerOrders = allOrders.stream()
                .filter(order -> order.getOrderItems().stream()
                    .anyMatch(item -> item.getProduct().getStore().getId().equals(sellerStore.getId())))
                .toList();
            
            // Elasticsearch benzeri filtreleme
            List<Order> filteredOrders = sellerOrders.stream()
                .filter(order -> {
                    // Status filtresi
                    if (!status.equals("all") && !order.getStatus().equals(status)) {
                        return false;
                    }
                    
                    // Customer name filtresi
                    if (!customerName.isEmpty() && 
                        !order.getUser().getFirstName().toLowerCase().contains(customerName.toLowerCase()) &&
                        !order.getUser().getLastName().toLowerCase().contains(customerName.toLowerCase())) {
                        return false;
                    }
                    
                    // Query filtresi (order ID veya ürün adı)
                    if (!query.isEmpty()) {
                        boolean matchesQuery = order.getId().toLowerCase().contains(query.toLowerCase()) ||
                            order.getOrderItems().stream()
                                .anyMatch(item -> item.getProduct().getName().toLowerCase().contains(query.toLowerCase()));
                        if (!matchesQuery) {
                            return false;
                        }
                    }
                    
                    return true;
                })
                .toList();
            
            // Pagination uygula
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, filteredOrders.size());
            List<Order> paginatedOrders = filteredOrders.subList(startIndex, endIndex);
            
            // Order'ları Map'e dönüştür
            List<Map<String, Object>> orderMaps = new ArrayList<>();
            for (Order order : paginatedOrders) {
                Map<String, Object> orderMap = new HashMap<>();
                orderMap.put("id", order.getId());
                orderMap.put("createdAt", order.getCreatedAt());
                orderMap.put("status", order.getStatus());
                orderMap.put("totalPrice", order.getTotalPrice());
                
                // User bilgileri
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", order.getUser().getId());
                userMap.put("firstName", order.getUser().getFirstName());
                userMap.put("lastName", order.getUser().getLastName());
                userMap.put("email", order.getUser().getEmail());
                userMap.put("phone", order.getUser().getPhone());
                orderMap.put("user", userMap);
                
                // Order items
                List<Map<String, Object>> itemMaps = new ArrayList<>();
                for (OrderItem item : order.getOrderItems()) {
                    // Sadece bu seller'ın ürünlerini dahil et
                    if (item.getProduct().getStore().getId().equals(sellerStore.getId())) {
                        Map<String, Object> itemMap = new HashMap<>();
                        itemMap.put("id", item.getId());
                        itemMap.put("quantity", item.getQuantity());
                        itemMap.put("price", item.getPrice());
                        
                        // Product bilgileri
                        Map<String, Object> productMap = new HashMap<>();
                        productMap.put("id", item.getProduct().getId());
                        productMap.put("name", item.getProduct().getName());
                        productMap.put("image", item.getProduct().getImage());
                        productMap.put("price", item.getProduct().getPrice());
                        
                        // Category bilgileri
                        Map<String, Object> categoryMap = new HashMap<>();
                        categoryMap.put("id", item.getProduct().getCategory().getId());
                        categoryMap.put("name", item.getProduct().getCategory().getName());
                        productMap.put("category", categoryMap);
                        
                        itemMap.put("product", productMap);
                        itemMaps.add(itemMap);
                    }
                }
                orderMap.put("orderItems", itemMaps);
                
                orderMaps.add(orderMap);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("orders", orderMaps);
            response.put("totalElements", filteredOrders.size());
            response.put("totalPages", (int) Math.ceil((double) filteredOrders.size() / size));
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Search orders error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/search/stock")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Search seller stock with Elasticsearch", description = "Search stock using Elasticsearch with filters")
    public ResponseEntity<Map<String, Object>> searchStock(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "") String category,
            @RequestParam(defaultValue = "0") int minStock,
            @RequestParam(defaultValue = "999999") int maxStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Elasticsearch servisi kontrol et
            if (elasticsearchService == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Elasticsearch servisi mevcut değil"));
            }
            
            // Elasticsearch ile arama yap
            List<com.bahattintok.e_commerce.model.ProductDocument> searchResults = 
                elasticsearchService.advancedSearch(query, category, 0.0, 999999.0, sellerStore.getName());
            
            // Sadece bu seller'ın ürünlerini filtrele ve stok kriterlerini uygula
            List<com.bahattintok.e_commerce.model.ProductDocument> filteredResults = searchResults.stream()
                .filter(doc -> doc.getStoreId().equals(sellerStore.getId()))
                .filter(doc -> doc.getStock() >= minStock && doc.getStock() <= maxStock)
                .toList();
            
            // Pagination uygula
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, filteredResults.size());
            List<com.bahattintok.e_commerce.model.ProductDocument> paginatedResults = 
                filteredResults.subList(startIndex, endIndex);
            
            Map<String, Object> response = new HashMap<>();
            response.put("products", paginatedResults);
            response.put("totalElements", filteredResults.size());
            response.put("totalPages", (int) Math.ceil((double) filteredResults.size() / size));
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Search stock error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/search/campaigns")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Search seller campaigns with Elasticsearch", description = "Search campaigns using Elasticsearch with filters")
    public ResponseEntity<Map<String, Object>> searchCampaigns(
            @RequestParam(defaultValue = "") String query,
            @RequestParam(defaultValue = "all") String campaignType,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Tüm kampanyaları getir
            List<Campaign> allCampaigns = campaignRepository.findByStore(sellerStore);
            
            // Elasticsearch benzeri filtreleme
            List<Campaign> filteredCampaigns = allCampaigns.stream()
                .filter(campaign -> {
                    // Campaign type filtresi
                    if (!campaignType.equals("all") && !campaign.getCampaignType().equals(campaignType)) {
                        return false;
                    }
                    
                    // Status filtresi
                    if (!status.equals("all")) {
                        boolean isActive = campaign.isActive();
                        if (status.equals("active") && !isActive) {
                            return false;
                        }
                        if (status.equals("inactive") && isActive) {
                            return false;
                        }
                    }
                    
                    // Query filtresi (kampanya adı veya açıklaması)
                    if (!query.isEmpty()) {
                        boolean matchesQuery = campaign.getName().toLowerCase().contains(query.toLowerCase()) ||
                            (campaign.getDescription() != null && 
                             campaign.getDescription().toLowerCase().contains(query.toLowerCase()));
                        if (!matchesQuery) {
                            return false;
                        }
                    }
                    
                    return true;
                })
                .toList();
            
            // Pagination uygula
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, filteredCampaigns.size());
            List<Campaign> paginatedCampaigns = filteredCampaigns.subList(startIndex, endIndex);
            
            // Campaign'ları Map'e dönüştür
            List<Map<String, Object>> campaignMaps = new ArrayList<>();
            for (Campaign campaign : paginatedCampaigns) {
                Map<String, Object> campaignMap = new HashMap<>();
                campaignMap.put("id", campaign.getId());
                campaignMap.put("name", campaign.getName());
                campaignMap.put("description", campaign.getDescription());
                campaignMap.put("campaignType", campaign.getCampaignType());
                campaignMap.put("targetId", campaign.getTargetId());
                campaignMap.put("discountType", campaign.getDiscountType());
                campaignMap.put("discountValue", campaign.getDiscountValue());
                campaignMap.put("startDate", campaign.getStartDate());
                campaignMap.put("endDate", campaign.getEndDate());
                campaignMap.put("isActive", campaign.isActive());
                campaignMap.put("createdAt", campaign.getCreatedAt());
                campaignMap.put("updatedAt", campaign.getUpdatedAt());
                
                campaignMaps.add(campaignMap);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("campaigns", campaignMaps);
            response.put("totalElements", filteredCampaigns.size());
            response.put("totalPages", (int) Math.ceil((double) filteredCampaigns.size() / size));
            response.put("currentPage", page);
            response.put("size", size);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Search campaigns error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
} 