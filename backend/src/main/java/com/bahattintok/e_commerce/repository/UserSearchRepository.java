package com.bahattintok.e_commerce.repository;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.UserDocument;

/**
 * Elasticsearch için User search repository'si.
 * Bu repository, kullanıcı arama işlemlerini Elasticsearch'te yapar.
 * Sadece elasticsearch.enabled=true olduğunda aktif olur.
 */
@Repository
@ConditionalOnProperty(name = "elasticsearch.enabled", havingValue = "true", matchIfMissing = false)
public interface UserSearchRepository extends ElasticsearchRepository<UserDocument, String> {
    
    /**
     * İsme göre arama yapar.
     */
    List<UserDocument> findByFirstNameContainingIgnoreCase(String firstName);
    
    /**
     * Soyada göre arama yapar.
     */
    List<UserDocument> findByLastNameContainingIgnoreCase(String lastName);
    
    /**
     * Email'e göre kullanıcıyı getirir.
     */
    List<UserDocument> findByEmail(String email);
    
    /**
     * Role'e göre kullanıcıları getirir.
     */
    List<UserDocument> findByRole(String role);
    
    /**
     * Satıcı durumuna göre kullanıcıları getirir.
     */
    List<UserDocument> findBySellerStatus(String sellerStatus);
    
    /**
     * Satıcı durumuna göre kullanıcıları getirir.
     */
    List<UserDocument> findByRoleAndSellerStatus(String role, String sellerStatus);
    
    /**
     * Onaylayan admin'e göre kullanıcıları getirir.
     */
    List<UserDocument> findByApprovedByAdminId(String adminId);
    
    /**
     * Anahtar kelime ile arama yapar (sayfalama ile).
     */
    @Query("{\"bool\": {\"should\": [{\"match\": {\"firstName\": \"?0\"}}, {\"match\": {\"lastName\": \"?0\"}}, {\"match\": {\"email\": \"?0\"}}]}}")
    Page<UserDocument> searchByKeyword(String keyword, Pageable pageable);
    
    /**
     * Tam metin araması yapar.
     */
    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"firstName^2\", \"lastName^2\", \"email\"]}}")
    List<UserDocument> fullTextSearch(String query);
    
    /**
     * Satıcıları getirir (role = SELLER).
     */
    List<UserDocument> findByRoleOrderByRegistrationDateDesc(String role);
    
    /**
     * Onay bekleyen satıcıları getirir.
     */
    List<UserDocument> findByRoleAndSellerStatusOrderBySellerApplicationDateDesc(String role, String sellerStatus);
    
    /**
     * Yeni kayıt olan kullanıcıları getirir.
     */
    @Query("{\"sort\": [{\"registrationDate\": {\"order\": \"desc\"}}]}")
    List<UserDocument> findRecentUsers();
    
    /**
     * En çok sipariş veren kullanıcıları getirir.
     */
    @Query("{\"sort\": [{\"orderCount\": {\"order\": \"desc\"}}]}")
    List<UserDocument> findTopCustomers();
    
    /**
     * En çok harcama yapan kullanıcıları getirir.
     */
    @Query("{\"sort\": [{\"totalSpent\": {\"order\": \"desc\"}}]}")
    List<UserDocument> findTopSpenders();
}
