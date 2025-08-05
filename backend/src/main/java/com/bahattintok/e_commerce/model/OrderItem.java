package com.bahattintok.e_commerce.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties("items")
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "reviews", "store"})
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal price; // sipariş anındaki ürün fiyatı
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Sipariş Ürünü: Siparişteki her ürün için ayrı kayıt
     * 2. Ürün Detayları: Ürün bilgileri, miktar ve fiyat
     * 3. Fiyat Sabitleme: Sipariş anındaki ürün fiyatının saklanması
     * 4. İlişki Yönetimi: Sipariş ve ürün arasında many-to-one ilişki
     * 5. JSON Kontrolü: Sonsuz döngüyü önlemek için JsonIgnoreProperties
     * 
     * Bu entity sayesinde sipariş ürünleri detaylı şekilde yönetilebilir!
     */
} 