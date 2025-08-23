package com.bahattintok.e_commerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Elasticsearch için Category document modeli.
 * Bu model, kategorileri Elasticsearch'te indexlemek için kullanılır.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "ecommerce_categories")
public class CategoryDocument {
    
    @Id
    private String id;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;
    
    @Field(type = FieldType.Keyword)
    private String imageUrl;
    
    @Field(type = FieldType.Keyword)
    private String status = "AKTİF";
    
    @Field(type = FieldType.Integer)
    private Integer productCount = 0;
    
    /**
     * Category entity'sinden CategoryDocument oluşturur.
     */
    public static CategoryDocument fromCategory(Category category) {
        CategoryDocument doc = new CategoryDocument();
        doc.setId(category.getId());
        doc.setName(category.getName());
        doc.setDescription(category.getDescription());
        doc.setImageUrl(category.getImageUrl());
        // Status ve productCount varsayılan değerlerle kalacak
        
        return doc;
    }
}
