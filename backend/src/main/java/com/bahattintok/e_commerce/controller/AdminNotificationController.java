package com.bahattintok.e_commerce.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bahattintok.e_commerce.model.Notification;
import com.bahattintok.e_commerce.repository.NotificationRepository;

/**
 * Admin bildirim işlemleri için REST controller.
 */
@RestController
@RequestMapping("/api/admin/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminNotificationController {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    /**
     * Notification DTO sınıfı - serialization sorunlarını önlemek için
     */
    public static class NotificationDTO {
        private Long id;
        private String title;
        private String message;
        private String type;
        private boolean read;
        private String createdAt;
        private String userName;
        private String userId;
        private Long relatedEntityId;
        private String relatedEntityType;
        
        public NotificationDTO(Notification notification) {
            this.id = notification.getId();
            this.title = notification.getTitle();
            this.message = notification.getMessage();
            this.type = notification.getType();
            this.read = notification.isRead();
            this.createdAt = notification.getCreatedAt() != null ? notification.getCreatedAt().toString() : null;
            this.relatedEntityId = notification.getRelatedEntityId();
            this.relatedEntityType = notification.getRelatedEntityType();
            
            // User bilgilerini güvenli şekilde al
            if (notification.getUser() != null) {
                this.userId = notification.getUser().getId();
                this.userName = notification.getUser().getFirstName() + " " + notification.getUser().getLastName();
            }
        }
        
        // Getters
        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getMessage() { return message; }
        public String getType() { return type; }
        public boolean isRead() { return read; }
        public String getCreatedAt() { return createdAt; }
        public String getUserName() { return userName; }
        public String getUserId() { return userId; }
        public Long getRelatedEntityId() { return relatedEntityId; }
        public String getRelatedEntityType() { return relatedEntityType; }
    }
    
    /**
     * Tüm bildirimleri getirir (admin için)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean read,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        try {
            System.out.println("=== DEBUG: getAllNotifications called ===");
            System.out.println("Page: " + page + ", Size: " + size + ", Search: " + search + ", Type: " + type + ", Read: " + read);
            
            // Filtreleme işlemleri
            List<Notification> allNotifications = notificationRepository.findAll();
            System.out.println("Total notifications found: " + allNotifications.size());
            
            // Arama filtresi
            if (search != null && !search.trim().isEmpty()) {
                allNotifications = allNotifications.stream()
                    .filter(notification -> 
                        (notification.getTitle() != null && notification.getTitle().toLowerCase().contains(search.toLowerCase())) ||
                        (notification.getMessage() != null && notification.getMessage().toLowerCase().contains(search.toLowerCase())) ||
                        (notification.getType() != null && notification.getType().toLowerCase().contains(search.toLowerCase()))
                    )
                    .collect(Collectors.toList());
            }
            
            // Tip filtresi
            if (type != null && !type.trim().isEmpty()) {
                System.out.println("Filtering by type: " + type);
                allNotifications = allNotifications.stream()
                    .filter(notification -> {
                        boolean matches = notification.getType() != null && notification.getType().equals(type);
                        System.out.println("Notification type: " + notification.getType() + ", matches: " + matches);
                        return matches;
                    })
                    .collect(Collectors.toList());
                System.out.println("After type filter: " + allNotifications.size() + " notifications");
            }
            
            // Okundu filtresi
            if (read != null) {
                allNotifications = allNotifications.stream()
                    .filter(notification -> notification.isRead() == read.booleanValue())
                    .collect(Collectors.toList());
            }
            
            // Tarih filtresi
            if (startDate != null && !startDate.trim().isEmpty()) {
                java.time.LocalDateTime start = java.time.LocalDateTime.parse(startDate);
                allNotifications = allNotifications.stream()
                    .filter(notification -> notification.getCreatedAt() != null && notification.getCreatedAt().isAfter(start))
                    .collect(Collectors.toList());
            }
            
            if (endDate != null && !endDate.trim().isEmpty()) {
                java.time.LocalDateTime end = java.time.LocalDateTime.parse(endDate);
                allNotifications = allNotifications.stream()
                    .filter(notification -> notification.getCreatedAt() != null && notification.getCreatedAt().isBefore(end))
                    .collect(Collectors.toList());
            }
            
            // Sayfalama hesaplamaları
            int totalNotifications = allNotifications.size();
            int totalPages = (int) Math.ceil((double) totalNotifications / size);
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, totalNotifications);
            
            // Sayfa için bildirimleri al ve DTO'ya dönüştür
            List<NotificationDTO> pageNotifications = allNotifications.subList(startIndex, endIndex)
                .stream()
                .map(NotificationDTO::new)
                .collect(Collectors.toList());
            
            // İstatistikler
            long totalCount = allNotifications.size();
            long unreadCount = allNotifications.stream().filter(n -> !n.isRead()).count();
            long readCount = allNotifications.stream().filter(n -> n.isRead()).count();
            
            Map<String, Object> response = new HashMap<>();
            response.put("notifications", pageNotifications);
            response.put("currentPage", page);
            response.put("totalPages", totalPages);
            response.put("totalElements", totalCount);
            response.put("hasNext", page < totalPages - 1);
            response.put("hasPrevious", page > 0);
            response.put("stats", Map.of(
                "total", totalCount,
                "unread", unreadCount,
                "read", readCount
            ));
            
            System.out.println("Response prepared successfully");
            System.out.println("Page notifications count: " + pageNotifications.size());
            System.out.println("Total pages: " + totalPages);
            System.out.println("Current page: " + page);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("=== ERROR in getAllNotifications ===");
            System.out.println("Error message: " + e.getMessage());
            System.out.println("Error type: " + e.getClass().getSimpleName());
            e.printStackTrace();
            
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Bildirimler getirilemedi: " + e.getMessage());
            error.put("errorType", e.getClass().getSimpleName());
            error.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Bildirim istatistiklerini getirir
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getNotificationStats() {
        try {
            System.out.println("=== DEBUG: getNotificationStats called ===");
            
            List<Notification> allNotifications = notificationRepository.findAll();
            
            long totalCount = allNotifications.size();
            long unreadCount = allNotifications.stream().filter(n -> !n.isRead()).count();
            long readCount = allNotifications.stream().filter(n -> n.isRead()).count();
            
            // Tip bazında istatistikler
            Map<String, Long> typeStats = allNotifications.stream()
                .collect(Collectors.groupingBy(
                    notification -> notification.getType() != null ? notification.getType() : "UNKNOWN",
                    Collectors.counting()
                ));
            
            Map<String, Object> response = new HashMap<>();
            response.put("total", totalCount);
            response.put("unread", unreadCount);
            response.put("read", readCount);
            response.put("typeStats", typeStats);
            
            System.out.println("Notification stats retrieved successfully: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in getNotificationStats: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Bildirim istatistikleri getirilemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Bildirimi okundu olarak işaretler (admin için)
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markNotificationAsRead(@PathVariable Long id) {
        try {
            System.out.println("=== DEBUG: markNotificationAsRead called ===");
            System.out.println("Notification ID: " + id);
            
            Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bildirim bulunamadı"));
            
            notification.setRead(true);
            notificationRepository.save(notification);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bildirim okundu olarak işaretlendi");
            response.put("notification", new NotificationDTO(notification));
            
            System.out.println("Notification marked as read successfully: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in markNotificationAsRead: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Bildirim işaretlenemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Tüm bildirimleri okundu olarak işaretler (admin için)
     */
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllNotificationsAsRead() {
        try {
            System.out.println("=== DEBUG: markAllNotificationsAsRead called ===");
            
            List<Notification> unreadNotifications = notificationRepository.findAll().stream()
                .filter(n -> !n.isRead())
                .collect(Collectors.toList());
            
            unreadNotifications.forEach(notification -> {
                notification.setRead(true);
                notificationRepository.save(notification);
            });
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tüm bildirimler okundu olarak işaretlendi");
            response.put("updatedCount", unreadNotifications.size());
            
            System.out.println("All notifications marked as read successfully: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in markAllNotificationsAsRead: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Bildirimler işaretlenemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Bildirimi siler (admin için)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNotification(@PathVariable Long id) {
        try {
            System.out.println("=== DEBUG: deleteNotification called ===");
            System.out.println("Notification ID: " + id);
            
            Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bildirim bulunamadı"));
            
            notificationRepository.delete(notification);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bildirim başarıyla silindi");
            response.put("deletedId", id);
            
            System.out.println("Notification deleted successfully: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in deleteNotification: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Bildirim silinemedi: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
