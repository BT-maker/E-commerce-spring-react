package com.bahattintok.e_commerce.model;

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
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    @JsonIgnoreProperties({"items", "user", "hibernateLazyInitializer", "handler"})
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Product product;

    @Column(nullable = false)
    private Integer quantity;
    
    /**
     * Bu entity şu işlevleri sağlar:
     * 
     * 1. Sepet Ürünü: Sepetteki her ürün için ayrı kayıt
     * 2. Ürün Bilgileri: Ürün detayları ve miktar bilgisi
     * 3. İlişki Yönetimi: Sepet ve ürün arasında many-to-one ilişki
     * 4. JSON Kontrolü: Sonsuz döngüyü önlemek için JsonIgnoreProperties
     * 
     * Bu entity sayesinde sepet ürünleri detaylı şekilde yönetilebilir!
     */
} 