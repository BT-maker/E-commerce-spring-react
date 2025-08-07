package com.bahattintok.e_commerce.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Ürünleri temsil eden JPA entity'si.
 */
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Product {
    
    /**
     * Ürün ID'si (UUID)
     */
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;
    
    /**
     * Ürün adı
     */
    @Column(nullable = false)
    private String name;
    
    /**
     * Ürün fiyatı
     */
    @Column(nullable = false)
    private BigDecimal price;
    
    /**
     * Ürün açıklaması (opsiyonel)
     */
    @Column(columnDefinition = "TEXT")
    private String description;
    
    /**
     * Stok miktarı
     */
    @Column(nullable = false)
    private Integer stock;
    
    /**
     * Ürün görseli (URL, opsiyonel)
     */
    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;
    
    /**
     * İndirim yüzdesi (0-100 arası, opsiyonel)
     */
    @Column(name = "discount_percentage")
    private Integer discountPercentage;
    
    /**
     * İndirimli fiyat (hesaplanmış, opsiyonel)
     */
    @Column(name = "discounted_price")
    private BigDecimal discountedPrice;
    
    /**
     * İndirim bitiş tarihi (opsiyonel)
     */
    @Column(name = "discount_end_date")
    private java.time.LocalDateTime discountEndDate;
    
    /**
     * Ürün durumu (AKTİF, PASİF)
     */
    @Column(name = "status", nullable = false)
    private String status = "AKTİF"; // Varsayılan olarak aktif
    
    /**
     * Ürünün ait olduğu kategori ID'si (String)
     */
    @Column(name = "category_id")
    @JsonIgnore
    private String categoryId;

    /**
     * Ürünün ait olduğu mağaza ID'si (String)
     */
    @Column(name = "store_id", nullable = true)
    @JsonIgnore
    private String storeId;

    /**
     * Ürünün ait olduğu kategori (lazy loading)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "products"})
    private Category category;

    /**
     * Ürünün ait olduğu mağaza (lazy loading)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", insertable = false, updatable = false)
    @JsonIgnore
    private Store store;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Review> reviews = new ArrayList<>();
    
    /**
     * İndirimli fiyatı hesapla
     */
    @JsonProperty("discountedPrice")
    public BigDecimal getFinalPrice() {
        if (discountPercentage != null && discountPercentage > 0 && 
            (discountEndDate == null || discountEndDate.isAfter(java.time.LocalDateTime.now()))) {
            return price.multiply(BigDecimal.valueOf(100 - discountPercentage))
                       .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        }
        return price;
    }
    
    /**
     * İndirim aktif mi kontrol et
     */
    @JsonProperty("isDiscountActive")
    public boolean isDiscountActive() {
        if (discountEndDate == null || discountPercentage == null || discountPercentage <= 0) {
            return false;
        }
        return java.time.LocalDateTime.now().isBefore(discountEndDate);
    }
    
    /**
     * Ürün görselini döner
     */
    public String getImage() {
        return imageUrl;
    }
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Ürün Yönetimi: E-ticaret ürünlerinin detaylı bilgileri
     * 2. Kategori İlişkisi: Ürünün hangi kategoriye ait olduğu (String ID)
     * 3. Mağaza İlişkisi: Ürünün hangi mağazaya ait olduğu (String ID)
     * 4. Stok Takibi: Ürün stok miktarının kontrolü
     * 5. Görsel Desteği: Ürün görselinin URL formatında saklanması
     * 6. Review Sistemi: Ürün değerlendirmelerinin yönetimi
     * 7. Fiyat Yönetimi: Ürün fiyatının BigDecimal ile hassas hesaplama
     * 8. UUID ID: Performans için String UUID kullanımı
     * 
     * Bu entity sayesinde e-ticaret ürünleri detaylı şekilde yönetilebilir!
     */
} 