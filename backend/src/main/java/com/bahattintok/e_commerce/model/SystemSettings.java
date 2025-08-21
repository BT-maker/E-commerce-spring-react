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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Sistem ayarları entity'si
 */
@Entity
@Table(name = "system_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * Ayar anahtarı (unique)
     */
    @Column(name = "setting_key", unique = true, nullable = false)
    private String key;
    
    /**
     * Ayar değeri
     */
    @Column(name = "setting_value", columnDefinition = "TEXT")
    private String value;
    
    /**
     * Ayar açıklaması
     */
    @Column(name = "description")
    private String description;
    
    /**
     * Ayar kategorisi (GENERAL, EMAIL, PAYMENT, etc.)
     */
    @Column(name = "category")
    private String category;
    
    /**
     * Ayar tipi (STRING, BOOLEAN, NUMBER, JSON)
     */
    @Column(name = "type")
    private String type;
    
    /**
     * Varsayılan değer
     */
    @Column(name = "default_value")
    private String defaultValue;
    
    /**
     * Düzenlenebilir mi?
     */
    @Column(name = "editable")
    private boolean editable = true;
    
    /**
     * Oluşturulma tarihi
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    /**
     * Güncellenme tarihi
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Güncelleyen kullanıcı
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
