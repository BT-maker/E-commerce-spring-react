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
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Ürünleri temsil eden JPA entity'si.
 */
@Entity
@Table(name = "products")
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
     * Kategori ID'si (foreign key)
     */
    @Column(name = "category_id")
    @JsonIgnore
    private String categoryId;
    
    /**
     * Mağaza ID'si (foreign key, opsiyonel)
     */
    @Column(name = "store_id", nullable = true)
    @JsonProperty("storeId")
    private String storeId;
    
    /**
     * Kategori ilişkisi (lazy loading)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "products"})
    private Category category;
    
    /**
     * Mağaza ilişkisi (lazy loading)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", insertable = false, updatable = false)
    @JsonIgnore
    private Store store;
    
    /**
     * Mağaza adını döner
     */
    @JsonProperty("storeName")
    public String getStoreName() {
        return store != null ? store.getName() : null;
    }
    
    /**
     * Mağaza ID'sini döner
     */
    @JsonProperty("storeId")
    public String getStoreId() {
        return storeId;
    }
    

    

    
    /**
     * Ürün yorumları
     */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Review> reviews = new ArrayList<>();
    
    /**
     * İndirimli fiyatı döner (indirim varsa indirimli fiyat, yoksa normal fiyat)
     */
    @JsonProperty("discountedPrice")
    public BigDecimal getFinalPrice() {
        if (isDiscountActive()) {
            return discountedPrice != null ? discountedPrice : price;
        }
        return price;
    }
    
    /**
     * İndirimin aktif olup olmadığını kontrol eder
     */
    @JsonProperty("isDiscountActive")
    public boolean isDiscountActive() {
        if (discountPercentage == null || discountPercentage <= 0) {
            return false;
        }
        
        // İndirim bitiş tarihi kontrolü
        if (discountEndDate != null && discountEndDate.isBefore(java.time.LocalDateTime.now())) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Satıcının onaylanmış olup olmadığını kontrol eder
     */
    @JsonProperty("isSellerApproved")
    public boolean isSellerApproved() {
        if (store == null || store.getSeller() == null) {
            return false;
        }
        
        User seller = store.getSeller();
        return seller.getSellerStatus() != null && 
               (seller.getSellerStatus().name().equals("APPROVED") || 
                seller.getSellerStatus().name().equals("ACTIVE"));
    }
    
    /**
     * Ürünün yayınlanabilir olup olmadığını kontrol eder
     */
    @JsonProperty("isPublishable")
    public boolean isPublishable() {
        return isSellerApproved() && "AKTİF".equals(status);
    }
    
    /**
     * Ürün görselini döner (varsayılan görsel yoksa)
     */
    public String getImage() {
        return imageUrl != null ? imageUrl : "/images/default-product.jpg";
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
     * Price getter metodu
     */
    public BigDecimal getPrice() {
        return price;
    }
    
    /**
     * Price setter metodu
     */
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    /**
     * Stock getter metodu
     */
    public Integer getStock() {
        return stock;
    }
    
    /**
     * Stock setter metodu
     */
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    
    /**
     * CategoryId getter metodu
     */
    public String getCategoryId() {
        return categoryId;
    }
    
    /**
     * CategoryId setter metodu
     */
    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }
    

    
    /**
     * StoreId setter metodu
     */
    public void setStoreId(String storeId) {
        this.storeId = storeId;
    }
    
    /**
     * ImageUrl getter metodu
     */
    public String getImageUrl() {
        return imageUrl;
    }
    
    /**
     * ImageUrl setter metodu
     */
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
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
     * Category getter metodu
     */
    public Category getCategory() {
        return category;
    }
    
    /**
     * Category setter metodu
     */
    public void setCategory(Category category) {
        this.category = category;
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
     * Status getter metodu
     */
    public String getStatus() {
        return status;
    }
    
    /**
     * Status setter metodu
     */
    public void setStatus(String status) {
        this.status = status;
    }
    
    /**
     * DiscountedPrice getter metodu
     */
    public BigDecimal getDiscountedPrice() {
        return discountedPrice;
    }
    
    /**
     * DiscountedPrice setter metodu
     */
    public void setDiscountedPrice(BigDecimal discountedPrice) {
        this.discountedPrice = discountedPrice;
    }
    
    /**
     * DiscountPercentage getter metodu
     */
    public Integer getDiscountPercentage() {
        return discountPercentage;
    }
    
    /**
     * DiscountPercentage setter metodu
     */
    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
    
    /**
     * DiscountEndDate getter metodu
     */
    public java.time.LocalDateTime getDiscountEndDate() {
        return discountEndDate;
    }
    
    /**
     * DiscountEndDate setter metodu
     */
    public void setDiscountEndDate(java.time.LocalDateTime discountEndDate) {
        this.discountEndDate = discountEndDate;
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