package com.bahattintok.e_commerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Ürün değerlendirme ve yorum API'leri")
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @GetMapping("/product/{productId}")
    @Operation(summary = "Ürün review'larını getir", description = "Belirtilen ürünün tüm review'larını listeler")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable String productId) {
        List<Review> reviews = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/product/{productId}/stats")
    @Operation(summary = "Ürün review istatistiklerini getir", description = "Ürünün ortalama puanı ve review sayısını döner")
    public ResponseEntity<Map<String, Object>> getProductReviewStats(@PathVariable String productId) {
        Map<String, Object> stats = reviewService.getReviewStats(productId);
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/product/{productId}/user")
    @Operation(summary = "Kullanıcının ürün review'ını getir", description = "Giriş yapmış kullanıcının belirtilen ürün için review'ını getirir")
    public ResponseEntity<Review> getUserReview(@PathVariable String productId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        
        String email = authentication.getName();
        Review review = reviewService.getUserReview(email, productId);
        
        if (review != null) {
            return ResponseEntity.ok(review);
        } else {
            return ResponseEntity.notFound().build();
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