package com.bahattintok.e_commerce.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "favorites", "password", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled", "hibernateLazyInitializer", "handler"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "store", "category", "hibernateLazyInitializer", "handler"})
    private Product product;

    @Column(nullable = false)
    private int rating; // 1-5 arası

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // JSON serialization için özel getter metodları
    @JsonProperty("userName")
    public String getUserName() {
        if (user == null) {
            return "Anonim";
        }
        
        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        
        // Eğer hem firstName hem lastName null ise email'i kullan
        if ((firstName == null || firstName.trim().isEmpty()) && 
            (lastName == null || lastName.trim().isEmpty())) {
            return user.getEmail() != null ? user.getEmail().split("@")[0] : "Anonim";
        }
        
        // Eğer sadece biri null ise diğerini kullan
        if (firstName == null || firstName.trim().isEmpty()) {
            return lastName != null ? lastName : "Anonim";
        }
        
        if (lastName == null || lastName.trim().isEmpty()) {
            return firstName;
        }
        
        // Her ikisi de varsa birleştir
        return firstName + " " + lastName;
    }
    
    @JsonProperty("userEmail")
    public String getUserEmail() {
        return user != null ? user.getEmail() : null;
    }
    
    @JsonProperty("productName")
    public String getProductName() {
        return product != null ? product.getName() : null;
    }
    
    /**
     * User getter metodu
     */
    public User getUser() {
        return user;
    }
    
    /**
     * User setter metodu
     */
    public void setUser(User user) {
        this.user = user;
    }
    
    /**
     * Product getter metodu
     */
    public Product getProduct() {
        return product;
    }
    
    /**
     * Product setter metodu
     */
    public void setProduct(Product product) {
        this.product = product;
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
     * Rating getter metodu
     */
    public int getRating() {
        return rating;
    }
    
    /**
     * Rating setter metodu
     */
    public void setRating(int rating) {
        this.rating = rating;
    }
    
    /**
     * Comment getter metodu
     */
    public String getComment() {
        return comment;
    }
    
    /**
     * Comment setter metodu
     */
    public void setComment(String comment) {
        this.comment = comment;
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
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Ürün Değerlendirmesi: Kullanıcıların ürün puanlama ve yorum sistemi
     * 2. Kullanıcı İlişkisi: Review ile kullanıcı arasında many-to-one ilişki
     * 3. Ürün İlişkisi: Review ile ürün arasında many-to-one ilişki
     * 4. Puanlama Sistemi: 1-5 arası ürün puanlama
     * 5. Yorum Sistemi: Kullanıcı yorumlarının saklanması
     * 6. Zaman Damgası: Review oluşturma zamanı
     * 7. JSON Kontrolü: Hassas bilgilerin gizlenmesi için JsonIgnoreProperties
     * 
     * Bu entity sayesinde ürün değerlendirme sistemi kapsamlı şekilde yönetilebilir!
     */
} 