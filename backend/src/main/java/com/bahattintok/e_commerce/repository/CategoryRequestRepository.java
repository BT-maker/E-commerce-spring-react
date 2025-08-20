package com.bahattintok.e_commerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.CategoryRequest;
import com.bahattintok.e_commerce.model.CategoryRequest.CategoryRequestStatus;
import com.bahattintok.e_commerce.model.User;

/**
 * CategoryRequest veritabanı işlemleri için repository
 */
@Repository
public interface CategoryRequestRepository extends JpaRepository<CategoryRequest, String> {
    
    /**
     * Satıcının bekleyen istek sayısını getirir
     */
    @Query("SELECT COUNT(cr) FROM CategoryRequest cr WHERE cr.seller = :seller AND cr.status = 'PENDING'")
    long countPendingRequestsBySeller(@Param("seller") User seller);
    
    /**
     * Satıcının tüm isteklerini getirir (sayfalama ile)
     */
    Page<CategoryRequest> findBySellerOrderByCreatedAtDesc(User seller, Pageable pageable);
    
    /**
     * Belirli durumdaki istekleri getirir (sayfalama ile)
     */
    Page<CategoryRequest> findByStatusOrderByCreatedAtDesc(CategoryRequestStatus status, Pageable pageable);
    
    /**
     * Tüm istekleri tarih sırasına göre getirir (sayfalama ile)
     */
    Page<CategoryRequest> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    /**
     * Bekleyen istekleri getirir
     */
    List<CategoryRequest> findByStatusOrderByCreatedAtAsc(CategoryRequestStatus status);
    
    /**
     * Kategori adına göre istek var mı kontrol eder
     */
    @Query("SELECT COUNT(cr) > 0 FROM CategoryRequest cr WHERE LOWER(cr.categoryName) = LOWER(:categoryName) AND cr.status = 'PENDING'")
    boolean existsByCategoryNameIgnoreCaseAndStatusPending(@Param("categoryName") String categoryName);
    
    /**
     * Satıcının belirli kategori adıyla bekleyen isteği var mı
     */
    @Query("SELECT cr FROM CategoryRequest cr WHERE cr.seller = :seller AND LOWER(cr.categoryName) = LOWER(:categoryName) AND cr.status = 'PENDING'")
    Optional<CategoryRequest> findBySellerAndCategoryNameIgnoreCaseAndStatusPending(
        @Param("seller") User seller, 
        @Param("categoryName") String categoryName
    );
}
