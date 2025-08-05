package com.bahattintok.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bahattintok.e_commerce.model.Campaign;
import com.bahattintok.e_commerce.model.Store;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, String> {
    
    /**
     * Mağazaya ait tüm kampanyaları getir
     */
    List<Campaign> findByStore(Store store);
    
    /**
     * Mağazaya ait aktif kampanyaları getir
     */
    List<Campaign> findByStoreAndIsActiveTrue(Store store);
    
    /**
     * Mağazaya ait belirli türdeki kampanyaları getir
     */
    List<Campaign> findByStoreAndCampaignType(Store store, String campaignType);
    
    /**
     * Mağazaya ait belirli türdeki aktif kampanyaları getir
     */
    List<Campaign> findByStoreAndCampaignTypeAndIsActiveTrue(Store store, String campaignType);
    
    /**
     * Belirli hedef için aktif kampanyaları getir (ürün veya kategori)
     */
    List<Campaign> findByTargetIdAndCampaignTypeAndIsActiveTrue(String targetId, String campaignType);
} 