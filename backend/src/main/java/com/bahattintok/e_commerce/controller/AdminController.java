package com.bahattintok.e_commerce.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@PreAuthorize("hasRole('ADMIN')")
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

    // Dashboard istatistikleri
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Temel istatistikler
            List<User> allUsers = userRepository.findAll();
            long totalUsers = allUsers.stream()
                .filter(user -> !"ADMIN".equals(user.getRole().getName()))
                .count();
            long totalSellers = allUsers.stream()
                .filter(user -> "SELLER".equals(user.getRole().getName()))
                .count();
            long totalProducts = productRepository.count();
            long totalOrders = orderRepository.count();
            long totalStores = storeRepository.count();
            
            stats.put("totalUsers", totalUsers);
            stats.put("totalSellers", totalSellers);
            stats.put("totalProducts", totalProducts);
            stats.put("totalOrders", totalOrders);
            stats.put("totalRevenue", 0.0); // Geçici
            stats.put("monthlyGrowth", 15.5); // Örnek değer
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Dashboard istatistikleri alınamadı: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Son siparişler
    @GetMapping("/dashboard/recent-orders")
    public ResponseEntity<List<Order>> getRecentOrders() {
        try {
            List<Order> recentOrders = orderRepository.findAll();
            // Sadece son 10 siparişi döndür
            if (recentOrders.size() > 10) {
                recentOrders = recentOrders.subList(0, 10);
            }
            return ResponseEntity.ok(recentOrders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin olmayan tüm kullanıcıları getir
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> allUsers = userRepository.findAll();
            // Admin rolündeki kullanıcıları filtrele
            List<User> nonAdminUsers = allUsers.stream()
                .filter(user -> !"ADMIN".equals(user.getRole().getName()))
                .toList();
            return ResponseEntity.ok(nonAdminUsers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
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
