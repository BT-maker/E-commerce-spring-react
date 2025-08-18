package com.bahattintok.e_commerce.controller;

import java.util.ArrayList;
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
}
