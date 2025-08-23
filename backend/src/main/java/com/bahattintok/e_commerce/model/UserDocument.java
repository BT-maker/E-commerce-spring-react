package com.bahattintok.e_commerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Elasticsearch için User document modeli.
 * Bu model, kullanıcıları Elasticsearch'te indexlemek için kullanılır.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "ecommerce_users")
public class UserDocument {
    
    @Id
    private String id;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String firstName;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String lastName;
    
    @Field(type = FieldType.Keyword)
    private String email;
    
    @Field(type = FieldType.Keyword)
    private String phone;
    
    @Field(type = FieldType.Keyword)
    private String role;
    
    @Field(type = FieldType.Keyword)
    private String sellerStatus;
    
    @Field(type = FieldType.Keyword)
    private String status = "AKTİF";
    
    @Field(type = FieldType.Date)
    private String registrationDate;
    
    @Field(type = FieldType.Date)
    private String sellerApplicationDate;
    
    @Field(type = FieldType.Date)
    private String approvalDate;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String rejectionReason;
    
    @Field(type = FieldType.Keyword)
    private String approvedByAdminId;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String approvedByAdminName;
    
    @Field(type = FieldType.Integer)
    private Integer orderCount = 0;
    
    @Field(type = FieldType.Integer)
    private Integer productCount = 0;
    
    @Field(type = FieldType.Double)
    private Double totalSpent = 0.0;
    
    /**
     * User entity'sinden UserDocument oluşturur.
     */
    public static UserDocument fromUser(User user) {
        UserDocument doc = new UserDocument();
        doc.setId(user.getId());
        doc.setFirstName(user.getFirstName());
        doc.setLastName(user.getLastName());
        doc.setEmail(user.getEmail());
        doc.setPhone(user.getPhone());
        // Status varsayılan değerle kalacak
        
        // Role bilgisini ekle
        if (user.getRole() != null) {
            doc.setRole(user.getRole().getName());
        }
        
        // Seller bilgilerini ekle
        if (user.getSellerStatus() != null) {
            doc.setSellerStatus(user.getSellerStatus().name());
        }
        
        // Tarih bilgilerini ekle
        if (user.getRegistrationDate() != null) {
            doc.setRegistrationDate(user.getRegistrationDate().toString());
        }
        if (user.getSellerApplicationDate() != null) {
            doc.setSellerApplicationDate(user.getSellerApplicationDate().toString());
        }
        if (user.getApprovalDate() != null) {
            doc.setApprovalDate(user.getApprovalDate().toString());
        }
        
        // Red sebebi
        doc.setRejectionReason(user.getRejectionReason());
        
        // Onaylayan admin bilgilerini ekle
        if (user.getApprovedBy() != null) {
            doc.setApprovedByAdminId(user.getApprovedBy().getId());
            doc.setApprovedByAdminName(user.getApprovedBy().getFirstName() + " " + user.getApprovedBy().getLastName());
        }
        
        return doc;
    }
}
