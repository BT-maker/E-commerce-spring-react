package com.bahattintok.e_commerce.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.model.Product;
import com.bahattintok.e_commerce.model.Review;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.ProductRepository;
import com.bahattintok.e_commerce.repository.ReviewRepository;
import com.bahattintok.e_commerce.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    
    @Override
    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }
    
    @Override
    public Review getUserReview(String email, Long productId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        return reviewRepository.findByUserIdAndProductId(user.getId(), productId)
            .orElse(null);
    }
    
    @Override
    public Review addOrUpdateReview(String email, Long productId, int rating, String comment) {
        // Kullanıcı ve ürün kontrolü
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));
        
        // Rating 1-5 arası olmalı
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Puan 1-5 arası olmalıdır");
        }
        
        // Mevcut review var mı kontrol et
        Review existingReview = reviewRepository.findByUserIdAndProductId(user.getId(), productId)
            .orElse(null);
        
        if (existingReview != null) {
            // Mevcut review'ı güncelle
            existingReview.setRating(rating);
            existingReview.setComment(comment);
            return reviewRepository.save(existingReview);
        } else {
            // Yeni review oluştur
            Review review = new Review();
            review.setUser(user);
            review.setProduct(product);
            review.setRating(rating);
            review.setComment(comment);
            review.setCreatedAt(LocalDateTime.now());
            return reviewRepository.save(review);
        }
    }
    
    @Override
    public void deleteReview(String email, Long productId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        Review review = reviewRepository.findByUserIdAndProductId(user.getId(), productId)
            .orElseThrow(() -> new RuntimeException("Review bulunamadı"));
        
        reviewRepository.delete(review);
    }
    
    @Override
    public Double getAverageRating(Long productId) {
        Double avgRating = reviewRepository.getAverageRatingByProductId(productId);
        return avgRating != null ? avgRating : 0.0;
    }
    
    @Override
    public Long getReviewCount(Long productId) {
        return reviewRepository.getReviewCountByProductId(productId);
    }
    
    @Override
    public Map<String, Object> getReviewStats(Long productId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", getAverageRating(productId));
        stats.put("reviewCount", getReviewCount(productId));
        return stats;
    }
    
    @Override
    public boolean hasUserReviewed(String email, Long productId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        return reviewRepository.existsByUserIdAndProductId(user.getId(), productId);
    }
    
    /**
     * Bu servis şu işlevleri sağlar:
     * 
     * 1. Review Yönetimi: Ürün değerlendirmelerinin listelenmesi ve yönetimi
     * 2. Review Ekleme/Güncelleme: Kullanıcı review'ı ekleme veya güncelleme
     * 3. Review Silme: Kullanıcı review'ını silme işlemi
     * 4. İstatistik Hesaplama: Ürünün ortalama puanı ve review sayısı
     * 5. Review Kontrolü: Kullanıcının ürün için review'ı olup olmadığını kontrol etme
     * 6. Puan Doğrulama: Rating değerinin 1-5 arası olmasını kontrol etme
     * 7. Hata Yönetimi: Kullanıcı ve ürün bulunamadığında uygun exception fırlatma
     * 8. Transaction Yönetimi: Veritabanı işlemlerinin atomik yapılması
     * 
     * Bu servis sayesinde ürün değerlendirme sistemi güvenli ve tutarlı şekilde yönetilebilir!
     */
} 