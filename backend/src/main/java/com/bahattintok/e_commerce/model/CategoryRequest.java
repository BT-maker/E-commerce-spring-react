package com.bahattintok.e_commerce.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Satıcı kategori istekleri için JPA entity'si
 */
@Entity
@Table(name = "category_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    
    /**
     * İstek ID'si (UUID)
     */
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;
    
    /**
     * İstenen kategori adı
     */
    @Column(nullable = false, length = 100)
    private String categoryName;
    
    /**
     * Kategori açıklaması
     */
    @Column(columnDefinition = "TEXT")
    private String description;
    
    /**
     * İstek durumu
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryRequestStatus status = CategoryRequestStatus.PENDING;
    
    /**
     * Red sebebi (eğer reddedilirse)
     */
    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
    
    /**
     * İstek oluşturulma tarihi
     */
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    /**
     * İstek işlenme tarihi (onay/red)
     */
    @Column
    private LocalDateTime processedAt;
    
    /**
     * İsteği oluşturan satıcı
     */
    @ManyToOne(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "seller_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "role"})
    private User seller;
    
    /**
     * İsteği işleyen admin (onay/red)
     */
    @ManyToOne(fetch = jakarta.persistence.FetchType.EAGER)
    @JoinColumn(name = "admin_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "role"})
    private User admin;
    
    /**
     * Kategori istek durumları
     */
    public enum CategoryRequestStatus {
        PENDING,    // Beklemede
        APPROVED,   // Onaylandı
        REJECTED    // Reddedildi
    }
    
    /**
     * Satıcı adını getirir (JSON serialization için)
     */
    @JsonProperty("sellerName")
    public String getSellerName() {
        if (seller != null) {
            if (seller.getFirstName() != null && seller.getLastName() != null) {
                return seller.getFirstName() + " " + seller.getLastName();
            } else {
                return seller.getEmail();
            }
        }
        return null;
    }
    
    /**
     * Satıcı email'ini getirir (JSON serialization için)
     */
    @JsonProperty("sellerEmail")
    public String getSellerEmail() {
        return seller != null ? seller.getEmail() : null;
    }
    
    /**
     * İstek durumunu getirir (JSON serialization için)
     */
    @JsonProperty("statusText")
    public String getStatusText() {
        if (status != null) {
            switch (status) {
                case PENDING:
                    return "PENDING";
                case APPROVED:
                    return "APPROVED";
                case REJECTED:
                    return "REJECTED";
                default:
                    return "UNKNOWN";
            }
        }
        return "UNKNOWN";
    }
    
    /**
     * Status getter metodu (JSON serialization için)
     */
    @JsonProperty("status")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    public String getStatus() {
        return status != null ? status.name() : "UNKNOWN";
    }
    
    /**
     * Status setter metodu
     */
    public void setStatus(CategoryRequestStatus status) {
        this.status = status;
    }
    
    /**
     * Status enum değerini getirir (iç kullanım için)
     */
    public CategoryRequestStatus getStatusEnum() {
        return status;
    }
}
