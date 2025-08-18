package com.bahattintok.e_commerce.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.OrderRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StoreRepository storeRepository;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Admin controller çalışıyor!");
    }

    // Kullanıcı listesi
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {
        try {
            System.out.println("=== DEBUG: getUsers called ===");
            System.out.println("Page: " + page + ", Size: " + size + ", Search: " + search + ", Role: " + role);
            
            List<User> allUsers = userRepository.findAll();
            
            // Arama filtresi
            if (search != null && !search.trim().isEmpty()) {
                allUsers = allUsers.stream()
                    .filter(user -> 
                        (user.getFirstName() != null && user.getFirstName().toLowerCase().contains(search.toLowerCase())) ||
                        (user.getLastName() != null && user.getLastName().toLowerCase().contains(search.toLowerCase())) ||
                        (user.getEmail() != null && user.getEmail().toLowerCase().contains(search.toLowerCase())) ||
                        (user.getUsername() != null && user.getUsername().toLowerCase().contains(search.toLowerCase()))
                    )
                    .collect(Collectors.toList());
            }
            
            // Rol filtresi
            if (role != null && !role.trim().isEmpty()) {
                allUsers = allUsers.stream()
                    .filter(user -> user.getRole() != null && user.getRole().getName().equals(role))
                    .collect(Collectors.toList());
            }
            
            // Sayfalama hesaplamaları
            int totalUsers = allUsers.size();
            int totalPages = (int) Math.ceil((double) totalUsers / size);
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, totalUsers);
            
            // Sayfa için kullanıcıları al
            List<User> pageUsers = allUsers.subList(startIndex, endIndex);
            
            // Kullanıcı sayılarını hesapla
            long totalUserCount = allUsers.stream()
                .filter(user -> user.getRole() != null && "USER".equals(user.getRole().getName()))
                .count();
            long totalSellerCount = allUsers.stream()
                .filter(user -> user.getRole() != null && "SELLER".equals(user.getRole().getName()))
                .count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("users", pageUsers);
            response.put("currentPage", page);
            response.put("totalPages", totalPages);
            response.put("totalUsers", totalUsers);
            response.put("hasNext", page < totalPages - 1);
            response.put("hasPrevious", page > 0);
            response.put("totalUserCount", totalUserCount);
            response.put("totalSellerCount", totalSellerCount);
            
            System.out.println("Total users found: " + totalUsers);
            System.out.println("Response being sent: " + response);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in getUsers: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Kullanıcılar alınamadı: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Dashboard istatistikleri
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        System.out.println("Dashboard stats endpoint çağrıldı");
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Temel istatistikler
            List<User> allUsers = userRepository.findAll();
            long totalUsers = allUsers.stream()
                .filter(user -> user.getRole() != null && "USER".equals(user.getRole().getName()))
                .count();
            long totalSellers = allUsers.stream()
                .filter(user -> user.getRole() != null && "SELLER".equals(user.getRole().getName()))
                .count();
            long totalProducts = productRepository.count();
            long totalOrders = orderRepository.count();
            
            // Toplam gelir hesaplama
            List<Order> allOrders = orderRepository.findAll();
            double totalRevenue = allOrders.stream()
                .filter(order -> "COMPLETED".equals(order.getStatus()))
                .mapToDouble(order -> order.getTotalPrice().doubleValue())
                .sum();
            
            // Aylık büyüme hesaplama (basit hesaplama)
            long currentMonthOrders = allOrders.stream()
                .filter(order -> order.getCreatedAt() != null && 
                               order.getCreatedAt().getMonth() == java.time.LocalDateTime.now().getMonth())
                .count();
            long lastMonthOrders = allOrders.stream()
                .filter(order -> order.getCreatedAt() != null && 
                               order.getCreatedAt().getMonth() == java.time.LocalDateTime.now().minusMonths(1).getMonth())
                .count();
            
            double monthlyGrowth = lastMonthOrders > 0 ? 
                ((double)(currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0.0;
            
            stats.put("totalUsers", totalUsers);
            stats.put("totalSellers", totalSellers);
            stats.put("totalProducts", totalProducts);
            stats.put("totalOrders", totalOrders);
            stats.put("totalRevenue", totalRevenue);
            stats.put("monthlyGrowth", Math.round(monthlyGrowth * 10.0) / 10.0); // 1 ondalık basamak
            
            System.out.println("Stats response: " + stats);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Dashboard istatistikleri alınamadı: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Son siparişler (sayfalama ile)
    @GetMapping("/dashboard/recent-orders")
    public ResponseEntity<Map<String, Object>> getRecentOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        try {
            System.out.println("=== DEBUG: getRecentOrders called ===");
            System.out.println("Page: " + page + ", Size: " + size);
            
            List<Order> allOrders = orderRepository.findAll();
            System.out.println("Total orders found: " + allOrders.size());
            
            // Siparişleri tarihe göre sırala (en yeni önce)
            allOrders.sort((o1, o2) -> {
                if (o1.getCreatedAt() == null && o2.getCreatedAt() == null) return 0;
                if (o1.getCreatedAt() == null) return 1;
                if (o2.getCreatedAt() == null) return -1;
                return o2.getCreatedAt().compareTo(o1.getCreatedAt());
            });
            
            // Sayfalama hesaplamaları
            int totalOrders = allOrders.size();
            int totalPages = (int) Math.ceil((double) totalOrders / size);
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, totalOrders);
            
            // Sayfa için siparişleri al
            List<Order> pageOrders = allOrders.subList(startIndex, endIndex);
            
            Map<String, Object> response = new HashMap<>();
            response.put("orders", pageOrders);
            response.put("currentPage", page);
            response.put("totalPages", totalPages);
            response.put("totalOrders", totalOrders);
            response.put("hasNext", page < totalPages - 1);
            response.put("hasPrevious", page > 0);
            
            System.out.println("Response being sent: " + response);
            System.out.println("Orders in response: " + pageOrders.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("ERROR in getRecentOrders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Hızlı istatistikler
    @GetMapping("/dashboard/quick-stats")
    public ResponseEntity<Map<String, Object>> getQuickStats() {
        try {
            Map<String, Object> quickStats = new HashMap<>();
            
            // Bu hafta sipariş sayısı
            java.time.LocalDateTime weekStart = java.time.LocalDateTime.now().minusWeeks(1);
            long weeklyOrders = orderRepository.findAll().stream()
                .filter(order -> order.getCreatedAt() != null && 
                               order.getCreatedAt().isAfter(weekStart))
                .count();
            
            // Bu ay gelir
            java.time.LocalDateTime monthStart = java.time.LocalDateTime.now().minusMonths(1);
            double monthlyRevenue = orderRepository.findAll().stream()
                .filter(order -> order.getCreatedAt() != null && 
                               order.getCreatedAt().isAfter(monthStart) &&
                               "COMPLETED".equals(order.getStatus()))
                .mapToDouble(order -> order.getTotalPrice().doubleValue())
                .sum();
            
            // Yeni kullanıcı sayısı (son 30 gün) - User entity'sinde createdAt yok, tüm USER rolündeki kullanıcıları say
            long newUsers = userRepository.findAll().stream()
                .filter(user -> "USER".equals(user.getRole().getName()))
                .count();
            
            quickStats.put("weeklyOrders", weeklyOrders);
            quickStats.put("monthlyRevenue", monthlyRevenue);
            quickStats.put("newUsers", newUsers);
            
            return ResponseEntity.ok(quickStats);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Hızlı istatistikler alınamadı: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Tüm satıcıları getir
    @GetMapping("/sellers")
    public ResponseEntity<List<User>> getAllSellers() {
        try {
            List<User> sellers = userRepository.findAll(); // Geçici olarak tüm kullanıcıları döndür
            return ResponseEntity.ok(sellers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

               // Tüm ürünleri getir
           @GetMapping("/products")
           public ResponseEntity<List<Product>> getAllProducts() {
               try {
                   List<Product> products = productRepository.findAll();
                   return ResponseEntity.ok(products);
               } catch (Exception e) {
                   return ResponseEntity.badRequest().build();
               }
           }

           // Ürün durumunu güncelle (onayla/reddet)
           @PutMapping("/products/{id}/status")
           public ResponseEntity<?> updateProductStatus(@PathVariable String id, @RequestParam String status) {
               try {
                   Product product = productRepository.findById(id).orElse(null);
                   if (product == null) {
                       return ResponseEntity.notFound().build();
                   }
                   
                   product.setStatus(status);
                   productRepository.save(product);
                   
                   Map<String, Object> response = new HashMap<>();
                   response.put("message", "Ürün durumu güncellendi");
                   response.put("product", product);
                   
                   return ResponseEntity.ok(response);
               } catch (Exception e) {
                   Map<String, Object> error = new HashMap<>();
                   error.put("error", "Ürün durumu güncellenemedi: " + e.getMessage());
                   return ResponseEntity.badRequest().body(error);
               }
           }

           // Ürün detaylarını getir
           @GetMapping("/products/{id}")
           public ResponseEntity<Product> getProductById(@PathVariable String id) {
               try {
                   Product product = productRepository.findById(id).orElse(null);
                   if (product == null) {
                       return ResponseEntity.notFound().build();
                   }
                   return ResponseEntity.ok(product);
               } catch (Exception e) {
                   return ResponseEntity.badRequest().build();
               }
           }

                       // Duruma göre ürünleri getir
            @GetMapping("/products/status/{status}")
            public ResponseEntity<List<Product>> getProductsByStatus(@PathVariable String status) {
                try {
                    List<Product> products = productRepository.findByStatus(status);
                    return ResponseEntity.ok(products);
                } catch (Exception e) {
                    return ResponseEntity.badRequest().build();
                }
            }

            // Ürün istatistikleri
            @GetMapping("/products/stats")
            public ResponseEntity<Map<String, Object>> getProductStats() {
                try {
                    System.out.println("=== DEBUG: getProductStats called ===");
                    
                    List<Product> allProducts = productRepository.findAll();
                    
                    long totalProducts = allProducts.size();
                    long activeProducts = allProducts.stream()
                        .filter(product -> "AKTİF".equals(product.getStatus()))
                        .count();
                    long pendingProducts = allProducts.stream()
                        .filter(product -> "BEKLEMEDE".equals(product.getStatus()))
                        .count();
                    
                    Map<String, Object> stats = new HashMap<>();
                    stats.put("totalProducts", totalProducts);
                    stats.put("activeProducts", activeProducts);
                    stats.put("pendingProducts", pendingProducts);
                    
                    System.out.println("Product stats: " + stats);
                    return ResponseEntity.ok(stats);
                } catch (Exception e) {
                    System.out.println("Error in getProductStats: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Ürün istatistikleri alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

               // Tüm siparişleri getir
           @GetMapping("/orders")
           public ResponseEntity<List<Order>> getAllOrders() {
               try {
                   List<Order> orders = orderRepository.findAll();
                   return ResponseEntity.ok(orders);
               } catch (Exception e) {
                   return ResponseEntity.badRequest().build();
               }
           }

           // Sipariş durumunu güncelle
           @PutMapping("/orders/{id}/status")
           public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestParam String status) {
               try {
                   Order order = orderRepository.findById(id).orElse(null);
                   if (order == null) {
                       return ResponseEntity.notFound().build();
                   }
                   
                   order.setStatus(status);
                   orderRepository.save(order);
                   
                   Map<String, Object> response = new HashMap<>();
                   response.put("message", "Sipariş durumu güncellendi");
                   response.put("order", order);
                   
                   return ResponseEntity.ok(response);
               } catch (Exception e) {
                   Map<String, Object> error = new HashMap<>();
                   error.put("error", "Sipariş durumu güncellenemedi: " + e.getMessage());
                   return ResponseEntity.badRequest().body(error);
               }
           }

           // Sipariş detaylarını getir
           @GetMapping("/orders/{id}")
           public ResponseEntity<Order> getOrderById(@PathVariable String id) {
               try {
                   Order order = orderRepository.findById(id).orElse(null);
                   if (order == null) {
                       return ResponseEntity.notFound().build();
                   }
                   return ResponseEntity.ok(order);
               } catch (Exception e) {
                   return ResponseEntity.badRequest().build();
               }
           }

                       // Duruma göre siparişleri getir
            @GetMapping("/orders/status/{status}")
            public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
                try {
                    List<Order> orders = orderRepository.findByStatus(status);
                    return ResponseEntity.ok(orders);
                } catch (Exception e) {
                    return ResponseEntity.badRequest().build();
                }
            }

            // Sipariş istatistikleri
            @GetMapping("/orders/stats")
            public ResponseEntity<Map<String, Object>> getOrderStats() {
                try {
                    System.out.println("=== DEBUG: getOrderStats called ===");
                    
                    List<Order> allOrders = orderRepository.findAll();
                    
                    long totalOrders = allOrders.size();
                    long pendingOrders = allOrders.stream()
                        .filter(order -> "PENDING".equals(order.getStatus()))
                        .count();
                    long completedOrders = allOrders.stream()
                        .filter(order -> "COMPLETED".equals(order.getStatus()))
                        .count();
                    
                    // Toplam gelir hesaplama
                    double totalRevenue = allOrders.stream()
                        .filter(order -> "COMPLETED".equals(order.getStatus()))
                        .mapToDouble(order -> order.getTotalPrice().doubleValue())
                        .sum();
                    
                    Map<String, Object> stats = new HashMap<>();
                    stats.put("totalOrders", totalOrders);
                    stats.put("pendingOrders", pendingOrders);
                    stats.put("completedOrders", completedOrders);
                    stats.put("totalRevenue", totalRevenue);
                    
                    System.out.println("Order stats: " + stats);
                    return ResponseEntity.ok(stats);
                } catch (Exception e) {
                    System.out.println("Error in getOrderStats: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Sipariş istatistikleri alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

    // Tüm mağazaları getir
    @GetMapping("/stores")
    public ResponseEntity<List<Store>> getAllStores() {
        try {
            List<Store> stores = storeRepository.findAll();
            return ResponseEntity.ok(stores);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

               // Elasticsearch ile arama
           @GetMapping("/search")
           public ResponseEntity<?> searchAll(@RequestParam String q) {
               try {
                   Map<String, Object> results = adminService.searchAll(q);
                   return ResponseEntity.ok(results);
               } catch (Exception e) {
                   return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
               }
           }

           // Finansal raporlar
           @GetMapping("/financial/reports")
           public ResponseEntity<Map<String, Object>> getFinancialReports() {
               try {
                   Map<String, Object> reports = adminService.getFinancialReports();
                   return ResponseEntity.ok(reports);
               } catch (Exception e) {
                   Map<String, Object> error = new HashMap<>();
                   error.put("error", "Finansal raporlar alınamadı: " + e.getMessage());
                   return ResponseEntity.badRequest().body(error);
               }
           }

           // Aylık satış raporu
           @GetMapping("/financial/monthly-sales")
           public ResponseEntity<Map<String, Object>> getMonthlySalesReport() {
               try {
                   Map<String, Object> report = adminService.getMonthlySalesReport();
                   return ResponseEntity.ok(report);
               } catch (Exception e) {
                   Map<String, Object> error = new HashMap<>();
                   error.put("error", "Aylık satış raporu alınamadı: " + e.getMessage());
                   return ResponseEntity.badRequest().body(error);
               }
           }
}
