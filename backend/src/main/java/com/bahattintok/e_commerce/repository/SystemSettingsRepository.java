package com.bahattintok.e_commerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.SystemSettings;

/**
 * Sistem ayarları repository'si
 */
@Repository
public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Long> {
    
    /**
     * Anahtara göre ayar bulur
     */
    Optional<SystemSettings> findByKey(String key);
    
    /**
     * Kategoriye göre ayarları getirir
     */
    List<SystemSettings> findByCategoryOrderByKey(String category);
    
    /**
     * Düzenlenebilir ayarları getirir
     */
    List<SystemSettings> findByEditableTrueOrderByCategoryAscKeyAsc();
    
    /**
     * Anahtara göre değer bulur
     */
    @Query("SELECT s.value FROM SystemSettings s WHERE s.key = :key")
    Optional<String> findValueByKey(@Param("key") String key);
    
    /**
     * Boolean değer bulur
     */
    @Query("SELECT CASE WHEN s.value = 'true' THEN true ELSE false END FROM SystemSettings s WHERE s.key = :key")
    Optional<Boolean> findBooleanValueByKey(@Param("key") String key);
    
    /**
     * Sayısal değer bulur
     */
    @Query("SELECT CAST(s.value AS double) FROM SystemSettings s WHERE s.key = :key")
    Optional<Double> findNumericValueByKey(@Param("key") String key);
    
    /**
     * Tüm kategorileri getirir
     */
    @Query("SELECT DISTINCT s.category FROM SystemSettings s ORDER BY s.category")
    List<String> findAllCategories();
}
