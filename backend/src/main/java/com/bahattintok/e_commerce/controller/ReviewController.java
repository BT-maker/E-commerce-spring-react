package com.bahattintok.e_commerce.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.model.Review;
import com.bahattintok.e_commerce.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Ürün değerlendirme ve yorum API'leri")
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @GetMapping("/product/{productId}")
    @Operation(summary = "Ürün review'larını getir", description = "Belirtilen ürünün tüm review'larını listeler")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable String productId) {
        try {
            System.out.println("Review'lar getiriliyor - Product ID: " + productId);
            List<Review> reviews = reviewService.getProductReviews(productId);
            System.out.println("Bulunan review sayısı: " + reviews.size());
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            System.err.println("Review getirme hatası: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>()); // Hata durumunda boş liste döndür
        }
    }
    
    @GetMapping("/product/{productId}/stats")
    @Operation(summary = "Ürün review istatistiklerini getir", description = "Ürünün ortalama puanı ve review sayısını döner")
    public ResponseEntity<Map<String, Object>> getProductReviewStats(@PathVariable String productId) {
        try {
            Map<String, Object> stats = reviewService.getReviewStats(productId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            // Hata durumunda varsayılan değerler döndür
            Map<String, Object> defaultStats = new HashMap<>();
            defaultStats.put("averageRating", 0.0);
            defaultStats.put("reviewCount", 0L);
            return ResponseEntity.ok(defaultStats);
        }
    }
    
    @GetMapping("/product/{productId}/user")
    @Operation(summary = "Kullanıcının ürün review'ını getir", description = "Giriş yapmış kullanıcının belirtilen ürün için review'ını getirir")
    public ResponseEntity<Review> getUserReview(@PathVariable String productId, Authentication authentication) {
        try {
            System.out.println("Kullanıcı review'ı getiriliyor - Product ID: " + productId);
            
            if (authentication == null || !authentication.isAuthenticated()) {
                System.out.println("Kullanıcı giriş yapmamış");
                return ResponseEntity.status(401).build();
            }
            
            String email = authentication.getName();
            System.out.println("Kullanıcı email: " + email);
            
            Review review = reviewService.getUserReview(email, productId);
            
            if (review != null) {
                System.out.println("Kullanıcı review'ı bulundu");
                return ResponseEntity.ok(review);
            } else {
                System.out.println("Kullanıcı review'ı bulunamadı - 200 OK ile null döndürülüyor");
                // 404 yerine 200 OK döndür, böylece frontend'de hata olmaz
                return ResponseEntity.ok(null);
            }
        } catch (Exception e) {
            System.err.println("Kullanıcı review getirme hatası: " + e.getMessage());
            e.printStackTrace();
            // Hata durumunda da 200 OK döndür
            return ResponseEntity.ok(null);
        }
    }
    
    @PostMapping("/product/{productId}")
    @Operation(summary = "Review ekle/güncelle", description = "Ürün için review ekler veya mevcut review'ı günceller")
    public ResponseEntity<Review> addOrUpdateReview(
            @PathVariable String productId,
            @RequestBody ReviewRequest request,
            Authentication authentication) {
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        try {
            String email = authentication.getName();
            Review review = reviewService.addOrUpdateReview(email, productId, request.getRating(), request.getComment());
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/product/{productId}")
    @Operation(summary = "Review sil", description = "Kullanıcının ürün için review'ını siler")
    public ResponseEntity<?> deleteReview(@PathVariable String productId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        try {
            String email = authentication.getName();
            reviewService.deleteReview(email, productId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/test/add-sample-reviews")
    @Operation(summary = "Test yorumları ekle", description = "Test için örnek yorumlar ekler")
    public ResponseEntity<String> addSampleReviews() {
        try {
            // Bu endpoint sadece test amaçlı kullanılmalı
            reviewService.addSampleReviews();
            return ResponseEntity.ok("Test yorumları eklendi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Hata: " + e.getMessage());
        }
    }
    
    // Review request DTO
    public static class ReviewRequest {
        private int rating;
        private String comment;
        
        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }
        
        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }
    }
    
    /**
     * Bu controller şu işlevleri sağlar:
     * 
     * 1. Ürün Review'ları: Ürünün tüm değerlendirmelerini getirir (GET /api/reviews/product/{productId})
     * 2. Review İstatistikleri: Ürünün ortalama puanı ve review sayısını getirir (GET /api/reviews/product/{productId}/stats)
     * 3. Kullanıcı Review'ı: Kullanıcının ürün için review'ını getirir (GET /api/reviews/product/{productId}/user)
     * 4. Review Ekleme/Güncelleme: Ürün için review ekler veya günceller (POST /api/reviews/product/{productId})
     * 5. Review Silme: Kullanıcının review'ını siler (DELETE /api/reviews/product/{productId})
     * 
     * Bu controller sayesinde kullanıcılar ürünleri değerlendirebilir ve yorum yapabilir!
     */
} 