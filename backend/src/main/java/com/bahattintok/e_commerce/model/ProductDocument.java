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
    
    /**
     * Fiyatı güvenli şekilde döner
     */
    public BigDecimal getPrice() {
        if (price == null) {
            return BigDecimal.ZERO;
        }
        return price;
    }
    
    /**
     * Fiyatı güvenli şekilde set eder
     */
    public void setPrice(BigDecimal price) {
        this.price = price != null ? price : BigDecimal.ZERO;
    }
    
    @Field(type = FieldType.Integer)
    private Integer stock;
    
    @Field(type = FieldType.Keyword)
    private String imageUrl1;
    
    @Field(type = FieldType.Keyword)
    private String categoryName;
    
    @Field(type = FieldType.Keyword)
    private String storeName;
    
    @Field(type = FieldType.Keyword)
    private String storeId;
    
    @Field(type = FieldType.Double)
    private BigDecimal discountedPrice;
    
    @Field(type = FieldType.Integer)
    private Integer discountPercentage;
    
    @Field(type = FieldType.Date)
    private String createdAt;
    
    @Field(type = FieldType.Date)
    private String updatedAt;
    
    /**
     * Id setter metodu
     */
    public void setId(String id) {
        this.id = id;
    }
    
    /**
     * Name setter metodu
     */
    public void setName(String name) {
        this.name = name;
    }
    
    /**
     * Description setter metodu
     */
    public void setDescription(String description) {
        this.description = description;
    }
    
    /**
     * UpdatedAt setter metodu
     */
    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    /**
     * StoreId getter metodu
     */
    public String getStoreId() {
        return storeId;
    }
    
    /**
     * StoreId setter metodu
     */
    public void setStoreId(String storeId) {
        this.storeId = storeId;
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
     * ImageUrl1 setter metodu
     */
    public void setImageUrl1(String imageUrl1) {
        this.imageUrl1 = imageUrl1;
    }
    
    /**
     * DiscountedPrice setter metodu
     */
    public void setDiscountedPrice(BigDecimal discountedPrice) {
        this.discountedPrice = discountedPrice;
    }
    
    /**
     * DiscountPercentage setter metodu
     */
    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
    
    /**
     * CategoryName setter metodu
     */
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    
    /**
     * StoreName setter metodu
     */
    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }
    
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
        doc.setImageUrl1(product.getImageUrl1());
        doc.setDiscountedPrice(product.getDiscountedPrice());
        doc.setDiscountPercentage(product.getDiscountPercentage());
        
        if (product.getCategory() != null) {
            doc.setCategoryName(product.getCategory().getName());
        }
        
        if (product.getStore() != null) {
            doc.setStoreName(product.getStore().getName());
            doc.setStoreId(product.getStore().getId());
        }
        
        return doc;
    }
} 