package com.bahattintok.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.model.CategoryRequest;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.CategoryRequestService;

/**
 * CategoryRequest REST API controller'ı
 */
@RestController
@RequestMapping("/api/category-requests")
public class CategoryRequestController {
    
    @Autowired
    private CategoryRequestService categoryRequestService;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Yeni kategori isteği oluşturur (Seller)
     */
    @PostMapping
    public ResponseEntity<CategoryRequest> createRequest(
            @RequestBody CreateCategoryRequestRequest request,
            Authentication authentication) {
        
        String email = authentication.getName();
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        CategoryRequest categoryRequest = categoryRequestService.createRequest(
                request.getCategoryName(),
                request.getDescription(),
                seller
        );
        
        return ResponseEntity.ok(categoryRequest);
    }
    
    /**
     * İsteği onaylar (Admin)
     */
    @PutMapping("/{requestId}/approve")
    public ResponseEntity<CategoryRequest> approveRequest(
            @PathVariable String requestId,
            Authentication authentication) {
        
        String email = authentication.getName();
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        CategoryRequest approvedRequest = categoryRequestService.approveRequest(requestId, admin);
        
        return ResponseEntity.ok(approvedRequest);
    }
    
    /**
     * İsteği reddeder (Admin)
     */
    @PutMapping("/{requestId}/reject")
    public ResponseEntity<CategoryRequest> rejectRequest(
            @PathVariable String requestId,
            @RequestBody RejectCategoryRequestRequest request,
            Authentication authentication) {
        
        String email = authentication.getName();
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        CategoryRequest rejectedRequest = categoryRequestService.rejectRequest(
                requestId, 
                request.getRejectionReason(), 
                admin
        );
        
        return ResponseEntity.ok(rejectedRequest);
    }
    
    /**
     * Satıcının isteklerini getirir (Seller)
     */
    @GetMapping("/seller")
    public ResponseEntity<Page<CategoryRequest>> getSellerRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        String email = authentication.getName();
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        Pageable pageable = PageRequest.of(page, size);
        
        Page<CategoryRequest> requests = categoryRequestService.getSellerRequests(seller, pageable);
        
        return ResponseEntity.ok(requests);
    }
    
    /**
     * Tüm istekleri getirir (Admin)
     */
    @GetMapping("/admin")
    public ResponseEntity<Page<CategoryRequest>> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CategoryRequest> requests = categoryRequestService.getAllRequests(pageable);
        
        return ResponseEntity.ok(requests);
    }
    
    /**
     * Bekleyen istekleri getirir (Admin)
     */
    @GetMapping("/admin/pending")
    public ResponseEntity<List<CategoryRequest>> getPendingRequests() {
        List<CategoryRequest> requests = categoryRequestService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }
    
    /**
     * Belirli durumdaki istekleri getirir (Admin)
     */
    @GetMapping("/admin/status/{status}")
    public ResponseEntity<Page<CategoryRequest>> getRequestsByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CategoryRequest> requests = categoryRequestService.getRequestsByStatus(status, pageable);
        
        return ResponseEntity.ok(requests);
    }
    
    /**
     * İsteği ID'ye göre getirir
     */
    @GetMapping("/{requestId}")
    public ResponseEntity<CategoryRequest> getRequestById(@PathVariable String requestId) {
        CategoryRequest request = categoryRequestService.getRequestById(requestId);
        return ResponseEntity.ok(request);
    }
    
    /**
     * Satıcının bekleyen istek sayısını getirir (Seller)
     */
    @GetMapping("/seller/pending-count")
    public ResponseEntity<Long> getPendingRequestCount(Authentication authentication) {
        String email = authentication.getName();
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        long count = categoryRequestService.getPendingRequestCount(seller);
        return ResponseEntity.ok(count);
    }
    
    /**
     * Kategori adı zaten istek edilmiş mi kontrol eder
     */
    @GetMapping("/check-name")
    public ResponseEntity<Boolean> isCategoryNameAlreadyRequested(@RequestParam String categoryName) {
        boolean exists = categoryRequestService.isCategoryNameAlreadyRequested(categoryName);
        return ResponseEntity.ok(exists);
    }
    
    /**
     * Benzer kategori önerileri getirir
     */
    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSimilarCategorySuggestions(@RequestParam String categoryName) {
        List<String> suggestions = categoryRequestService.getSimilarCategorySuggestions(categoryName);
        return ResponseEntity.ok(suggestions);
    }
    
    /**
     * İsteği siler (Admin)
     */
    @DeleteMapping("/{requestId}")
    public ResponseEntity<Void> deleteRequest(@PathVariable String requestId) {
        // TODO: Implement delete functionality
        return ResponseEntity.noContent().build();
    }
    
    // Request DTO'ları
    public static class CreateCategoryRequestRequest {
        private String categoryName;
        private String description;
        
        // Getters and Setters
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
    
    public static class RejectCategoryRequestRequest {
        private String rejectionReason;
        
        // Getters and Setters
        public String getRejectionReason() { return rejectionReason; }
        public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    }
}
