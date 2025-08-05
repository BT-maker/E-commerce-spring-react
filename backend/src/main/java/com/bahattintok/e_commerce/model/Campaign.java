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