package com.bahattintok.e_commerce.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Kullanıcı bildirimleri için JPA entity'si.
 */
@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    /**
     * Bildirim ID'si (otomatik artan)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Bildirim başlığı
     */
    @Column(nullable = false)
    private String title;
    
    /**
     * Bildirim mesajı
     */
    @Column(nullable = false, length = 1000)
    private String message;
    
    /**
     * Bildirim tipi (ORDER_STATUS, PROMOTION, SYSTEM, etc.)
     */
    @Column(nullable = false)
    private String type;
    
    /**
     * Bildirim okundu mu?
     */
    @Column(nullable = false)
    private boolean read = false;
    
    /**
     * Bildirim oluşturulma tarihi
     */
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * Bildirim alıcısı (kullanıcı)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    /**
     * İlişkili entity ID'si (sipariş, ürün vs.)
     */
    @Column
    private Long relatedEntityId;
    
    /**
     * İlişkili entity tipi
     */
    @Column
    private String relatedEntityType;
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Bildirim Yönetimi: Kullanıcılara gönderilen bildirimlerin saklanması
     * 2. Bildirim Tipleri: Farklı bildirim türlerinin desteklenmesi
     * 3. Okundu Durumu: Bildirimlerin okundu/okunmadı durumunun takibi
     * 4. Zaman Damgası: Bildirim oluşturulma zamanının kaydedilmesi
     * 5. İlişkili Veriler: Bildirimle ilgili entity'lerin referanslanması
     * 6. Kullanıcı İlişkisi: Bildirimlerin kullanıcılarla eşleştirilmesi
     * 
     * Bu entity sayesinde kullanıcı bildirimleri etkili şekilde yönetilebilir!
     */
} 