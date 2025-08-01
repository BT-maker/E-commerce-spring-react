package com.bahattintok.e_commerce.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.model.Notification;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.NotificationRepository;
import com.bahattintok.e_commerce.service.NotificationService;

/**
 * Bildirim servisi implementasyonu.
 */
@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Override
    public Page<Notification> getUserNotifications(User user, Pageable pageable) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }
    
    @Override
    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndReadFalseOrderByCreatedAtDesc(user);
    }
    
    @Override
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }
    
    @Override
    public void markAsRead(Long notificationId, User user) {
        notificationRepository.markAsReadByIdAndUser(notificationId, user);
    }
    
    @Override
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadByUser(user);
    }
    
    @Override
    public Notification createNotification(String title, String message, String type, User user) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setUser(user);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }
    
    @Override
    public Notification createNotification(String title, String message, String type, User user, 
                                        Long relatedEntityId, String relatedEntityType) {
        Notification notification = createNotification(title, message, type, user);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setRelatedEntityType(relatedEntityType);
        
        return notificationRepository.save(notification);
    }
    
    @Override
    public void sendOrderStatusNotification(User user, Long orderId, String status) {
        String title = "Sipariş Durumu Güncellendi";
        String message = String.format("Sipariş #%d durumu '%s' olarak güncellendi.", orderId, status);
        
        createNotification(title, message, "ORDER_STATUS", user, orderId, "ORDER");
    }
    
    @Override
    public void sendPromotionNotification(User user, String title, String message) {
        createNotification(title, message, "PROMOTION", user);
    }
    
    @Override
    public void sendSystemNotification(User user, String title, String message) {
        createNotification(title, message, "SYSTEM", user);
    }
    
    @Override
    @Scheduled(cron = "0 0 2 * * ?") // Her gün saat 02:00'de çalışır
    public void cleanupOldNotifications() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        notificationRepository.deleteOldNotifications(thirtyDaysAgo);
    }
} 