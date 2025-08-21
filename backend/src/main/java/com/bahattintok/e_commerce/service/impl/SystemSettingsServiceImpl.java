package com.bahattintok.e_commerce.service.impl;

import com.bahattintok.e_commerce.model.SystemSettings;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.SystemSettingsRepository;
import com.bahattintok.e_commerce.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Sistem ayarları servis implementasyonu
 */
@Service
@Transactional
public class SystemSettingsServiceImpl implements SystemSettingsService {

    @Autowired
    private SystemSettingsRepository systemSettingsRepository;

    @Override
    public List<SystemSettings> getAllSettings() {
        return systemSettingsRepository.findByEditableTrueOrderByCategoryAscKeyAsc();
    }

    @Override
    public List<SystemSettings> getSettingsByCategory(String category) {
        return systemSettingsRepository.findByCategoryOrderByKey(category);
    }

    @Override
    public SystemSettings getSettingByKey(String key) {
        return systemSettingsRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Ayar bulunamadı: " + key));
    }

    @Override
    public String getValueByKey(String key) {
        return systemSettingsRepository.findValueByKey(key)
                .orElseThrow(() -> new RuntimeException("Ayar değeri bulunamadı: " + key));
    }

    @Override
    public Boolean getBooleanValueByKey(String key) {
        return systemSettingsRepository.findBooleanValueByKey(key)
                .orElse(false);
    }

    @Override
    public Double getNumericValueByKey(String key) {
        return systemSettingsRepository.findNumericValueByKey(key)
                .orElse(0.0);
    }

    @Override
    public SystemSettings updateSetting(String key, String value, User updatedBy) {
        SystemSettings setting = getSettingByKey(key);
        
        if (!setting.isEditable()) {
            throw new RuntimeException("Bu ayar düzenlenemez: " + key);
        }
        
        setting.setValue(value);
        setting.setUpdatedBy(updatedBy);
        
        return systemSettingsRepository.save(setting);
    }

    @Override
    public List<SystemSettings> updateMultipleSettings(Map<String, String> settings, User updatedBy) {
        List<SystemSettings> updatedSettings = new java.util.ArrayList<>();
        
        for (Map.Entry<String, String> entry : settings.entrySet()) {
            try {
                SystemSettings updated = updateSetting(entry.getKey(), entry.getValue(), updatedBy);
                updatedSettings.add(updated);
            } catch (Exception e) {
                System.err.println("Ayar güncellenemedi: " + entry.getKey() + " - " + e.getMessage());
            }
        }
        
        return updatedSettings;
    }

    @Override
    public SystemSettings createSetting(SystemSettings setting) {
        if (systemSettingsRepository.findByKey(setting.getKey()).isPresent()) {
            throw new RuntimeException("Bu anahtar zaten mevcut: " + setting.getKey());
        }
        
        return systemSettingsRepository.save(setting);
    }

    @Override
    public void deleteSetting(String key) {
        SystemSettings setting = getSettingByKey(key);
        systemSettingsRepository.delete(setting);
    }

    @Override
    public List<String> getAllCategories() {
        return systemSettingsRepository.findAllCategories();
    }

    @Override
    public void initializeDefaultSettings() {
        // Eğer hiç ayar yoksa varsayılan ayarları oluştur
        if (systemSettingsRepository.count() == 0) {
            createDefaultSettings();
        }
    }

