package com.bahattintok.e_commerce.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
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

import com.bahattintok.e_commerce.event.OrderShippedEvent;
import com.bahattintok.e_commerce.model.CategoryRequest;
import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.model.enums.SellerStatus;
import com.bahattintok.e_commerce.repository.CategoryRequestRepository;
import com.bahattintok.e_commerce.repository.OrderRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.AdminService;
import com.bahattintok.e_commerce.service.SystemSettingsService;

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

    @Autowired
    private CategoryRequestRepository categoryRequestRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    private SystemSettingsService systemSettingsService;

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
                System.out.println("=== ROLE FILTERING DEBUG ===");
                System.out.println("Requested role filter: '" + role + "'");
                System.out.println("Total users before filtering: " + allUsers.size());
                
                allUsers = allUsers.stream()
                    .filter(user -> {
                        if (user.getRole() == null) {
                            return false;
                        }
                        String userRoleName = user.getRole().getName();
                        boolean matches = userRoleName.equals(role);
                        System.out.println("🔍 User " + user.getEmail() + " -> Role: '" + userRoleName + "' | Requested: '" + role + "' | Match: " + matches);
                        return matches;
                    })
                    .collect(Collectors.toList());
                System.out.println("✅ After role filtering, users count: " + allUsers.size());
                System.out.println("=== END ROLE FILTERING DEBUG ===");
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

            // Rapor istatistikleri
            @GetMapping("/reports/stats")
            public ResponseEntity<Map<String, Object>> getReportStats() {
                try {
                    System.out.println("=== DEBUG: getReportStats called ===");
                    
                    List<Order> allOrders = orderRepository.findAll();
                    List<User> allUsers = userRepository.findAll();
                    List<Product> allProducts = productRepository.findAll();
                    
                    // Toplam gelir
                    double totalRevenue = allOrders.stream()
                        .filter(order -> "COMPLETED".equals(order.getStatus()))
                        .mapToDouble(order -> order.getTotalPrice().doubleValue())
                        .sum();
                    
                    // Toplam sipariş
                    long totalOrders = allOrders.size();
                    
                    // Toplam kullanıcı (USER rolü)
                    long totalUsers = allUsers.stream()
                        .filter(user -> user.getRole() != null && "USER".equals(user.getRole().getName()))
                        .count();
                    
                    // Toplam ürün
                    long totalProducts = allProducts.size();
                    
                    // Büyüme oranı (basit hesaplama)
                    double growthRate = 15.5; // Örnek değer
                    
                    Map<String, Object> stats = new HashMap<>();
                    stats.put("totalRevenue", totalRevenue);
                    stats.put("totalOrders", totalOrders);
                    stats.put("totalUsers", totalUsers);
                    stats.put("totalProducts", totalProducts);
                    stats.put("growthRate", growthRate);
                    
                    System.out.println("Report stats: " + stats);
                    return ResponseEntity.ok(stats);
                } catch (Exception e) {
                    System.out.println("Error in getReportStats: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Rapor istatistikleri alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // Satış trendi
            @GetMapping("/reports/sales")
            public ResponseEntity<Map<String, Object>> getSalesData(@RequestParam String range) {
                try {
                    System.out.println("=== DEBUG: getSalesData called with range: " + range + " ===");
                    
                    // Örnek satış verileri
                    Map<String, Object> salesData = new HashMap<>();
                    
                    if ("week".equals(range)) {
                        salesData.put("labels", new String[]{"Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"});
                        salesData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Satışlar",
                                "data", new int[]{120, 190, 300, 500, 200, 300, 450},
                                "borderColor", "rgb(255, 96, 0)",
                                "backgroundColor", "rgba(255, 96, 0, 0.1)",
                                "tension", 0.4
                            )
                        });
                    } else if ("month".equals(range)) {
                        salesData.put("labels", new String[]{"1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"});
                        salesData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Satışlar",
                                "data", new int[]{1200, 1900, 3000, 2500},
                                "borderColor", "rgb(255, 96, 0)",
                                "backgroundColor", "rgba(255, 96, 0, 0.1)",
                                "tension", 0.4
                            )
                        });
                    } else {
                        salesData.put("labels", new String[]{"Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"});
                        salesData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Satışlar",
                                "data", new int[]{5000, 6000, 7500, 8000, 9000, 10000},
                                "borderColor", "rgb(255, 96, 0)",
                                "backgroundColor", "rgba(255, 96, 0, 0.1)",
                                "tension", 0.4
                            )
                        });
                    }
                    
                    System.out.println("Sales data: " + salesData);
                    return ResponseEntity.ok(salesData);
                } catch (Exception e) {
                    System.out.println("Error in getSalesData: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Satış verileri alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // Gelir analizi (Raporlar sayfası için)
            @GetMapping("/reports/revenue")
            public ResponseEntity<Map<String, Object>> getReportsRevenueData(@RequestParam String range) {
                try {
                    System.out.println("=== DEBUG: getReportsRevenueData called with range: " + range + " ===");
                    
                    // Örnek gelir verileri
                    Map<String, Object> revenueData = new HashMap<>();
                    
                    if ("week".equals(range)) {
                        revenueData.put("labels", new String[]{"Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"});
                        revenueData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Gelir",
                                "data", new int[]{12000, 19000, 30000, 50000, 20000, 30000, 45000},
                                "backgroundColor", "rgba(16, 185, 129, 0.8)"
                            )
                        });
                    } else if ("month".equals(range)) {
                        revenueData.put("labels", new String[]{"1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"});
                        revenueData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Gelir",
                                "data", new int[]{120000, 190000, 300000, 250000},
                                "backgroundColor", "rgba(16, 185, 129, 0.8)"
                            )
                        });
                    } else {
                        revenueData.put("labels", new String[]{"Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"});
                        revenueData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Gelir",
                                "data", new int[]{500000, 600000, 750000, 800000, 900000, 1000000},
                                "backgroundColor", "rgba(16, 185, 129, 0.8)"
                            )
                        });
                    }
                    
                    System.out.println("Reports revenue data: " + revenueData);
                    return ResponseEntity.ok(revenueData);
                } catch (Exception e) {
                    System.out.println("Error in getReportsRevenueData: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Gelir verileri alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // Kategori dağılımı
            @GetMapping("/reports/categories")
            public ResponseEntity<Map<String, Object>> getCategoryData() {
                try {
                    System.out.println("=== DEBUG: getCategoryData called ===");
                    
                    // Örnek kategori verileri
                    Map<String, Object> categoryData = new HashMap<>();
                    categoryData.put("labels", new String[]{"Elektronik", "Giyim", "Ev & Yaşam", "Spor", "Kitap"});
                    categoryData.put("datasets", new Object[]{
                        Map.of(
                            "label", "Satış Oranı",
                            "data", new int[]{35, 25, 20, 15, 5},
                            "backgroundColor", new String[]{
                                "rgba(255, 99, 132, 0.8)",
                                "rgba(54, 162, 235, 0.8)",
                                "rgba(255, 206, 86, 0.8)",
                                "rgba(75, 192, 192, 0.8)",
                                "rgba(153, 102, 255, 0.8)"
                            }
                        )
                    });
                    
                    System.out.println("Category data: " + categoryData);
                    return ResponseEntity.ok(categoryData);
                } catch (Exception e) {
                    System.out.println("Error in getCategoryData: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Kategori verileri alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // ========== FİNANSAL YÖNETİM ENDPOİNTLERİ ==========
            
            // Ana finansal veriler
            @GetMapping("/financial/data")
            public ResponseEntity<Map<String, Object>> getFinancialData(@RequestParam String range) {
                try {
                    System.out.println("=== DEBUG: getFinancialData called with range: " + range + " ===");
                    
                    List<Order> allOrders = orderRepository.findAll();
                    
                    // Toplam gelir
                    double totalRevenue = allOrders.stream()
                        .filter(order -> "COMPLETED".equals(order.getStatus()))
                        .mapToDouble(order -> order.getTotalPrice().doubleValue())
                        .sum();
                    
                    // Toplam gider (örnek hesaplama)
                    double totalExpenses = totalRevenue * 0.35; // %35 gider oranı
                    
                    // Net kar
                    double netProfit = totalRevenue - totalExpenses;
                    
                    // Kar marjı
                    double profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
                    
                    // Büyüme oranı
                    double growthRate = 12.5; // Örnek değer
                    
                    Map<String, Object> financialData = new HashMap<>();
                    financialData.put("revenue", totalRevenue);
                    financialData.put("expenses", totalExpenses);
                    financialData.put("profit", netProfit);
                    financialData.put("profitMargin", Math.round(profitMargin * 10.0) / 10.0);
                    financialData.put("growthRate", growthRate);
                    
                    System.out.println("Financial data: " + financialData);
                    return ResponseEntity.ok(financialData);
                } catch (Exception e) {
                    System.out.println("Error in getFinancialData: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Finansal veriler alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // Gelir trendi
            @GetMapping("/financial/revenue")
            public ResponseEntity<Map<String, Object>> getRevenueData(@RequestParam String range) {
                try {
                    System.out.println("=== DEBUG: getRevenueData called with range: " + range + " ===");
                    
                    Map<String, Object> revenueData = new HashMap<>();
                    
                    if ("week".equals(range)) {
                        revenueData.put("labels", new String[]{"Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"});
                        revenueData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Gelir",
                                "data", new int[]{45000, 52000, 48000, 61000, 55000, 68000, 72000},
                                "borderColor", "rgb(16, 185, 129)",
                                "backgroundColor", "rgba(16, 185, 129, 0.1)",
                                "tension", 0.4
                            )
                        });
                    } else if ("month".equals(range)) {
                        revenueData.put("labels", new String[]{"1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"});
                        revenueData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Gelir",
                                "data", new int[]{320000, 380000, 420000, 450000},
                                "borderColor", "rgb(16, 185, 129)",
                                "backgroundColor", "rgba(16, 185, 129, 0.1)",
                                "tension", 0.4
                            )
                        });
                    } else {
                        revenueData.put("labels", new String[]{"Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"});
                        revenueData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Gelir",
                                "data", new int[]{1200000, 1350000, 1500000, 1650000, 1800000, 1950000},
                                "borderColor", "rgb(16, 185, 129)",
                                "backgroundColor", "rgba(16, 185, 129, 0.1)",
                                "tension", 0.4
                            )
                        });
                    }
                    
                    System.out.println("Revenue data: " + revenueData);
                    return ResponseEntity.ok(revenueData);
                } catch (Exception e) {
                    System.out.println("Error in getRevenueData: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Gelir verileri alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // Gider trendi
            @GetMapping("/financial/expenses")
            public ResponseEntity<Map<String, Object>> getExpenseData(@RequestParam String range) {
                try {
                    System.out.println("=== DEBUG: getExpenseData called with range: " + range + " ===");
                    
                    Map<String, Object> expenseData = new HashMap<>();
                    
                    if ("week".equals(range)) {
                        expenseData.put("labels", new String[]{"Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"});
                        expenseData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Gider",
                                "data", new int[]{15000, 18000, 16000, 21000, 19000, 24000, 25000},
                                "borderColor", "rgb(239, 68, 68)",
                                "backgroundColor", "rgba(239, 68, 68, 0.1)",
                                "tension", 0.4
                            )
                        });
                    } else if ("month".equals(range)) {
                        expenseData.put("labels", new String[]{"1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"});
                        expenseData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Gider",
                                "data", new int[]{110000, 130000, 145000, 155000},
                                "borderColor", "rgb(239, 68, 68)",
                                "backgroundColor", "rgba(239, 68, 68, 0.1)",
                                "tension", 0.4
                            )
                        });
                    } else {
                        expenseData.put("labels", new String[]{"Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"});
                        expenseData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Gider",
                                "data", new int[]{420000, 470000, 520000, 570000, 620000, 670000},
                                "borderColor", "rgb(239, 68, 68)",
                                "backgroundColor", "rgba(239, 68, 68, 0.1)",
                                "tension", 0.4
                            )
                        });
                    }
                    
                    System.out.println("Expense data: " + expenseData);
                    return ResponseEntity.ok(expenseData);
                } catch (Exception e) {
                    System.out.println("Error in getExpenseData: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Gider verileri alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // Kar analizi
            @GetMapping("/financial/profit")
            public ResponseEntity<Map<String, Object>> getProfitData(@RequestParam String range) {
                try {
                    System.out.println("=== DEBUG: getProfitData called with range: " + range + " ===");
                    
                    Map<String, Object> profitData = new HashMap<>();
                    
                    if ("week".equals(range)) {
                        profitData.put("labels", new String[]{"Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"});
                        profitData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Kar",
                                "data", new int[]{30000, 34000, 32000, 40000, 36000, 44000, 47000},
                                "backgroundColor", "rgba(59, 130, 246, 0.8)"
                            )
                        });
                    } else if ("month".equals(range)) {
                        profitData.put("labels", new String[]{"1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"});
                        profitData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Kar",
                                "data", new int[]{210000, 250000, 275000, 295000},
                                "backgroundColor", "rgba(59, 130, 246, 0.8)"
                            )
                        });
                    } else {
                        profitData.put("labels", new String[]{"Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"});
                        profitData.put("datasets", new Object[]{
                            Map.of(
                                "label", "Kar",
                                "data", new int[]{780000, 880000, 980000, 1080000, 1180000, 1280000},
                                "backgroundColor", "rgba(59, 130, 246, 0.8)"
                            )
                        });
                    }
                    
                    System.out.println("Profit data: " + profitData);
                    return ResponseEntity.ok(profitData);
                } catch (Exception e) {
                    System.out.println("Error in getProfitData: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Kar verileri alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // Gider kategorileri
            @GetMapping("/financial/expense-categories")
            public ResponseEntity<Map<String, Object>> getExpenseCategories() {
                try {
                    System.out.println("=== DEBUG: getExpenseCategories called ===");
                    
                    Map<String, Object> categoryData = new HashMap<>();
                    categoryData.put("labels", new String[]{"Personel", "Pazarlama", "Teknoloji", "Ofis", "Diğer"});
                    categoryData.put("datasets", new Object[]{
                        Map.of(
                            "label", "Gider Dağılımı",
                            "data", new int[]{40, 25, 20, 10, 5},
                            "backgroundColor", new String[]{
                                "rgba(239, 68, 68, 0.8)",
                                "rgba(245, 158, 11, 0.8)",
                                "rgba(59, 130, 246, 0.8)",
                                "rgba(16, 185, 129, 0.8)",
                                "rgba(139, 92, 246, 0.8)"
                            }
                        )
                    });
                    
                    System.out.println("Expense categories: " + categoryData);
                    return ResponseEntity.ok(categoryData);
                } catch (Exception e) {
                    System.out.println("Error in getExpenseCategories: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Gider kategorileri alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

            // Finansal işlemler
            @GetMapping("/financial/transactions")
            public ResponseEntity<List<Map<String, Object>>> getTransactions() {
                try {
                    System.out.println("=== DEBUG: getTransactions called ===");
                    
                    List<Map<String, Object>> transactions = new ArrayList<>();
                    
                    // Örnek işlemler
                    Map<String, Object> transaction1 = new HashMap<>();
                    transaction1.put("id", "1");
                    transaction1.put("title", "Sipariş Geliri");
                    transaction1.put("description", "#12345 siparişi tamamlandı");
                    transaction1.put("type", "REVENUE");
                    transaction1.put("amount", 1250.00);
                    transaction1.put("date", "2024-01-15T10:30:00");
                    transaction1.put("status", "COMPLETED");
                    transactions.add(transaction1);
                    
                    Map<String, Object> transaction2 = new HashMap<>();
                    transaction2.put("id", "2");
                    transaction2.put("title", "Pazarlama Gideri");
                    transaction2.put("description", "Google Ads reklam ödemesi");
                    transaction2.put("type", "EXPENSE");
                    transaction2.put("amount", 500.00);
                    transaction2.put("date", "2024-01-15T09:15:00");
                    transaction2.put("status", "COMPLETED");
                    transactions.add(transaction2);
                    
                    Map<String, Object> transaction3 = new HashMap<>();
                    transaction3.put("id", "3");
                    transaction3.put("title", "İade İşlemi");
                    transaction3.put("description", "#12344 siparişi iade edildi");
                    transaction3.put("type", "REFUND");
                    transaction3.put("amount", 850.00);
                    transaction3.put("date", "2024-01-14T16:45:00");
                    transaction3.put("status", "COMPLETED");
                    transactions.add(transaction3);
                    
                    Map<String, Object> transaction4 = new HashMap<>();
                    transaction4.put("id", "4");
                    transaction4.put("title", "Personel Maaşı");
                    transaction4.put("description", "Ocak ayı personel maaşları");
                    transaction4.put("type", "EXPENSE");
                    transaction4.put("amount", 15000.00);
                    transaction4.put("date", "2024-01-14T08:00:00");
                    transaction4.put("status", "PENDING");
                    transactions.add(transaction4);
                    
                    Map<String, Object> transaction5 = new HashMap<>();
                    transaction5.put("id", "5");
                    transaction5.put("title", "Toplu Sipariş Geliri");
                    transaction5.put("description", "Kurumsal müşteri siparişi");
                    transaction5.put("type", "REVENUE");
                    transaction5.put("amount", 5000.00);
                    transaction5.put("date", "2024-01-13T14:20:00");
                    transaction5.put("status", "COMPLETED");
                    transactions.add(transaction5);
                    
                    System.out.println("Transactions: " + transactions);
                    return ResponseEntity.ok(transactions);
                } catch (Exception e) {
                    System.out.println("Error in getTransactions: " + e.getMessage());
                    e.printStackTrace();
                    return ResponseEntity.badRequest().build();
                }
            }

            // Bütçe verileri
            @GetMapping("/financial/budget")
            public ResponseEntity<Map<String, Object>> getBudget() {
                try {
                    System.out.println("=== DEBUG: getBudget called ===");
                    
                    Map<String, Object> budget = new HashMap<>();
                    budget.put("total", 100000.00);
                    budget.put("used", 75000.00);
                    budget.put("remaining", 25000.00);
                    budget.put("percentage", 75);
                    
                    System.out.println("Budget: " + budget);
                    return ResponseEntity.ok(budget);
                } catch (Exception e) {
                    System.out.println("Error in getBudget: " + e.getMessage());
                    e.printStackTrace();
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Bütçe verileri alınamadı: " + e.getMessage());
                    return ResponseEntity.badRequest().body(error);
                }
            }

    // Dashboard bildirimleri endpoint'i
    @GetMapping("/dashboard/notifications")
    public ResponseEntity<Map<String, Object>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        try {
            System.out.println("=== DEBUG: getNotifications called ===");
            System.out.println("Page: " + page + ", Size: " + size);
            
            List<Map<String, Object>> notifications = new ArrayList<>();
            
            // Gerçek kategori isteklerini al
            List<CategoryRequest> categoryRequests = categoryRequestRepository.findAll();
            System.out.println("Found " + categoryRequests.size() + " category requests");
            
            // Onay bekleyen satıcıları al
            List<User> pendingSellers = userRepository.findByRoleNameAndSellerStatus("SELLER", SellerStatus.PENDING);
            System.out.println("Found " + pendingSellers.size() + " pending sellers");
            
            // Son 7 günde kayıt olan tüm seller'ları al
            java.time.LocalDateTime sevenDaysAgo = java.time.LocalDateTime.now().minusDays(7);
            List<User> recentSellers = userRepository.findByRoleNameAndRegistrationDateAfter("SELLER", sevenDaysAgo);
            System.out.println("Found " + recentSellers.size() + " recent sellers");
            
            // Satıcı bildirimlerini ekle
            for (User seller : pendingSellers) {
                Map<String, Object> notification = new HashMap<>();
                notification.put("id", "SELLER-" + seller.getId());
                notification.put("title", "🆕 Yeni Satıcı Başvurusu");
                notification.put("message", String.format("'%s %s' satıcı başvurusu bekliyor (Email: %s)",
                        seller.getFirstName(), seller.getLastName(), seller.getEmail()));
                notification.put("type", "warning");
                notification.put("createdAt", seller.getSellerApplicationDate() != null ? 
                    seller.getSellerApplicationDate().toString() : java.time.LocalDateTime.now().toString());
                notification.put("sellerId", seller.getId());
                notification.put("isNewRegistration", true);
                notifications.add(notification);
            }
            
            // Son kayıt olan seller'ları da ekle (onay beklemeyenler)
            for (User seller : recentSellers) {
                if (seller.getSellerStatus() != SellerStatus.PENDING) {
                    Map<String, Object> notification = new HashMap<>();
                    notification.put("id", "SELLER-NEW-" + seller.getId());
                    notification.put("title", "📝 Yeni Satıcı Kaydı");
                    notification.put("message", String.format("'%s %s' satıcı olarak kayıt oldu (Email: %s)",
                            seller.getFirstName(), seller.getLastName(), seller.getEmail()));
                    notification.put("type", "info");
                    notification.put("createdAt", seller.getRegistrationDate() != null ? 
                        seller.getRegistrationDate().toString() : java.time.LocalDateTime.now().toString());
                    notification.put("sellerId", seller.getId());
                    notification.put("isNewRegistration", true);
                    notifications.add(notification);
                }
            }
            
            // Kategori isteklerini bildirimlere dönüştür
            for (CategoryRequest request : categoryRequests) {
                Map<String, Object> notification = new HashMap<>();
                notification.put("id", request.getId());
                notification.put("title", "Kategori İsteği: " + request.getCategoryName());
                notification.put("message", request.getDescription() + " - " + 
                    (request.getSeller() != null ? 
                        (request.getSeller().getFirstName() != null ? 
                            request.getSeller().getFirstName() + " " + 
                            (request.getSeller().getLastName() != null ? request.getSeller().getLastName() : "") 
                            : request.getSeller().getEmail()) 
                        : "Bilinmeyen Satıcı"));
                
                // Duruma göre bildirim türünü belirle
                String notificationType = "info";
                if (request.getStatus() != null) {
                    switch (request.getStatus().toString()) {
                        case "PENDING":
                            notificationType = "warning";
                            break;
                        case "APPROVED":
                            notificationType = "success";
                            break;
                        case "REJECTED":
                            notificationType = "error";
                            break;
                        default:
                            notificationType = "info";
                    }
                }
                
                notification.put("type", notificationType);
                notification.put("createdAt", request.getCreatedAt() != null ? 
                    request.getCreatedAt().toString() : java.time.LocalDateTime.now().toString());
                notification.put("categoryRequestId", request.getId());
                notification.put("status", request.getStatus().toString());
                
                notifications.add(notification);
            }
            
            // Sipariş bildirimleri ekle (son 5 sipariş)
            List<Order> recentOrders = orderRepository.findAll();
            if (recentOrders.size() > 5) {
                recentOrders = recentOrders.subList(0, 5);
            }
            
            for (Order order : recentOrders) {
                Map<String, Object> notification = new HashMap<>();
                notification.put("id", "order_" + order.getId());
                notification.put("title", "Sipariş: " + order.getStatus());
                notification.put("message", "#" + order.getId().substring(0, 8) + " siparişi " + 
                    (order.getUser() != null ? 
                        (order.getUser().getFirstName() != null ? 
                            order.getUser().getFirstName() + " " + 
                            (order.getUser().getLastName() != null ? order.getUser().getLastName() : "") 
                            : order.getUser().getEmail()) 
                        : "Bilinmeyen Müşteri") + " tarafından verildi");
                
                String notificationType = "info";
                switch (order.getStatus()) {
                    case "COMPLETED":
                        notificationType = "success";
                        break;
                    case "PENDING":
                        notificationType = "warning";
                        break;
                    case "CANCELLED":
                        notificationType = "error";
                        break;
                    default:
                        notificationType = "info";
                }
                
                notification.put("type", notificationType);
                notification.put("createdAt", order.getCreatedAt() != null ? 
                    order.getCreatedAt().toString() : java.time.LocalDateTime.now().toString());
                notification.put("orderId", order.getId());
                
                notifications.add(notification);
            }
            
            // Bildirimleri tarihe göre sırala (en yeni önce)
            notifications.sort((n1, n2) -> {
                String date1 = (String) n1.get("createdAt");
                String date2 = (String) n2.get("createdAt");
                if (date1 == null && date2 == null) return 0;
                if (date1 == null) return 1;
                if (date2 == null) return -1;
                return date2.compareTo(date1);
            });
            
            // Sayfalama hesaplamaları
            int totalNotifications = notifications.size();
            int totalPages = (int) Math.ceil((double) totalNotifications / size);
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, totalNotifications);
            
            // Sayfa için bildirimleri al
            List<Map<String, Object>> pageNotifications = notifications.subList(startIndex, endIndex);
            
            Map<String, Object> response = new HashMap<>();
            response.put("notifications", pageNotifications);
            response.put("currentPage", page);
            response.put("totalPages", totalPages);
            response.put("totalNotifications", totalNotifications);
            response.put("hasNext", page < totalPages - 1);
            response.put("hasPrevious", page > 0);
            
            System.out.println("Notifications: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in getNotifications: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Bildirimler alınamadı: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Sipariş kargoya verildi endpoint'i
    @PutMapping("/orders/{orderId}/ship")
    public ResponseEntity<Map<String, Object>> shipOrder(
            @PathVariable String orderId,
            @RequestParam String trackingNumber) {
        try {
            System.out.println("=== DEBUG: shipOrder called ===");
            System.out.println("Order ID: " + orderId + ", Tracking Number: " + trackingNumber);
            
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı: " + orderId));
            
            // Sipariş durumunu güncelle
            order.setStatus("SHIPPED");
            orderRepository.save(order);
            
            // Kargo bilgisi email'i gönder
            eventPublisher.publishEvent(new OrderShippedEvent(this, order, trackingNumber));
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Sipariş kargoya verildi");
            response.put("orderId", orderId);
            response.put("trackingNumber", trackingNumber);
            response.put("status", "SHIPPED");
            
            System.out.println("Order shipped successfully: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in shipOrder: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Sipariş kargoya verilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // ==================== SATICI ONAY SİSTEMİ ENDPOINT'LERİ ====================

    // Satıcı istatistikleri
    @GetMapping("/sellers/stats")
    public ResponseEntity<Map<String, Object>> getSellerStats() {
        try {
            System.out.println("=== DEBUG: getSellerStats called ===");
            
            List<User> allSellers = userRepository.findByRoleName("SELLER");
            
            // İstatistikleri hesapla
            long totalSellers = allSellers.size();
            long activeSellers = allSellers.stream()
                .filter(seller -> seller.getSellerStatus() != null && 
                        (seller.getSellerStatus().name().equals("ACTIVE") || 
                         seller.getSellerStatus().name().equals("APPROVED")))
                .count();
            long pendingSellers = allSellers.stream()
                .filter(seller -> seller.getSellerStatus() != null && 
                        seller.getSellerStatus().name().equals("PENDING"))
                .count();
            long rejectedSellers = allSellers.stream()
                .filter(seller -> seller.getSellerStatus() != null && 
                        seller.getSellerStatus().name().equals("REJECTED"))
                .count();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalSellers", totalSellers);
            stats.put("activeSellers", activeSellers);
            stats.put("pendingSellers", pendingSellers);
            stats.put("rejectedSellers", rejectedSellers);
            
            System.out.println("Seller stats: " + stats);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.out.println("Error in getSellerStats: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Satıcı istatistikleri alınamadı: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Satıcı listesi (onay bekleyenler dahil)
    @GetMapping("/sellers")
    public ResponseEntity<Map<String, Object>> getSellers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        try {
            System.out.println("=== DEBUG: getSellers called ===");
            System.out.println("Page: " + page + ", Size: " + size + ", Status: " + status + ", Search: " + search);
            
            List<User> allSellers = userRepository.findByRoleName("SELLER");
            
            // Durum filtresi
            if (status != null && !status.trim().isEmpty()) {
                allSellers = allSellers.stream()
                    .filter(seller -> seller.getSellerStatus() != null && 
                            seller.getSellerStatus().name().equals(status))
                    .collect(Collectors.toList());
            }
            
            // Arama filtresi
            if (search != null && !search.trim().isEmpty()) {
                allSellers = allSellers.stream()
                    .filter(seller -> 
                        (seller.getFirstName() != null && seller.getFirstName().toLowerCase().contains(search.toLowerCase())) ||
                        (seller.getLastName() != null && seller.getLastName().toLowerCase().contains(search.toLowerCase())) ||
                        (seller.getEmail() != null && seller.getEmail().toLowerCase().contains(search.toLowerCase()))
                    )
                    .collect(Collectors.toList());
            }
            
            // Sayfalama hesaplamaları
            int totalSellers = allSellers.size();
            int totalPages = (int) Math.ceil((double) totalSellers / size);
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, totalSellers);
            
            // Sayfa için satıcıları al
            List<User> pageSellers = allSellers.subList(startIndex, endIndex);
            
            // Satıcı verilerini hazırla
            List<Map<String, Object>> sellersData = pageSellers.stream().map(seller -> {
                Map<String, Object> sellerData = new HashMap<>();
                sellerData.put("id", seller.getId());
                sellerData.put("firstName", seller.getFirstName());
                sellerData.put("lastName", seller.getLastName());
                sellerData.put("email", seller.getEmail());
                sellerData.put("phone", seller.getPhone());
                sellerData.put("createdAt", seller.getRegistrationDate()); // Kayıt tarihi için
                sellerData.put("registrationDate", seller.getRegistrationDate());
                sellerData.put("status", seller.getSellerStatus() != null ? seller.getSellerStatus().name() : "PENDING");
                sellerData.put("sellerStatus", seller.getSellerStatus() != null ? seller.getSellerStatus().name() : "PENDING");
                sellerData.put("sellerApplicationDate", seller.getSellerApplicationDate());
                sellerData.put("approvalDate", seller.getApprovalDate());
                sellerData.put("rejectionReason", seller.getRejectionReason());
                
                // Mağaza bilgilerini ekle
                try {
                    Store sellerStore = storeRepository.findBySeller(seller).orElse(null);
                    if (sellerStore != null) {
                        sellerData.put("storeName", sellerStore.getName());
                        sellerData.put("storeId", sellerStore.getId());
                        sellerData.put("storeDescription", sellerStore.getDescription());
                        sellerData.put("storeAddress", sellerStore.getAddress());
                        sellerData.put("storePhone", sellerStore.getPhone());
                        sellerData.put("storeEmail", sellerStore.getEmail());
                    } else {
                        sellerData.put("storeName", null);
                        sellerData.put("storeId", null);
                        sellerData.put("storeDescription", null);
                        sellerData.put("storeAddress", null);
                        sellerData.put("storePhone", null);
                        sellerData.put("storeEmail", null);
                    }
                } catch (Exception e) {
                    System.out.println("Store bilgisi alınamadı: " + e.getMessage());
                    sellerData.put("storeName", null);
                    sellerData.put("storeId", null);
                    sellerData.put("storeDescription", null);
                    sellerData.put("storeAddress", null);
                    sellerData.put("storePhone", null);
                    sellerData.put("storeEmail", null);
                }
                
                // Onaylayan admin bilgisi
                if (seller.getApprovedBy() != null) {
                    Map<String, Object> adminData = new HashMap<>();
                    adminData.put("id", seller.getApprovedBy().getId());
                    adminData.put("firstName", seller.getApprovedBy().getFirstName());
                    adminData.put("lastName", seller.getApprovedBy().getLastName());
                    adminData.put("email", seller.getApprovedBy().getEmail());
                    sellerData.put("approvedBy", adminData);
                }
                
                return sellerData;
            }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("sellers", sellersData);
            response.put("currentPage", page);
            response.put("totalPages", totalPages);
            response.put("totalSellers", totalSellers);
            response.put("hasNext", page < totalPages - 1);
            response.put("hasPrevious", page > 0);
            
            System.out.println("Sellers: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in getSellers: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Satıcılar alınamadı: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Satıcı onaylama
    @PostMapping("/sellers/{sellerId}/approve")
    public ResponseEntity<Map<String, Object>> approveSeller(
            @PathVariable String sellerId,
            @RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== DEBUG: approveSeller called ===");
            System.out.println("Seller ID: " + sellerId);
            
            User seller = userRepository.findById(sellerId)
                    .orElseThrow(() -> new RuntimeException("Satıcı bulunamadı: " + sellerId));
            
            // Satıcı durumunu güncelle
            seller.setSellerStatus(SellerStatus.ACTIVE);
            seller.setApprovalDate(java.time.LocalDateTime.now());
            
            // Onaylayan admin bilgisini ekle (şimdilik null, gerçek uygulamada authentication'dan alınacak)
            // seller.setApprovedBy(currentAdmin);
            
            userRepository.save(seller);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Satıcı başarıyla onaylandı");
            response.put("sellerId", sellerId);
            response.put("status", "ACTIVE");
            response.put("approvalDate", seller.getApprovalDate());
            
            System.out.println("Seller approved successfully: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in approveSeller: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Satıcı onaylanamadı: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Satıcı reddetme
    @PostMapping("/sellers/{sellerId}/reject")
    public ResponseEntity<Map<String, Object>> rejectSeller(
            @PathVariable String sellerId,
            @RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== DEBUG: rejectSeller called ===");
            System.out.println("Seller ID: " + sellerId);
            
            String rejectionReason = (String) request.get("rejectionReason");
            if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
                throw new RuntimeException("Red sebebi belirtilmelidir");
            }
            
            User seller = userRepository.findById(sellerId)
                    .orElseThrow(() -> new RuntimeException("Satıcı bulunamadı: " + sellerId));
            
            // Satıcı durumunu güncelle
            seller.setSellerStatus(SellerStatus.REJECTED);
            seller.setRejectionReason(rejectionReason);
            
            userRepository.save(seller);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Satıcı başvurusu reddedildi");
            response.put("sellerId", sellerId);
            response.put("status", "REJECTED");
            response.put("rejectionReason", rejectionReason);
            
            System.out.println("Seller rejected successfully: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in rejectSeller: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Satıcı reddedilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Satıcı aktifleştirme/pasifleştirme
    @PostMapping("/sellers/{sellerId}/toggle-status")
    public ResponseEntity<Map<String, Object>> toggleSellerStatus(
            @PathVariable String sellerId) {
        try {
            System.out.println("=== DEBUG: toggleSellerStatus called ===");
            System.out.println("Seller ID: " + sellerId);
            
            User seller = userRepository.findById(sellerId)
                    .orElseThrow(() -> new RuntimeException("Satıcı bulunamadı: " + sellerId));
            
            // Sadece onaylanmış satıcıların durumu değiştirilebilir
            if (seller.getSellerStatus() != SellerStatus.APPROVED && 
                seller.getSellerStatus() != SellerStatus.ACTIVE && 
                seller.getSellerStatus() != SellerStatus.INACTIVE) {
                throw new RuntimeException("Sadece onaylanmış satıcıların durumu değiştirilebilir");
            }
            
            // Durumu değiştir
            SellerStatus newStatus;
            if (seller.getSellerStatus() == SellerStatus.APPROVED || 
                seller.getSellerStatus() == SellerStatus.ACTIVE) {
                newStatus = SellerStatus.INACTIVE;
            } else {
                newStatus = SellerStatus.ACTIVE;
            }
            
            seller.setSellerStatus(newStatus);
            userRepository.save(seller);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Satıcı durumu güncellendi");
            response.put("sellerId", sellerId);
            response.put("status", newStatus.name());
            
            System.out.println("Seller status toggled successfully: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in toggleSellerStatus: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Satıcı durumu değiştirilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Onay bekleyen satıcı sayısı
    @GetMapping("/sellers/pending-count")
    public ResponseEntity<Map<String, Object>> getPendingSellersCount() {
        try {
            long pendingCount = userRepository.findByRoleNameAndSellerStatus("SELLER", SellerStatus.PENDING).size();
            
            Map<String, Object> response = new HashMap<>();
            response.put("pendingCount", pendingCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in getPendingSellersCount: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Onay bekleyen satıcı sayısı alınamadı: " + e.getMessage());
                         return ResponseEntity.badRequest().body(error);
         }
     }

     // ==================== SİSTEM AYARLARI ENDPOİNTLERİ ====================

     // Tüm sistem ayarlarını getir
     @GetMapping("/system-settings")
     public ResponseEntity<Map<String, Object>> getAllSystemSettings() {
         try {
             System.out.println("=== DEBUG: getAllSystemSettings called ===");
             
             List<com.bahattintok.e_commerce.model.SystemSettings> settings = systemSettingsService.getAllSettings();
             List<String> categories = systemSettingsService.getAllCategories();
             
             Map<String, Object> response = new HashMap<>();
             response.put("settings", settings);
             response.put("categories", categories);
             
             System.out.println("System settings: " + response);
             return ResponseEntity.ok(response);
         } catch (Exception e) {
             System.out.println("Error in getAllSystemSettings: " + e.getMessage());
             e.printStackTrace();
             Map<String, Object> error = new HashMap<>();
             error.put("error", "Sistem ayarları alınamadı: " + e.getMessage());
             return ResponseEntity.badRequest().body(error);
         }
     }

     // Kategoriye göre ayarları getir
     @GetMapping("/system-settings/category/{category}")
     public ResponseEntity<List<com.bahattintok.e_commerce.model.SystemSettings>> getSettingsByCategory(@PathVariable String category) {
         try {
             System.out.println("=== DEBUG: getSettingsByCategory called with category: " + category + " ===");
             
             List<com.bahattintok.e_commerce.model.SystemSettings> settings = systemSettingsService.getSettingsByCategory(category);
             
             System.out.println("Settings for category " + category + ": " + settings);
             return ResponseEntity.ok(settings);
         } catch (Exception e) {
             System.out.println("Error in getSettingsByCategory: " + e.getMessage());
             e.printStackTrace();
             return ResponseEntity.badRequest().build();
         }
     }

     // Tekil ayar güncelle
     @PutMapping("/system-settings/{key}")
     public ResponseEntity<Map<String, Object>> updateSystemSetting(
             @PathVariable String key,
             @RequestBody Map<String, String> request) {
         try {
             System.out.println("=== DEBUG: updateSystemSetting called ===");
             System.out.println("Key: " + key + ", Request: " + request);
             
             String value = request.get("value");
             if (value == null) {
                 throw new RuntimeException("Değer belirtilmelidir");
             }
             
             // Mevcut kullanıcıyı al (gerçek uygulamada authentication'dan alınacak)
             User currentUser = userRepository.findAll().stream()
                     .filter(user -> "ADMIN".equals(user.getRole().getName()))
                     .findFirst()
                     .orElse(null);
             
             com.bahattintok.e_commerce.model.SystemSettings updatedSetting = systemSettingsService.updateSetting(key, value, currentUser);
             
             Map<String, Object> response = new HashMap<>();
             response.put("message", "Ayar başarıyla güncellendi");
             response.put("setting", updatedSetting);
             
             System.out.println("Setting updated successfully: " + response);
             return ResponseEntity.ok(response);
         } catch (Exception e) {
             System.out.println("Error in updateSystemSetting: " + e.getMessage());
             e.printStackTrace();
             Map<String, Object> error = new HashMap<>();
             error.put("error", "Ayar güncellenemedi: " + e.getMessage());
             return ResponseEntity.badRequest().body(error);
         }
     }

     // Birden fazla ayar güncelle
     @PutMapping("/system-settings/batch")
     public ResponseEntity<Map<String, Object>> updateMultipleSystemSettings(@RequestBody Map<String, String> settings) {
         try {
             System.out.println("=== DEBUG: updateMultipleSystemSettings called ===");
             System.out.println("Settings: " + settings);
             
             // Mevcut kullanıcıyı al (gerçek uygulamada authentication'dan alınacak)
             User currentUser = userRepository.findAll().stream()
                     .filter(user -> "ADMIN".equals(user.getRole().getName()))
                     .findFirst()
                     .orElse(null);
             
             List<com.bahattintok.e_commerce.model.SystemSettings> updatedSettings = systemSettingsService.updateMultipleSettings(settings, currentUser);
             
             Map<String, Object> response = new HashMap<>();
             response.put("message", "Ayarlar başarıyla güncellendi");
             response.put("updatedCount", updatedSettings.size());
             response.put("settings", updatedSettings);
             
             System.out.println("Settings updated successfully: " + response);
             return ResponseEntity.ok(response);
         } catch (Exception e) {
             System.out.println("Error in updateMultipleSystemSettings: " + e.getMessage());
             e.printStackTrace();
             Map<String, Object> error = new HashMap<>();
             error.put("error", "Ayarlar güncellenemedi: " + e.getMessage());
             return ResponseEntity.badRequest().body(error);
         }
     }

     // Yeni ayar oluştur
     @PostMapping("/system-settings")
     public ResponseEntity<Map<String, Object>> createSystemSetting(@RequestBody com.bahattintok.e_commerce.model.SystemSettings setting) {
         try {
             System.out.println("=== DEBUG: createSystemSetting called ===");
             System.out.println("Setting: " + setting);
             
             com.bahattintok.e_commerce.model.SystemSettings createdSetting = systemSettingsService.createSetting(setting);
             
             Map<String, Object> response = new HashMap<>();
             response.put("message", "Ayar başarıyla oluşturuldu");
             response.put("setting", createdSetting);
             
             System.out.println("Setting created successfully: " + response);
             return ResponseEntity.ok(response);
         } catch (Exception e) {
             System.out.println("Error in createSystemSetting: " + e.getMessage());
             e.printStackTrace();
             Map<String, Object> error = new HashMap<>();
             error.put("error", "Ayar oluşturulamadı: " + e.getMessage());
             return ResponseEntity.badRequest().body(error);
         }
     }

     // Ayar sil
     @DeleteMapping("/system-settings/{key}")
     public ResponseEntity<Map<String, Object>> deleteSystemSetting(@PathVariable String key) {
         try {
             System.out.println("=== DEBUG: deleteSystemSetting called ===");
             System.out.println("Key: " + key);
             
             systemSettingsService.deleteSetting(key);
             
             Map<String, Object> response = new HashMap<>();
             response.put("message", "Ayar başarıyla silindi");
             response.put("key", key);
             
             System.out.println("Setting deleted successfully: " + response);
             return ResponseEntity.ok(response);
         } catch (Exception e) {
             System.out.println("Error in deleteSystemSetting: " + e.getMessage());
             e.printStackTrace();
             Map<String, Object> error = new HashMap<>();
             error.put("error", "Ayar silinemedi: " + e.getMessage());
             return ResponseEntity.badRequest().body(error);
         }
     }

     // Varsayılan ayarları oluştur
     @PostMapping("/system-settings/initialize")
     public ResponseEntity<Map<String, Object>> initializeDefaultSettings() {
         try {
             System.out.println("=== DEBUG: initializeDefaultSettings called ===");
             
             systemSettingsService.initializeDefaultSettings();
             
             Map<String, Object> response = new HashMap<>();
             response.put("message", "Varsayılan ayarlar başarıyla oluşturuldu");
             
             System.out.println("Default settings initialized successfully: " + response);
             return ResponseEntity.ok(response);
         } catch (Exception e) {
             System.out.println("Error in initializeDefaultSettings: " + e.getMessage());
             e.printStackTrace();
             Map<String, Object> error = new HashMap<>();
             error.put("error", "Varsayılan ayarlar oluşturulamadı: " + e.getMessage());
             return ResponseEntity.badRequest().body(error);
         }
     }
}
