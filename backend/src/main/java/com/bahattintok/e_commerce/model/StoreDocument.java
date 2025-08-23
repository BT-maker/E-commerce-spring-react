package com.bahattintok.e_commerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Elasticsearch için Store document modeli.
 * Bu model, mağazaları Elasticsearch'te indexlemek için kullanılır.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "ecommerce_stores")
public class StoreDocument {
    
    @Id
    private String id;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;
    
    @Field(type = FieldType.Keyword)
    private String logo;
    
    @Field(type = FieldType.Keyword)
    private String banner;
    
    @Field(type = FieldType.Keyword)
    private String website;
    
    @Field(type = FieldType.Keyword)
    private String phone;
    
    @Field(type = FieldType.Keyword)
    private String email;
    
    @Field(type = FieldType.Keyword)
    private String address;
    
    @Field(type = FieldType.Keyword)
    private String workingHours;
    
    @Field(type = FieldType.Keyword)
    private String sellerId;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String sellerName;
    
    @Field(type = FieldType.Keyword)
    private String sellerEmail;
    
    @Field(type = FieldType.Integer)
    private Integer productCount = 0;
    
    @Field(type = FieldType.Date)
    private String createdAt;
    
    @Field(type = FieldType.Date)
    private String updatedAt;
    
    /**
     * Store entity'sinden StoreDocument oluşturur.
     */
    public static StoreDocument fromStore(Store store) {
        StoreDocument doc = new StoreDocument();
        doc.setId(store.getId());
        doc.setName(store.getName());
        doc.setDescription(store.getDescription());
        doc.setLogo(store.getLogo());
        doc.setBanner(store.getBanner());
        doc.setWebsite(store.getWebsite());
        doc.setPhone(store.getPhone());
        doc.setEmail(store.getEmail());
        doc.setAddress(store.getAddress());
        doc.setWorkingHours(store.getWorkingHours());
        
        // Product count'u hesapla
        if (store.getProducts() != null) {
            doc.setProductCount(store.getProducts().size());
        }
        
        // Tarih bilgilerini ekle
        if (store.getCreatedAt() != null) {
            doc.setCreatedAt(store.getCreatedAt().toString());
        }
        if (store.getUpdatedAt() != null) {
            doc.setUpdatedAt(store.getUpdatedAt().toString());
        }
        
        // Seller bilgilerini ekle
        if (store.getSeller() != null) {
            doc.setSellerId(store.getSeller().getId());
            doc.setSellerName(store.getSeller().getFirstName() + " " + store.getSeller().getLastName());
            doc.setSellerEmail(store.getSeller().getEmail());
        }
        
        return doc;
    }
}
