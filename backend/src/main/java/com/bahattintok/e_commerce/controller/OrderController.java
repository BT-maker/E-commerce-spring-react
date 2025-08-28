package com.bahattintok.e_commerce.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.model.Order;
import com.bahattintok.e_commerce.model.OrderItem;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management APIs")
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Create order from cart", description = "Create a new order from user's cart")
    public ResponseEntity<Map<String, Object>> createOrder(Authentication authentication, @RequestBody Map<String, Object> orderRequest) {
        System.out.println("=== SİPARİŞ OLUŞTURMA BAŞLADI ===");
        System.out.println("Authentication: " + authentication);
        System.out.println("Order Request: " + orderRequest);
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            System.err.println("Kullanıcı bulunamadı: " + email);
            return ResponseEntity.status(401).build();
        }
        
        System.out.println("Kullanıcı bulundu: " + user.getEmail());
        
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderRequest.get("items");
            Double total = ((Number) orderRequest.get("total")).doubleValue();
            
            System.out.println("Items: " + items);
            System.out.println("Total: " + total);
            
            Order order = orderService.createOrder(user, items, total);
            System.out.println("Sipariş başarıyla oluşturuldu: " + order.getId());
            
            // Basit response döndür
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", order.getId());
            response.put("message", "Sipariş başarıyla oluşturuldu");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Sipariş oluşturma hatası: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping
    @Operation(summary = "Get user orders", description = "Get all orders of the user")
    public ResponseEntity<List<Map<String, Object>>> getUserOrders(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        try {
            List<Order> orders = orderService.getUserOrders(user);
            List<Map<String, Object>> orderResponses = new ArrayList<>();
            
            for (Order order : orders) {
                Map<String, Object> orderResponse = new HashMap<>();
                orderResponse.put("id", order.getId());
                orderResponse.put("createdAt", order.getCreatedAt());
                orderResponse.put("status", order.getStatus());
                orderResponse.put("totalPrice", order.getTotalPrice());
                
                // Order items'ları da basit objeler olarak ekle
                List<Map<String, Object>> itemResponses = new ArrayList<>();
                for (OrderItem item : order.getItems()) {
                    Map<String, Object> itemResponse = new HashMap<>();
                    itemResponse.put("id", item.getId());
                    itemResponse.put("quantity", item.getQuantity());
                    itemResponse.put("price", item.getPrice());
                    
                    // Product bilgilerini de ekle
                    Map<String, Object> productResponse = new HashMap<>();
                    productResponse.put("id", item.getProduct().getId());
                    productResponse.put("name", item.getProduct().getName());
                    productResponse.put("imageUrl1", item.getProduct().getImageUrl1());
                    productResponse.put("imageUrl", item.getProduct().getImageUrl());
                    productResponse.put("price", item.getProduct().getPrice());
                    
                    itemResponse.put("product", productResponse);
                    itemResponses.add(itemResponse);
                }
                
                orderResponse.put("items", itemResponses);
                orderResponses.add(orderResponse);
            }
            
            return ResponseEntity.ok(orderResponses);
        } catch (Exception e) {
            System.err.println("Siparişler getirme hatası: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * Bu controller şu işlevleri sağlar:
     * 
     * 1. Sipariş Oluşturma: Kullanıcının sepetinden yeni sipariş oluşturur (POST /api/orders)
     * 2. Sipariş Listeleme: Kullanıcının tüm siparişlerini getirir (GET /api/orders)
     * 
     * Bu controller sayesinde kullanıcılar sepetlerindeki ürünleri siparişe çevirebilir 
     * ve geçmiş siparişlerini görüntüleyebilir!
     */
} 