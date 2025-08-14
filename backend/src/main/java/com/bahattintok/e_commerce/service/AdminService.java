package com.bahattintok.e_commerce.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Store;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.OrderRepository;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.StoreRepository;
import com.bahattintok.e_commerce.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StoreRepository storeRepository;

    public Map<String, Object> searchAll(String query) {
        Map<String, Object> results = new HashMap<>();
        
        // Basit arama - tüm verileri döndür
        List<User> users = userRepository.findAll();
        List<Product> products = productRepository.findAll();
        List<Store> stores = storeRepository.findAll();
        
        results.put("users", users);
        results.put("products", products);
        results.put("stores", stores);
        
        return results;
    }

               public Map<String, Object> getDashboardStats() {
               Map<String, Object> stats = new HashMap<>();
               
               // Temel istatistikler
               long totalUsers = userRepository.count();
               long totalProducts = productRepository.count();
               long totalOrders = orderRepository.count();
               long totalStores = storeRepository.count();
               
               // Gerçek gelir hesaplama
               double totalRevenue = orderRepository.findAll().stream()
                   .mapToDouble(order -> order.getTotalPrice().doubleValue())
                   .sum();
               
               stats.put("totalUsers", totalUsers);
               stats.put("totalSellers", 0); // Geçici
               stats.put("totalProducts", totalProducts);
               stats.put("totalOrders", totalOrders);
               stats.put("totalRevenue", totalRevenue);
               stats.put("totalStores", totalStores);
               stats.put("monthlyGrowth", 15.5); // Örnek değer
               
               return stats;
           }

           public Map<String, Object> getFinancialReports() {
               Map<String, Object> reports = new HashMap<>();
               
               // Toplam gelir
               double totalRevenue = orderRepository.findAll().stream()
                   .mapToDouble(order -> order.getTotalPrice().doubleValue())
                   .sum();
               
               // Tamamlanan siparişlerden gelir
               double completedRevenue = orderRepository.findByStatus("COMPLETED").stream()
                   .mapToDouble(order -> order.getTotalPrice().doubleValue())
                   .sum();
               
               // Bekleyen siparişlerden gelir
               double pendingRevenue = orderRepository.findByStatus("PENDING").stream()
                   .mapToDouble(order -> order.getTotalPrice().doubleValue())
                   .sum();
               
               reports.put("totalRevenue", totalRevenue);
               reports.put("completedRevenue", completedRevenue);
               reports.put("pendingRevenue", pendingRevenue);
               reports.put("totalOrders", orderRepository.count());
               reports.put("completedOrders", orderRepository.findByStatus("COMPLETED").size());
               reports.put("pendingOrders", orderRepository.findByStatus("PENDING").size());
               
               return reports;
           }

           public Map<String, Object> getMonthlySalesReport() {
               Map<String, Object> report = new HashMap<>();
               
               // Bu ayın siparişleri
               java.time.LocalDateTime startOfMonth = java.time.LocalDateTime.now()
                   .withDayOfMonth(1)
                   .withHour(0)
                   .withMinute(0)
                   .withSecond(0)
                   .withNano(0);
               
               List<Order> monthlyOrders = orderRepository.findByCreatedAtBetween(
                   startOfMonth, 
                   java.time.LocalDateTime.now()
               );
               
               double monthlyRevenue = monthlyOrders.stream()
                   .mapToDouble(order -> order.getTotalPrice().doubleValue())
                   .sum();
               
               report.put("monthlyRevenue", monthlyRevenue);
               report.put("monthlyOrders", monthlyOrders.size());
               report.put("averageOrderValue", monthlyOrders.isEmpty() ? 0 : monthlyRevenue / monthlyOrders.size());
               
               return report;
           }
}
