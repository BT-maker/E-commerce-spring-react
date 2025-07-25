package com.bahattintok.e_commerce.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

/**
 * Ürünleri temsil eden JPA entity'si.
 */
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    /**
     * Ürün ID'si (otomatik artan)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
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
     * Ürünün ait olduğu kategori
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    @JsonIgnore
    private Store store;
} 