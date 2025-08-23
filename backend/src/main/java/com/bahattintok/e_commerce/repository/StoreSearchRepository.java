package com.bahattintok.e_commerce.repository;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.StoreDocument;

/**
 * Elasticsearch için Store search repository'si.
 * Bu repository, mağaza arama işlemlerini Elasticsearch'te yapar.
 * Sadece elasticsearch.enabled=true olduğunda aktif olur.
 */
@Repository
@ConditionalOnProperty(name = "elasticsearch.enabled", havingValue = "true", matchIfMissing = false)
public interface StoreSearchRepository extends ElasticsearchRepository<StoreDocument, String> {
    
    /**
     * İsme göre arama yapar.
     */
    List<StoreDocument> findByNameContainingIgnoreCase(String name);
    
    /**
     * Açıklamaya göre arama yapar.
     */
    List<StoreDocument> findByDescriptionContainingIgnoreCase(String description);
    
    /**
     * Adrese göre mağazaları getirir.
     */
    List<StoreDocument> findByAddressContainingIgnoreCase(String address);
    
    /**
     * Satıcı ID'sine göre mağazayı getirir.
     */
    List<StoreDocument> findBySellerId(String sellerId);
    
    /**
     * Satıcı email'ine göre mağazayı getirir.
     */
    List<StoreDocument> findBySellerEmail(String sellerEmail);
    
    /**
     * Ürün sayısına göre mağazaları getirir.
     */
    List<StoreDocument> findByProductCountGreaterThan(Integer minProductCount);
    
    /**
     * Anahtar kelime ile arama yapar (sayfalama ile).
     */
    @Query("{\"bool\": {\"should\": [{\"match\": {\"name\": \"?0\"}}, {\"match\": {\"description\": \"?0\"}}, {\"match\": {\"sellerName\": \"?0\"}}]}}")
    Page<StoreDocument> searchByKeyword(String keyword, Pageable pageable);
    
    /**
     * Tam metin araması yapar.
     */
    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"name^2\", \"description\", \"sellerName\"]}}")
    List<StoreDocument> fullTextSearch(String query);
    
    /**
     * Popüler mağazaları getirir (ürün sayısına göre).
     */
    @Query("{\"sort\": [{\"productCount\": {\"order\": \"desc\"}}]}")
    List<StoreDocument> findPopularStores();
    
    /**
     * Şehir ve ürün sayısına göre mağazaları getirir.
     */
    List<StoreDocument> findByAddressContainingIgnoreCaseAndProductCountGreaterThan(String address, Integer minProductCount);
    
    /**
     * Satıcı adına göre mağazaları getirir.
     */
    List<StoreDocument> findBySellerNameContainingIgnoreCase(String sellerName);
}
