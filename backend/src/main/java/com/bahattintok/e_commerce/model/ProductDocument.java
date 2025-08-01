package com.bahattintok.e_commerce.model;

import java.math.BigDecimal;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Elasticsearch için Product document modeli.
 * Bu model, ürünleri Elasticsearch'te indexlemek için kullanılır.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "ecommerce_products")
public class ProductDocument {
    
    @Id
    private String id;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;
    
    @Field(type = FieldType.Double)
    private BigDecimal price;
    
    @Field(type = FieldType.Integer)
    private Integer stock;
    
    @Field(type = FieldType.Keyword)
    private String imageUrl;
    
    @Field(type = FieldType.Keyword)
    private String categoryName;
    
    @Field(type = FieldType.Keyword)
    private String storeName;
    
    @Field(type = FieldType.Double)
    private BigDecimal discountedPrice;
    
    @Field(type = FieldType.Integer)
    private Integer discountPercentage;
    
    @Field(type = FieldType.Date)
    private String createdAt;
    
    @Field(type = FieldType.Date)
    private String updatedAt;
    
    /**
     * Product entity'sinden ProductDocument oluşturur.
     */
    public static ProductDocument fromProduct(Product product) {
        ProductDocument doc = new ProductDocument();
        doc.setId(product.getId());
        doc.setName(product.getName());
        doc.setDescription(product.getDescription());
        doc.setPrice(product.getPrice());
        doc.setStock(product.getStock());
        doc.setImageUrl(product.getImageUrl());
        doc.setDiscountedPrice(product.getDiscountedPrice());
        doc.setDiscountPercentage(product.getDiscountPercentage());
        
        if (product.getCategory() != null) {
            doc.setCategoryName(product.getCategory().getName());
        }
        
        if (product.getStore() != null) {
            doc.setStoreName(product.getStore().getName());
        }
        
        return doc;
    }
} 