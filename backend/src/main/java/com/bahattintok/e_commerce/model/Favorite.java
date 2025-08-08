package com.bahattintok.e_commerce.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

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
import lombok.ToString;

@Entity
@Table(name = "favorites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"user", "product"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"favorites", "hibernateLazyInitializer", "handler"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "reviews", "store"})
    private Product product;

    @Column(nullable = false)
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
    
    /**
     * Id getter metodu
     */
    public Long getId() {
        return id;
    }
    
    /**
     * Id setter metodu
     */
    public void setId(Long id) {
        this.id = id;
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
     * CreatedAt getter metodu
     */
    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    /**
     * CreatedAt setter metodu
     */
    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Favori Yönetimi: Kullanıcıların favori ürünlerini saklama
     * 2. Kullanıcı İlişkisi: Kullanıcı ile favori arasında many-to-one ilişki
     * 3. Ürün İlişkisi: Ürün ile favori arasında many-to-one ilişki
     * 4. Zaman Damgası: Favori ekleme zamanının kaydedilmesi
     * 5. JSON Kontrolü: Sonsuz döngüyü önlemek için JsonIgnoreProperties
     * 
     * Bu entity sayesinde kullanıcıların favori ürünleri yönetilebilir!
     */
} 