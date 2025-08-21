package com.bahattintok.e_commerce.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.controller.WebSocketController;
import com.bahattintok.e_commerce.event.CategoryRequestEvent;
import com.bahattintok.e_commerce.model.Category;
import com.bahattintok.e_commerce.model.CategoryRequest;
import com.bahattintok.e_commerce.model.CategoryRequest.CategoryRequestStatus;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.CategoryRepository;
import com.bahattintok.e_commerce.repository.CategoryRequestRepository;
import com.bahattintok.e_commerce.repository.RoleRepository;
import com.bahattintok.e_commerce.repository.UserRepository;
import com.bahattintok.e_commerce.service.CategoryRequestService;
import com.bahattintok.e_commerce.service.NotificationService;

/**
 * CategoryRequest servis implementasyonu
 */
@Service
@Transactional
public class CategoryRequestServiceImpl implements CategoryRequestService {
    
    @Autowired
    private CategoryRequestRepository categoryRequestRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private WebSocketController webSocketController;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private org.springframework.context.ApplicationEventPublisher eventPublisher;
    
    private static final int MAX_PENDING_REQUESTS = 2;
    
    @Override
    public CategoryRequest createRequest(String categoryName, String description, User seller) {
        // Maksimum bekleyen istek kontrolü
        long pendingCount = getPendingRequestCount(seller);
        if (pendingCount >= MAX_PENDING_REQUESTS) {
            throw new RuntimeException("Maksimum " + MAX_PENDING_REQUESTS + " bekleyen istek hakkınız bulunmaktadır.");
        }
        
        // Kategori adı zaten var mı kontrolü
        if (categoryRepository.existsByNameIgnoreCase(categoryName)) {
            throw new RuntimeException("Bu kategori adı zaten mevcuttur: " + categoryName);
        }
        
        // Aynı isimle bekleyen istek var mı kontrolü
        if (isCategoryNameAlreadyRequested(categoryName)) {
            throw new RuntimeException("Bu kategori adı için zaten bir istek beklemektedir: " + categoryName);
        }
        
        // Satıcının aynı isimle bekleyen isteği var mı kontrolü
        if (hasSellerPendingRequestForCategory(seller, categoryName)) {
            throw new RuntimeException("Bu kategori adı için zaten bir istek göndermişsiniz: " + categoryName);
        }
        
        // Yeni istek oluştur
        CategoryRequest request = new CategoryRequest();
        request.setCategoryName(categoryName);
        request.setDescription(description);
        request.setSeller(seller);
        request.setStatus(CategoryRequestStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());
        
        CategoryRequest savedRequest = categoryRequestRepository.save(request);
        
        // Admin'lere bildirim gönder
        sendNotificationToAdmins(savedRequest);
        
        // WebSocket bildirimi gönder (geçici olarak devre dışı)
        try {
            webSocketController.sendCategoryRequestNotification(savedRequest);
        } catch (Exception e) {
            System.err.println("WebSocket bildirimi gönderilemedi: " + e.getMessage());
        }
        
        // Email event'leri gönder (geçici olarak devre dışı)
        try {
            sendEmailEvents(savedRequest, CategoryRequestEvent.EventTypes.REQUEST_CREATED);
        } catch (Exception e) {
            System.err.println("Email event gönderilemedi: " + e.getMessage());
        }
        
        return savedRequest;
    }
    
    @Override
    public CategoryRequest approveRequest(String requestId, User admin) {
        CategoryRequest request = getRequestById(requestId);
        
        if (request.getStatusEnum() != CategoryRequestStatus.PENDING) {
            throw new RuntimeException("Bu istek zaten işlenmiştir.");
        }
        
        // Kategori oluştur
        Category category = new Category();
        category.setName(request.getCategoryName());
        category.setDescription(request.getDescription());
        categoryRepository.save(category);
        
        // İsteği onayla
        request.setStatus(CategoryRequestStatus.APPROVED);
        request.setAdmin(admin);
        request.setProcessedAt(LocalDateTime.now());
        
        CategoryRequest approvedRequest = categoryRequestRepository.save(request);
        
        // Satıcıya bildirim gönder
        sendApprovalNotification(request);
        
        // WebSocket bildirimi gönder
        webSocketController.sendCategoryRequestApprovedNotification(approvedRequest);
        
        // Email event'i gönder
        sendEmailEvents(approvedRequest, CategoryRequestEvent.EventTypes.REQUEST_APPROVED);
        
        return approvedRequest;
    }
    
