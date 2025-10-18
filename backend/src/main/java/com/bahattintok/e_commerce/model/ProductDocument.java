package com.bahattintok.e_commerce.model;

import java.math.BigDecimal;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String imageUrl1;

    @Field(type = FieldType.Keyword)
    private String imageUrl2;

    @Field(type = FieldType.Keyword)
    private String imageUrl3;

    @Field(type = FieldType.Keyword)
    private String imageUrl4;

    @Field(type = FieldType.Keyword)
    private String imageUrl5;

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

    public static ProductDocument fromProduct(Product product) {
        ProductDocument doc = new ProductDocument();
        doc.setId(product.getId());
        doc.setName(product.getName());
        doc.setDescription(product.getDescription());
        doc.setPrice(product.getPrice());
        doc.setStock(product.getStock());
        
        // Map all image URLs
        doc.setImageUrl(product.getImageUrl());
        doc.setImageUrl1(product.getImageUrl1());
        doc.setImageUrl2(product.getImageUrl2());
        doc.setImageUrl3(product.getImageUrl3());
        doc.setImageUrl4(product.getImageUrl4());
        doc.setImageUrl5(product.getImageUrl5());

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

    // Getters and setters are handled by Lombok's @Data annotation
}