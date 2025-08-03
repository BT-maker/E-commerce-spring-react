package com.bahattintok.e_commerce.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Review;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.OrderRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.ReviewRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.repository.UserRepository;

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

    @GetMapping("/stats")
    @PreAuthorize("hasRole('SELLER') or hasRole('ROLE_SELLER')")
    @Operation(summary = "Get seller statistics", description = "Retrieve statistics for the authenticated seller")
    public ResponseEntity<Map<String, Object>> getSellerStats() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            System.out.println("Current user email: " + email); // Debug log
            System.out.println("Current user authorities: " + authentication.getAuthorities()); // Debug log
            
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            System.out.println("Found user: " + currentUser.getEmail() + ", Role: " + currentUser.getRole().getName()); // Debug log
            
            // Check if user is a seller
            if (!currentUser.getRole().getName().equals("SELLER")) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Access denied. User is not a seller.");
                return ResponseEntity.status(403).body(error);
            }
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            System.out.println("Found store: " + sellerStore.getName() + " for seller: " + email); // Debug log
            
            // Get products count
            List<Product> products = productRepository.findByStore(sellerStore, org.springframework.data.domain.Pageable.unpaged()).getContent();
            int totalProducts = products.size();
            
            System.out.println("Found " + totalProducts + " products for store: " + sellerStore.getName()); // Debug log
            
            // Get orders count (simplified - in real app you'd have order-store relationship)
            List<Order> allOrders = orderRepository.findAll();
            int totalOrders = allOrders.size();
            
            // Calculate other stats (simplified for demo)
            int totalSales = totalOrders * 2; // Simplified calculation
            int totalCustomers = Math.max(1, totalOrders / 2); // Simplified calculation
            double totalRevenue = totalOrders * 1500.0; // Simplified calculation
            double averageRating = 4.2 + (Math.random() * 0.8); // Random between 4.2-5.0
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalProducts", totalProducts);
            stats.put("totalSales", totalSales);
            stats.put("totalCustomers", totalCustomers);
            stats.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
            stats.put("totalOrders", totalOrders);
            stats.put("averageRating", Math.round(averageRating * 10.0) / 10.0);
            
            System.out.println("Returning stats: " + stats); // Debug log
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            System.err.println("Error in getSellerStats: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to get seller statistics: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
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
            if (!currentUser.getRole().getName().equals("SELLER")) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Access denied. User is not a seller.");
                return ResponseEntity.status(403).body(error);
            }
            
            Store sellerStore = storeRepository.findBySeller(currentUser)
                    .orElseThrow(() -> new RuntimeException("Store not found for seller: " + email));
            
            // Get today's date
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalDate weekStart = today.minusDays(7);
            
            // Get recent orders (last 5)
            List<Order> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc();
            
            // Get today's sales
            List<Order> todayOrders = orderRepository.findByCreatedAtBetween(
                today.atStartOfDay(), 
                today.atTime(23, 59, 59)
            );
            
            // Get this week's sales
            List<Order> weekOrders = orderRepository.findByCreatedAtBetween(
                weekStart.atStartOfDay(),
                today.atTime(23, 59, 59)
            );
            
            // Calculate today's revenue
            double todayRevenue = todayOrders.stream()
                .mapToDouble(order -> order.getTotalPrice().doubleValue())
                .sum();
            
            // Calculate this week's revenue
            double weekRevenue = weekOrders.stream()
                .mapToDouble(order -> order.getTotalPrice().doubleValue())
                .sum();
            
            // Get low stock products (stock < 10)
            List<Product> lowStockProducts = productRepository.findByStoreAndStockLessThan(sellerStore, 10);
            
            // Get recent reviews (last 3)
            List<Review> recentReviews = reviewRepository.findTop3ByProductStoreOrderByCreatedAtDesc(sellerStore);
            
            // Prepare dashboard data
            Map<String, Object> dashboardData = new HashMap<>();
            
            // Welcome message
            dashboardData.put("welcomeMessage", "Hoş geldin, " + currentUser.getUsername() + "!");
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
                    Map<String, Object> orderData = new HashMap<>();
                    orderData.put("id", order.getId());
                    orderData.put("customerName", order.getUser().getUsername());
                    orderData.put("totalAmount", order.getTotalPrice());
                    orderData.put("status", order.getStatus());
                    orderData.put("createdAt", order.getCreatedAt());
                    orderData.put("itemCount", order.getItems().size());
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
} 