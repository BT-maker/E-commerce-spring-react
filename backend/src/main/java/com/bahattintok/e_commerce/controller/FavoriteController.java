package com.bahattintok.e_commerce.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.model.Favorite;
import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.service.FavoriteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorites", description = "Favori işlemleri API'leri")
public class FavoriteController {
    
    private final FavoriteService favoriteService;
    
    @GetMapping
    @Operation(summary = "Kullanıcının favorilerini getir", description = "Giriş yapmış kullanıcının favorilerini listeler")
    public ResponseEntity<List<Map<String, Object>>> getUserFavorites() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            System.out.println("=== FAVORİLER GETİRİLİYOR ===");
            System.out.println("Authentication: " + auth);
            System.out.println("Email: " + email);
            
            if (email == null || email.equals("anonymousUser")) {
                System.out.println("HATA: Kullanıcı giriş yapmamış!");
                return ResponseEntity.status(401).build();
            }
            
            List<Favorite> favorites = favoriteService.getUserFavorites(email);
            System.out.println("Favoriler bulundu: " + favorites.size() + " adet");
            
            // Favorileri basit Map formatına dönüştür
            List<Map<String, Object>> favoriteMaps = new ArrayList<>();
            for (Favorite favorite : favorites) {
                Map<String, Object> favoriteMap = new HashMap<>();
                favoriteMap.put("id", favorite.getId());
                favoriteMap.put("createdAt", favorite.getCreatedAt());
                
                // Product bilgilerini ekle
                Product product = favorite.getProduct();
                Map<String, Object> productMap = new HashMap<>();
                productMap.put("id", product.getId());
                productMap.put("name", product.getName());
                productMap.put("price", product.getPrice());
                productMap.put("description", product.getDescription());
                productMap.put("stock", product.getStock());
                productMap.put("imageUrl", product.getImageUrl());
                
                // Category bilgilerini ekle
                if (product.getCategory() != null) {
                    Map<String, Object> categoryMap = new HashMap<>();
                    categoryMap.put("id", product.getCategory().getId());
                    categoryMap.put("name", product.getCategory().getName());
                    productMap.put("category", categoryMap);
                }
                
                favoriteMap.put("product", productMap);
                favoriteMaps.add(favoriteMap);
                
                System.out.println("Favori ID: " + favorite.getId() + 
                                 ", Product ID: " + product.getId() + 
                                 ", Product Name: " + product.getName());
            }
            
            return ResponseEntity.ok(favoriteMaps);
        } catch (Exception e) {
            System.err.println("Favoriler getirilirken hata: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @PostMapping("/{productId}")
    @Operation(summary = "Ürünü favorilere ekle", description = "Belirtilen ürünü kullanıcının favorilerine ekler")
    public ResponseEntity<Map<String, Object>> addToFavorites(@PathVariable String productId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            System.out.println("=== FAVORİ EKLEME CONTROLLER ===");
            System.out.println("Authentication: " + auth);
            System.out.println("Email: " + email);
            System.out.println("ProductId: " + productId);
            
            if (email == null || email.equals("anonymousUser")) {
                System.out.println("HATA: Kullanıcı giriş yapmamış!");
                return ResponseEntity.status(401).build();
            }
            
            Favorite favorite = favoriteService.addToFavorites(email, productId);
            System.out.println("Favori başarıyla eklendi: " + favorite.getId());
            
            // Favorite'ı Map formatına dönüştür
            Map<String, Object> favoriteMap = new HashMap<>();
            favoriteMap.put("id", favorite.getId());
            favoriteMap.put("createdAt", favorite.getCreatedAt());
            
            // Product bilgilerini ekle
            Product product = favorite.getProduct();
            Map<String, Object> productMap = new HashMap<>();
            productMap.put("id", product.getId());
            productMap.put("name", product.getName());
            productMap.put("price", product.getPrice());
            productMap.put("description", product.getDescription());
            productMap.put("stock", product.getStock());
            productMap.put("imageUrl", product.getImageUrl());
            
            // Category bilgilerini ekle
            if (product.getCategory() != null) {
                Map<String, Object> categoryMap = new HashMap<>();
                categoryMap.put("id", product.getCategory().getId());
                categoryMap.put("name", product.getCategory().getName());
                productMap.put("category", categoryMap);
            }
            
            favoriteMap.put("product", productMap);
            
            return ResponseEntity.ok(favoriteMap);
        } catch (RuntimeException e) {
            // Hata mesajını log'la
            System.err.println("Favori ekleme hatası: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @DeleteMapping("/{productId}")
    @Operation(summary = "Ürünü favorilerden çıkar", description = "Belirtilen ürünü kullanıcının favorilerinden çıkarır")
    public ResponseEntity<?> removeFromFavorites(@PathVariable String productId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            System.out.println("=== FAVORİ ÇIKARMA CONTROLLER ===");
            System.out.println("Authentication: " + auth);
            System.out.println("Email: " + email);
            System.out.println("ProductId: " + productId);
            
            if (email == null || email.equals("anonymousUser")) {
                System.out.println("HATA: Kullanıcı giriş yapmamış!");
                return ResponseEntity.status(401).build();
            }
            
            favoriteService.removeFromFavorites(email, productId);
            System.out.println("Favori başarıyla çıkarıldı!");
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            // Hata mesajını log'la
            System.err.println("Favori çıkarma hatası: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/check/{productId}")
    @Operation(summary = "Ürünün favorilerde olup olmadığını kontrol et", description = "Belirtilen ürünün kullanıcının favorilerinde olup olmadığını kontrol eder")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable String productId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        boolean isFavorite = favoriteService.isFavorite(email, productId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }
    
    @GetMapping("/count")
    @Operation(summary = "Favori sayısını getir", description = "Kullanıcının toplam favori sayısını döner")
    public ResponseEntity<Map<String, Long>> getFavoriteCount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        
        long count = favoriteService.getFavoriteCount(email);
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    /**
     * Bu controller şu işlevleri sağlar:
     * 
     * 1. Favori Listeleme: Kullanıcının favorilerini getirir (GET /api/favorites)
     * 2. Favori Ekleme: Ürünü favorilere ekler (POST /api/favorites/{productId})
     * 3. Favori Çıkarma: Ürünü favorilerden çıkarır (DELETE /api/favorites/{productId})
     * 4. Favori Kontrolü: Ürünün favorilerde olup olmadığını kontrol eder (GET /api/favorites/check/{productId})
     * 5. Favori Sayısı: Kullanıcının toplam favori sayısını getirir (GET /api/favorites/count)
     * 
     * Bu controller sayesinde kullanıcılar ürünleri favorilere ekleyebilir, 
     * favorilerini yönetebilir ve favori durumlarını kontrol edebilir!
     */
} 