package com.bahattintok.e_commerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Notification;
import com.bahattintok.e_commerce.model.User;

/**
 * Bildirimler için JPA repository'si.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    /**
     * Kullanıcının tüm bildirimlerini getirir (sayfalama ile)
     */
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    /**
     * Kullanıcının okunmamış bildirimlerini getirir
     */
    List<Notification> findByUserAndReadFalseOrderByCreatedAtDesc(User user);
    
    /**
     * Kullanıcının okunmamış bildirim sayısını getirir
     */
    long countByUserAndReadFalse(User user);
    
    /**
     * Belirli tipteki bildirimleri getirir
     */
    List<Notification> findByUserAndTypeOrderByCreatedAtDesc(User user, String type);
    
    /**
     * Kullanıcının tüm bildirimlerini okundu olarak işaretler
     */
    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.user = :user")
    void markAllAsReadByUser(@Param("user") User user);
    
    /**
     * Belirli bir bildirimi okundu olarak işaretler
     */
    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.id = :id AND n.user = :user")
    void markAsReadByIdAndUser(@Param("id") Long id, @Param("user") User user);
    
    /**
     * Eski bildirimleri siler (30 günden eski)
     */
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.createdAt < :date")
    void deleteOldNotifications(@Param("date") java.time.LocalDateTime date);
} 