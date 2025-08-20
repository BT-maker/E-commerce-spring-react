package com.bahattintok.e_commerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.bahattintok.e_commerce.model.CategoryRequest;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.RoleRepository;
import com.bahattintok.e_commerce.repository.UserRepository;

/**
 * WebSocket mesajları için controller
 */
@Controller
public class WebSocketController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    /**
     * Kategori isteği oluşturulduğunda admin'lere bildirim gönderir
     */
    public void sendCategoryRequestNotification(CategoryRequest request) {
        // Admin kullanıcılarını bul
        var adminRole = roleRepository.findByName("ADMIN");
        if (adminRole.isEmpty()) {
            return; // Admin rolü bulunamadı
        }
        var adminUsers = userRepository.findByRole(adminRole.get());
        
        // Her admin'e bildirim gönder
        for (User admin : adminUsers) {
            String destination = "/user/" + admin.getId() + "/queue/category-requests";
            
            CategoryRequestNotification notification = new CategoryRequestNotification(
                "Yeni Kategori İsteği",
                String.format("'%s' kategorisi için yeni istek oluşturuldu.", request.getCategoryName()),
                request.getId(),
                request.getCategoryName(),
                request.getSeller().getFirstName() + " " + request.getSeller().getLastName(),
                request.getCreatedAt()
            );
            
            messagingTemplate.convertAndSendToUser(
                admin.getId().toString(),
                "/queue/category-requests",
                notification
            );
        }
        
        // Genel topic'e de gönder (admin panel'deki sayfa için)
        CategoryRequestNotification generalNotification = new CategoryRequestNotification(
            "Yeni Kategori İsteği",
            String.format("'%s' kategorisi için yeni istek oluşturuldu.", request.getCategoryName()),
            request.getId(),
            request.getCategoryName(),
            request.getSeller().getFirstName() + " " + request.getSeller().getLastName(),
            request.getCreatedAt()
        );
        
        messagingTemplate.convertAndSend("/topic/category-requests", generalNotification);
    }
    
    /**
     * Kategori isteği onaylandığında satıcıya bildirim gönderir
     */
    public void sendCategoryRequestApprovedNotification(CategoryRequest request) {
        String destination = "/user/" + request.getSeller().getId() + "/queue/category-requests";
        
        CategoryRequestNotification notification = new CategoryRequestNotification(
            "Kategori İsteği Onaylandı",
            String.format("'%s' kategorisi isteğiniz onaylanmıştır.", request.getCategoryName()),
            request.getId(),
            request.getCategoryName(),
            "Admin",
            request.getProcessedAt()
        );
        
        messagingTemplate.convertAndSendToUser(
            request.getSeller().getId().toString(),
            "/queue/category-requests",
            notification
        );
    }
    
    /**
     * Kategori isteği reddedildiğinde satıcıya bildirim gönderir
     */
    public void sendCategoryRequestRejectedNotification(CategoryRequest request) {
        String destination = "/user/" + request.getSeller().getId() + "/queue/category-requests";
        
        CategoryRequestNotification notification = new CategoryRequestNotification(
            "Kategori İsteği Reddedildi",
            String.format("'%s' kategorisi isteğiniz reddedilmiştir. Sebep: %s", 
                request.getCategoryName(), request.getRejectionReason()),
            request.getId(),
            request.getCategoryName(),
            "Admin",
            request.getProcessedAt()
        );
        
        messagingTemplate.convertAndSendToUser(
            request.getSeller().getId().toString(),
            "/queue/category-requests",
            notification
        );
    }
    
    /**
     * Test mesajı için endpoint
     */
    @MessageMapping("/test")
    @SendTo("/topic/test")
    public String testMessage(String message) {
        return "Test mesajı alındı: " + message;
    }
    
    /**
     * Kategori istek bildirimi için DTO
     */
    public static class CategoryRequestNotification {
        private String title;
        private String message;
        private String requestId;
        private String categoryName;
        private String senderName;
        private java.time.LocalDateTime timestamp;
        
        public CategoryRequestNotification(String title, String message, String requestId, 
                                         String categoryName, String senderName, java.time.LocalDateTime timestamp) {
            this.title = title;
            this.message = message;
            this.requestId = requestId;
            this.categoryName = categoryName;
            this.senderName = senderName;
            this.timestamp = timestamp;
        }
        
        // Getters and Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        
        public String getRequestId() { return requestId; }
        public void setRequestId(String requestId) { this.requestId = requestId; }
        
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        
        public String getSenderName() { return senderName; }
        public void setSenderName(String senderName) { this.senderName = senderName; }
        
        public java.time.LocalDateTime getTimestamp() { return timestamp; }
        public void setTimestamp(java.time.LocalDateTime timestamp) { this.timestamp = timestamp; }
    }
}
