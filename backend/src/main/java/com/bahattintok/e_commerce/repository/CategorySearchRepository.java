package com.bahattintok.e_commerce.repository;

import java.util.List;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.CategoryDocument;

/**
 * Elasticsearch için Category search repository'si.
 * Bu repository, kategori arama işlemlerini Elasticsearch'te yapar.
 * Sadece elasticsearch.enabled=true olduğunda aktif olur.
 */
@Repository
@ConditionalOnProperty(name = "elasticsearch.enabled", havingValue = "true", matchIfMissing = false)
public interface CategorySearchRepository extends ElasticsearchRepository<CategoryDocument, String> {
    
    /**
     * İsme göre arama yapar.
     */
    List<CategoryDocument> findByNameContainingIgnoreCase(String name);
    
    /**
     * Açıklamaya göre arama yapar.
     */
    List<CategoryDocument> findByDescriptionContainingIgnoreCase(String description);
    
    /**
     * Duruma göre kategorileri getirir.
     */
    List<CategoryDocument> findByStatus(String status);
    
    /**
     * Ürün sayısına göre kategorileri getirir.
     */
    List<CategoryDocument> findByProductCountGreaterThan(Integer minProductCount);
    
    /**
     * Anahtar kelime ile arama yapar (sayfalama ile).
     */
    @Query("{\"bool\": {\"should\": [{\"match\": {\"name\": \"?0\"}}, {\"match\": {\"description\": \"?0\"}}]}}")
    Page<CategoryDocument> searchByKeyword(String keyword, Pageable pageable);
    
    /**
     * Tam metin araması yapar.
     */
    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"name^2\", \"description\"]}}")
    List<CategoryDocument> fullTextSearch(String query);
    
    /**
     * Popüler kategorileri getirir (ürün sayısına göre).
     */
    @Query("{\"sort\": [{\"productCount\": {\"order\": \"desc\"}}]}")
    List<CategoryDocument> findPopularCategories();
    
    /**
     * Aktif kategorileri getirir.
     */
    List<CategoryDocument> findByStatusOrderByNameAsc(String status);
}
