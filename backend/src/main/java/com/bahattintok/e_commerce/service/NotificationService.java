package com.bahattintok.e_commerce.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.bahattintok.e_commerce.model.Notification;
import com.bahattintok.e_commerce.model.User;

/**
 * Bildirim işlemleri için servis interface'i.
 */
public interface NotificationService {
    
    /**
     * Kullanıcının bildirimlerini getirir (sayfalama ile)
     */
    Page<Notification> getUserNotifications(User user, Pageable pageable);
    
    /**
     * Kullanıcının okunmamış bildirimlerini getirir
     */
    List<Notification> getUnreadNotifications(User user);
    
    /**
     * Kullanıcının okunmamış bildirim sayısını getirir
     */
    long getUnreadCount(User user);
    
    /**
     * Belirli bir bildirimi okundu olarak işaretler
     */
    void markAsRead(Long notificationId, User user);
    
    /**
     * Kullanıcının tüm bildirimlerini okundu olarak işaretler
     */
    void markAllAsRead(User user);
    
    /**
     * Yeni bildirim oluşturur
     */
    Notification createNotification(String title, String message, String type, User user);
    
    /**
     * İlişkili entity ile bildirim oluşturur
     */
    Notification createNotification(String title, String message, String type, User user, 
                                  Long relatedEntityId, String relatedEntityType);
    
    /**
     * Sipariş durumu değişikliği bildirimi
     */
    void sendOrderStatusNotification(User user, Long orderId, String status);
    
    /**
     * Promosyon bildirimi
     */
    void sendPromotionNotification(User user, String title, String message);
    
    /**
     * Sistem bildirimi
     */
    void sendSystemNotification(User user, String title, String message);
    
    /**
     * Eski bildirimleri temizler
     */
    void cleanupOldNotifications();
} 