    @Override
    public CategoryRequest rejectRequest(String requestId, String rejectionReason, User admin) {
        CategoryRequest request = getRequestById(requestId);
        
        if (request.getStatusEnum() != CategoryRequestStatus.PENDING) {
            throw new RuntimeException("Bu istek zaten işlenmiştir.");
        }
        
        // İsteği reddet
        request.setStatus(CategoryRequestStatus.REJECTED);
        request.setRejectionReason(rejectionReason);
        request.setAdmin(admin);
        request.setProcessedAt(LocalDateTime.now());
        
        CategoryRequest rejectedRequest = categoryRequestRepository.save(request);
        
        // Satıcıya bildirim gönder
        sendRejectionNotification(request);
        
        // WebSocket bildirimi gönder
        webSocketController.sendCategoryRequestRejectedNotification(rejectedRequest);
        
        // Email event'i gönder
        sendEmailEvents(rejectedRequest, CategoryRequestEvent.EventTypes.REQUEST_REJECTED);
        
        return rejectedRequest;
    }
    
    @Override
    public Page<CategoryRequest> getSellerRequests(User seller, Pageable pageable) {
        return categoryRequestRepository.findBySellerOrderByCreatedAtDesc(seller, pageable);
    }
    
    @Override
    public Page<CategoryRequest> getAllRequests(Pageable pageable) {
        return categoryRequestRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
    
    @Override
    public List<CategoryRequest> getPendingRequests() {
        return categoryRequestRepository.findByStatusOrderByCreatedAtAsc(CategoryRequestStatus.PENDING);
    }
    
    @Override
    public Page<CategoryRequest> getRequestsByStatus(String status, Pageable pageable) {
        CategoryRequestStatus requestStatus = CategoryRequestStatus.valueOf(status.toUpperCase());
        return categoryRequestRepository.findByStatusOrderByCreatedAtDesc(requestStatus, pageable);
    }
    
    @Override
    public CategoryRequest getRequestById(String requestId) {
        return categoryRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Kategori isteği bulunamadı: " + requestId));
    }
    
    @Override
    public long getPendingRequestCount(User seller) {
        return categoryRequestRepository.countPendingRequestsBySeller(seller);
    }
    
    @Override
    public boolean isCategoryNameAlreadyRequested(String categoryName) {
        return categoryRequestRepository.existsByCategoryNameIgnoreCaseAndStatusPending(categoryName);
    }
    
    @Override
    public boolean hasSellerPendingRequestForCategory(User seller, String categoryName) {
        return categoryRequestRepository.findBySellerAndCategoryNameIgnoreCaseAndStatusPending(seller, categoryName)
                .isPresent();
    }
    
    @Override
    public List<String> getSimilarCategorySuggestions(String categoryName) {
        // Mevcut kategorilerden benzer olanları getir
        return categoryRepository.findAll().stream()
                .map(Category::getName)
                .filter(name -> name.toLowerCase().contains(categoryName.toLowerCase()) ||
                               categoryName.toLowerCase().contains(name.toLowerCase()))
                .limit(5)
                .collect(Collectors.toList());
    }
    
    /**
     * Admin'lere yeni istek bildirimi gönderir
     */
    private void sendNotificationToAdmins(CategoryRequest request) {
        // TODO: Admin kullanıcılarına WebSocket ile bildirim gönder
        // Bu kısım WebSocket implementasyonu tamamlandıktan sonra eklenecek
    }
    
    /**
     * Onay bildirimi gönderir
     */
    private void sendApprovalNotification(CategoryRequest request) {
        String title = "Kategori İsteği Onaylandı";
        String message = String.format("'%s' kategorisi isteğiniz onaylanmıştır.", request.getCategoryName());
        
        notificationService.createNotification(title, message, "CATEGORY_REQUEST", request.getSeller());
        
        // Email bildirimi için event gönder
        // TODO: Email event sistemi eklenecek
    }
    
    /**
     * Red bildirimi gönderir
     */
    private void sendRejectionNotification(CategoryRequest request) {
        String title = "Kategori İsteği Reddedildi";
        String message = String.format("'%s' kategorisi isteğiniz reddedilmiştir. Sebep: %s", 
                request.getCategoryName(), request.getRejectionReason());
        
        notificationService.createNotification(title, message, "CATEGORY_REQUEST", request.getSeller());
        
        // Email bildirimi için event gönder
        // TODO: Email event sistemi eklenecek
    }
    
    /**
     * Email event'lerini gönderir
     */
    private void sendEmailEvents(CategoryRequest request, String eventType) {
        if (CategoryRequestEvent.EventTypes.REQUEST_CREATED.equals(eventType)) {
            // Admin'lere email gönder
            var adminRole = roleRepository.findByName("ADMIN");
            if (adminRole.isPresent()) {
                var adminUsers = userRepository.findByRole(adminRole.get());
                
                for (User admin : adminUsers) {
                    CategoryRequestEvent event = new CategoryRequestEvent(request, admin, eventType);
                    eventPublisher.publishEvent(event);
                }
            }
        } else if (CategoryRequestEvent.EventTypes.REQUEST_APPROVED.equals(eventType) || 
                   CategoryRequestEvent.EventTypes.REQUEST_REJECTED.equals(eventType)) {
            // Satıcıya email gönder
            CategoryRequestEvent event = new CategoryRequestEvent(request, request.getSeller(), eventType);
            eventPublisher.publishEvent(event);
        }
    }
}
