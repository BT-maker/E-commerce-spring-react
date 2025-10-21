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

        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalStores = storeRepository.count();

        double totalRevenue = orderRepository.findByStatus("DELIVERED").stream()
                .mapToDouble(order -> order.getTotalPrice() != null ? order.getTotalPrice().doubleValue() : 0.0)
                .sum();

        // Satıcı sayısını hesapla
        long totalSellers = userRepository.findAll().stream()
                .filter(user -> user.getRole() != null && "SELLER".equals(user.getRole().getName()))
                .count();
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalSellers", totalSellers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalStores", totalStores);
        stats.put("monthlyGrowth", 15.5); // Örnek bir değer, daha sonra hesaplanabilir

        return stats;
    }

    public Map<String, Object> getQuickStats() {
        Map<String, Object> quickStats = new HashMap<>();

        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.time.LocalDateTime startOfMonth = now.withDayOfMonth(1).toLocalDate().atStartOfDay();
        java.time.LocalDateTime startOfToday = now.toLocalDate().atStartOfDay();
        java.time.LocalDateTime startOfWeek = now.minusDays(7).toLocalDate().atStartOfDay();

        List<Order> monthlyOrders = orderRepository.findByCreatedAtBetween(startOfMonth, now);
        double thisMonthRevenue = monthlyOrders.stream()
                .filter(order -> "DELIVERED".equals(order.getStatus()))
                .mapToDouble(order -> order.getTotalPrice() != null ? order.getTotalPrice().doubleValue() : 0.0)
                .sum();

        List<Order> todayOrders = orderRepository.findByCreatedAtBetween(startOfToday, now);
        double todayRevenue = todayOrders.stream()
                .filter(order -> "DELIVERED".equals(order.getStatus()))
                .mapToDouble(order -> order.getTotalPrice() != null ? order.getTotalPrice().doubleValue() : 0.0)
                .sum();

        long totalPendingOrders = orderRepository.findByStatus("PENDING").size();
        
        // Haftalık sipariş sayısı
        List<Order> weeklyOrders = orderRepository.findByCreatedAtBetween(startOfWeek, now);
        long weeklyOrdersCount = weeklyOrders.size();
        
        List<User> allUsers = userRepository.findAll();
        long newCustomersThisMonth = allUsers.stream()
                .filter(user -> user.getRegistrationDate() != null && user.getRegistrationDate().isAfter(startOfMonth))
                .count();
        
        // Toplam kullanıcı sayısı (USER rolündeki kullanıcılar)
        long totalUsers = allUsers.stream()
                .filter(user -> user.getRole() != null && "USER".equals(user.getRole().getName()))
                .count();

        quickStats.put("thisMonthRevenue", thisMonthRevenue);
        quickStats.put("todayRevenue", todayRevenue);
        quickStats.put("totalPendingOrders", totalPendingOrders);
        quickStats.put("newCustomersThisMonth", newCustomersThisMonth);
        
        // Frontend için ek alanlar
        quickStats.put("weeklyOrders", weeklyOrdersCount);
        quickStats.put("monthlyRevenue", thisMonthRevenue);
        quickStats.put("newUsers", totalUsers); // Toplam kullanıcı sayısını göster

        return quickStats;
    }

    public Map<String, Object> getSalesChartData() {
        Map<String, Object> chartData = new HashMap<>();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        
        // Son 12 ayın verisini topla
        Map<String, Double> monthlySales = new java.util.LinkedHashMap<>();
        for (int i = 11; i >= 0; i--) {
            java.time.LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).toLocalDate().atStartOfDay();
            java.time.LocalDateTime monthEnd = monthStart.plusMonths(1).minusNanos(1);
            
            List<Order> monthOrders = orderRepository.findByCreatedAtBetween(monthStart, monthEnd);
            double total = monthOrders.stream()
                                          .filter(order -> "DELIVERED".equals(order.getStatus()))
                                          .mapToDouble(o -> o.getTotalPrice() != null ? o.getTotalPrice().doubleValue() : 0.0)
                                          .sum();
            
            String monthName = monthStart.getMonth().name().substring(0, 3) + " " + monthStart.getYear();
            monthlySales.put(monthName, total);
        }
        
        chartData.put("monthlySales", monthlySales);
        return chartData;
    }

           public Map<String, Object> getFinancialReports() {
               Map<String, Object> reports = new HashMap<>();
               
               // Toplam gelir
               double totalRevenue = orderRepository.findAll().stream()
                   .mapToDouble(order -> order.getTotalPrice().doubleValue())
                   .sum();
               
               // Tamamlanan siparişlerden gelir
               double completedRevenue = orderRepository.findByStatus("DELIVERED").stream()
                   .mapToDouble(order -> order.getTotalPrice() != null ? order.getTotalPrice().doubleValue() : 0.0)
                   .sum();
               
               // Bekleyen siparişlerden gelir
               double pendingRevenue = orderRepository.findByStatus("PENDING").stream()
                   .mapToDouble(order -> order.getTotalPrice().doubleValue())
                   .sum();
               
               reports.put("totalRevenue", totalRevenue);
               reports.put("completedRevenue", completedRevenue);
               reports.put("pendingRevenue", pendingRevenue);
               reports.put("totalOrders", orderRepository.count());
               reports.put("completedOrders", orderRepository.findByStatus("DELIVERED").size());
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
                   .filter(order -> "DELIVERED".equals(order.getStatus()))
                   .mapToDouble(order -> order.getTotalPrice() != null ? order.getTotalPrice().doubleValue() : 0.0)
                   .sum();
               
               report.put("monthlyRevenue", monthlyRevenue);
               report.put("monthlyOrders", monthlyOrders.size());
               report.put("averageOrderValue", monthlyOrders.isEmpty() ? 0 : monthlyRevenue / monthlyOrders.size());
               
               return report;
           }
}
