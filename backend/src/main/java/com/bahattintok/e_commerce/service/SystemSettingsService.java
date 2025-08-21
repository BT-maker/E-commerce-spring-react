package com.bahattintok.e_commerce.service;

import java.util.List;
import java.util.Map;

import com.bahattintok.e_commerce.model.SystemSettings;
import com.bahattintok.e_commerce.model.User;

/**
 * Sistem ayarları servis interface'i
 */
public interface SystemSettingsService {
    
    /**
     * Tüm ayarları getirir
     */
    List<SystemSettings> getAllSettings();
    
    /**
     * Kategoriye göre ayarları getirir
     */
    List<SystemSettings> getSettingsByCategory(String category);
    
    /**
     * Anahtara göre ayar getirir
     */
    SystemSettings getSettingByKey(String key);
    
    /**
     * Anahtara göre değer getirir
     */
    String getValueByKey(String key);
    
    /**
     * Boolean değer getirir
     */
    Boolean getBooleanValueByKey(String key);
    
    /**
     * Sayısal değer getirir
     */
    Double getNumericValueByKey(String key);
    
    /**
     * Ayar günceller
     */
    SystemSettings updateSetting(String key, String value, User updatedBy);
    
    /**
     * Birden fazla ayar günceller
     */
    List<SystemSettings> updateMultipleSettings(Map<String, String> settings, User updatedBy);
    
    /**
     * Ayar oluşturur
     */
    SystemSettings createSetting(SystemSettings setting);
    
    /**
     * Ayar siler
     */
    void deleteSetting(String key);
    
    /**
     * Tüm kategorileri getirir
     */
    List<String> getAllCategories();
    
    /**
     * Varsayılan ayarları oluşturur
     */
    void initializeDefaultSettings();
}