    private void createDefaultSettings() {
        // Genel Ayarlar
        createSetting(new SystemSettings(null, "site.name", "E-Ticaret Platformu", "Site adı", "GENERAL", "STRING", "E-Ticaret Platformu", true, null, null, null));
        createSetting(new SystemSettings(null, "site.description", "Modern e-ticaret platformu", "Site açıklaması", "GENERAL", "STRING", "Modern e-ticaret platformu", true, null, null, null));
        createSetting(new SystemSettings(null, "site.maintenance", "false", "Bakım modu", "GENERAL", "BOOLEAN", "false", true, null, null, null));
        createSetting(new SystemSettings(null, "site.currency", "TRY", "Para birimi", "GENERAL", "STRING", "TRY", true, null, null, null));
        createSetting(new SystemSettings(null, "site.timezone", "Europe/Istanbul", "Zaman dilimi", "GENERAL", "STRING", "Europe/Istanbul", true, null, null, null));

        // Email Ayarları
        createSetting(new SystemSettings(null, "email.enabled", "true", "Email gönderimi aktif", "EMAIL", "BOOLEAN", "true", true, null, null, null));
        createSetting(new SystemSettings(null, "email.from.name", "E-Ticaret Platformu", "Gönderen adı", "EMAIL", "STRING", "E-Ticaret Platformu", true, null, null, null));
        createSetting(new SystemSettings(null, "email.from.address", "noreply@eticaret.com", "Gönderen email", "EMAIL", "STRING", "noreply@eticaret.com", true, null, null, null));
        createSetting(new SystemSettings(null, "email.smtp.host", "smtp.gmail.com", "SMTP sunucu", "EMAIL", "STRING", "smtp.gmail.com", true, null, null, null));
        createSetting(new SystemSettings(null, "email.smtp.port", "587", "SMTP port", "EMAIL", "NUMBER", "587", true, null, null, null));

        // Ödeme Ayarları
        createSetting(new SystemSettings(null, "payment.stripe.enabled", "false", "Stripe ödeme aktif", "PAYMENT", "BOOLEAN", "false", true, null, null, null));
        createSetting(new SystemSettings(null, "payment.stripe.public.key", "", "Stripe public key", "PAYMENT", "STRING", "", true, null, null, null));
        createSetting(new SystemSettings(null, "payment.stripe.secret.key", "", "Stripe secret key", "PAYMENT", "STRING", "", true, null, null, null));
        createSetting(new SystemSettings(null, "payment.commission.rate", "5.0", "Komisyon oranı (%)", "PAYMENT", "NUMBER", "5.0", true, null, null, null));

        // Satıcı Ayarları
        createSetting(new SystemSettings(null, "seller.auto.approval", "false", "Otomatik satıcı onayı", "SELLER", "BOOLEAN", "false", true, null, null, null));
        createSetting(new SystemSettings(null, "seller.min.products", "1", "Minimum ürün sayısı", "SELLER", "NUMBER", "1", true, null, null, null));
        createSetting(new SystemSettings(null, "seller.commission.rate", "10.0", "Satıcı komisyon oranı (%)", "SELLER", "NUMBER", "10.0", true, null, null, null));

        // Ürün Ayarları
        createSetting(new SystemSettings(null, "product.auto.approval", "true", "Otomatik ürün onayı", "PRODUCT", "BOOLEAN", "true", true, null, null, null));
        createSetting(new SystemSettings(null, "product.max.images", "10", "Maksimum resim sayısı", "PRODUCT", "NUMBER", "10", true, null, null, null));
        createSetting(new SystemSettings(null, "product.min.stock", "0", "Minimum stok uyarısı", "PRODUCT", "NUMBER", "0", true, null, null, null));

        // Bildirim Ayarları
        createSetting(new SystemSettings(null, "notification.email.enabled", "true", "Email bildirimleri aktif", "NOTIFICATION", "BOOLEAN", "true", true, null, null, null));
        createSetting(new SystemSettings(null, "notification.sms.enabled", "false", "SMS bildirimleri aktif", "NOTIFICATION", "BOOLEAN", "false", true, null, null, null));
        createSetting(new SystemSettings(null, "notification.push.enabled", "true", "Push bildirimleri aktif", "NOTIFICATION", "BOOLEAN", "true", true, null, null, null));

        // Güvenlik Ayarları
        createSetting(new SystemSettings(null, "security.password.min.length", "8", "Minimum şifre uzunluğu", "SECURITY", "NUMBER", "8", true, null, null, null));
        createSetting(new SystemSettings(null, "security.login.max.attempts", "5", "Maksimum giriş denemesi", "SECURITY", "NUMBER", "5", true, null, null, null));
        createSetting(new SystemSettings(null, "security.session.timeout", "3600", "Oturum zaman aşımı (saniye)", "SECURITY", "NUMBER", "3600", true, null, null, null));

        System.out.println("Varsayılan sistem ayarları oluşturuldu");
    }
}
