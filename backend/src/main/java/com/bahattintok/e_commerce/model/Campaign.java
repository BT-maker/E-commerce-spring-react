package com.bahattintok.e_commerce.model;

import java.math.BigDecimal;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "campaigns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String campaignType; // "product" or "category"

    @Column(nullable = false)
    private String targetId; // Product ID or Category ID

    @Column(nullable = false)
    private String discountType; // "percentage" or "fixed"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false)
    private boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * Id getter metodu
     */
    public String getId() {
        return id;
    }
    
    /**
     * Id setter metodu
     */
    public void setId(String id) {
        this.id = id;
    }
    
    /**
     * Name getter metodu
     */
    public String getName() {
        return name;
    }
    
    /**
     * Name setter metodu
     */
    public void setName(String name) {
        this.name = name;
    }
    
    /**
     * Description getter metodu
     */
    public String getDescription() {
        return description;
    }
    
    /**
     * Description setter metodu
     */
    public void setDescription(String description) {
        this.description = description;
    }
    
    /**
     * CampaignType getter metodu
     */
    public String getCampaignType() {
        return campaignType;
    }
    
    /**
     * CampaignType setter metodu
     */
    public void setCampaignType(String campaignType) {
        this.campaignType = campaignType;
    }
    
    /**
     * TargetId getter metodu
     */
    public String getTargetId() {
        return targetId;
    }
    
    /**
     * TargetId setter metodu
     */
    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }
    
    /**
     * DiscountType getter metodu
     */
    public String getDiscountType() {
        return discountType;
    }
    
    /**
     * DiscountType setter metodu
     */
    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }
    
    /**
     * DiscountValue getter metodu
     */
    public BigDecimal getDiscountValue() {
        return discountValue;
    }
    
    /**
     * DiscountValue setter metodu
     */
    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }
    
    /**
     * StartDate getter metodu
     */
    public LocalDateTime getStartDate() {
        return startDate;
    }
    
    /**
     * StartDate setter metodu
     */
    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }
    
    /**
     * EndDate getter metodu
     */
    public LocalDateTime getEndDate() {
        return endDate;
    }
    
    /**
     * EndDate setter metodu
     */
    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
    
    /**
     * IsActive getter metodu
     */
    public boolean isActive() {
        return isActive;
    }
    
    /**
     * IsActive setter metodu
     */
    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }
    
    /**
     * Store getter metodu
     */
    public Store getStore() {
        return store;
    }
    
    /**
     * Store setter metodu
     */
    public void setStore(Store store) {
        this.store = store;
    }
    
    /**
     * CreatedAt getter metodu
     */
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    /**
     * CreatedAt setter metodu
     */
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    /**
     * UpdatedAt getter metodu
     */
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    /**
     * UpdatedAt setter metodu
     */
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Kampanya Yönetimi: Ürün ve kategori indirimlerinin saklanması
     * 2. İndirim Türleri: Yüzde (%) veya sabit tutar (₺) indirimleri
     * 3. Hedef Belirleme: Belirli ürün veya kategori için indirim
     * 4. Zaman Yönetimi: Başlangıç ve bitiş tarihleri
     * 5. Durum Kontrolü: Aktif/pasif kampanya durumu
     * 6. Mağaza İlişkisi: Kampanyanın hangi mağazaya ait olduğu
     * 7. Zaman Damgası: Oluşturma ve güncelleme zamanları
     * 
     * Bu entity sayesinde seller'lar kampanyalarını detaylı şekilde yönetebilir!
     */
} 