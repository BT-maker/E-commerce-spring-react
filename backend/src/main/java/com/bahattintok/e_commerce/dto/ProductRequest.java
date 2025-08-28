package com.bahattintok.e_commerce.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Ürün oluşturma/güncelleme isteklerinde kullanılan DTO.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    
    /**
     * Ürün adı
     */
    @NotBlank(message = "Product name is required")
    private String name;
    
    /**
     * Ürün fiyatı
     */
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    /**
     * Ürün açıklaması (opsiyonel)
     */
    private String description;
    
    /**
     * Stok miktarı
     */
    @NotNull(message = "Stock is required")
    @Positive(message = "Stock must be positive")
    private Integer stock;
    
    /**
     * Ürün görseli (URL) - Eski alan, geriye uyumluluk için
     */
    private String imageUrl;
    
    /**
     * Ürün görseli 1 (Ana resim)
     */
    private String imageUrl1;
    
    /**
     * Ürün görseli 2
     */
    private String imageUrl2;
    
    /**
     * Ürün görseli 3
     */
    private String imageUrl3;
    
    /**
     * Ürün görseli 4
     */
    private String imageUrl4;
    
    /**
     * Ürün görseli 5
     */
    private String imageUrl5;
    
    /**
     * Kategori ID'si
     */
    @NotNull(message = "Category is required")
    private String categoryId;
    
    /**
     * Bu DTO şu işlevleri sağlar:
     * 
     * 1. Ürün Bilgileri: Ürün adı, fiyatı, açıklaması ve stok bilgileri
     * 2. Görsel Desteği: Ürün görselinin URL formatında saklanması
     * 3. Kategori Bağlantısı: Ürünün hangi kategoriye ait olduğunun belirtilmesi
     * 4. Veri Doğrulama: Tüm gerekli alanların ve pozitif değerlerin kontrolü
     * 
     * Bu DTO sayesinde ürün oluşturma ve güncelleme işlemlerinde tutarlı veri yapısı sağlanır!
     */
} 