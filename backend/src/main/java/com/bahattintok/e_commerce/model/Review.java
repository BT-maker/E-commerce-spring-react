package com.bahattintok.e_commerce.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "favorites", "password", "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "store"})
    private Product product;

    @Column(nullable = false)
    private int rating; // 1-5 arası

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    
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