package com.bahattintok.e_commerce.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.bahattintok.e_commerce.model.CategoryRequest;
import com.bahattintok.e_commerce.model.User;

/**
 * CategoryRequest işlemleri için servis interface'i
 */
public interface CategoryRequestService {
    
    /**
     * Yeni kategori isteği oluşturur
     */
    CategoryRequest createRequest(String categoryName, String description, User seller);
    
    /**
     * İsteği onaylar
     */
    CategoryRequest approveRequest(String requestId, User admin);
    
    /**
     * İsteği reddeder
     */
    CategoryRequest rejectRequest(String requestId, String rejectionReason, User admin);
    
    /**
     * Satıcının isteklerini getirir
     */
    Page<CategoryRequest> getSellerRequests(User seller, Pageable pageable);
    
    /**
     * Tüm istekleri getirir (admin için)
     */
    Page<CategoryRequest> getAllRequests(Pageable pageable);
    
    /**
     * Bekleyen istekleri getirir
     */
    List<CategoryRequest> getPendingRequests();
    
    /**
     * Belirli durumdaki istekleri getirir
     */
    Page<CategoryRequest> getRequestsByStatus(String status, Pageable pageable);
    
    /**
     * İsteği ID'ye göre getirir
     */
    CategoryRequest getRequestById(String requestId);
    
    /**
     * Satıcının bekleyen istek sayısını getirir
     */
    long getPendingRequestCount(User seller);
    
    /**
     * Kategori adı zaten istek edilmiş mi kontrol eder
     */
    boolean isCategoryNameAlreadyRequested(String categoryName);
    
    /**
     * Satıcının bu kategori adıyla bekleyen isteği var mı
     */
    boolean hasSellerPendingRequestForCategory(User seller, String categoryName);
    
    /**
     * Benzer kategori önerileri getirir
     */
    List<String> getSimilarCategorySuggestions(String categoryName);
}
