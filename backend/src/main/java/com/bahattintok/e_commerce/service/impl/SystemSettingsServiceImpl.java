package com.bahattintok.e_commerce.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bahattintok.e_commerce.model.SystemSettings;
import com.bahattintok.e_commerce.model.User;
import com.bahattintok.e_commerce.repository.SystemSettingsRepository;
import com.bahattintok.e_commerce.service.SystemSettingsService;

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
        SystemSettings siteName = new SystemSettings();
        siteName.setKey("site.name");
        siteName.setValue("E-Ticaret Platformu");
        siteName.setDescription("Site adı");
        siteName.setCategory("GENERAL");
        siteName.setType("STRING");
        siteName.setDefaultValue("E-Ticaret Platformu");
        siteName.setEditable(true);
        createSetting(siteName);

        SystemSettings siteDesc = new SystemSettings();
        siteDesc.setKey("site.description");
        siteDesc.setValue("Modern e-ticaret platformu");
        siteDesc.setDescription("Site açıklaması");
        siteDesc.setCategory("GENERAL");
        siteDesc.setType("STRING");
        siteDesc.setDefaultValue("Modern e-ticaret platformu");
        siteDesc.setEditable(true);
        createSetting(siteDesc);

        SystemSettings maintenance = new SystemSettings();
        maintenance.setKey("site.maintenance");
        maintenance.setValue("false");
        maintenance.setDescription("Bakım modu");
        maintenance.setCategory("GENERAL");
        maintenance.setType("BOOLEAN");
        maintenance.setDefaultValue("false");
        maintenance.setEditable(true);
        createSetting(maintenance);

        SystemSettings currency = new SystemSettings();
        currency.setKey("site.currency");
        currency.setValue("TRY");
        currency.setDescription("Para birimi");
        currency.setCategory("GENERAL");
        currency.setType("STRING");
        currency.setDefaultValue("TRY");
        currency.setEditable(true);
        createSetting(currency);

        SystemSettings timezone = new SystemSettings();
        timezone.setKey("site.timezone");
        timezone.setValue("Europe/Istanbul");
        timezone.setDescription("Zaman dilimi");
        timezone.setCategory("GENERAL");
        timezone.setType("STRING");
        timezone.setDefaultValue("Europe/Istanbul");
        timezone.setEditable(true);
        createSetting(timezone);

        // Email Ayarları
        SystemSettings emailEnabled = new SystemSettings();
        emailEnabled.setKey("email.enabled");
        emailEnabled.setValue("true");
        emailEnabled.setDescription("Email gönderimi aktif");
        emailEnabled.setCategory("EMAIL");
        emailEnabled.setType("BOOLEAN");
        emailEnabled.setDefaultValue("true");
        emailEnabled.setEditable(true);
        createSetting(emailEnabled);

        SystemSettings emailFromName = new SystemSettings();
        emailFromName.setKey("email.from.name");
        emailFromName.setValue("E-Ticaret Platformu");
        emailFromName.setDescription("Gönderen adı");
        emailFromName.setCategory("EMAIL");
        emailFromName.setType("STRING");
        emailFromName.setDefaultValue("E-Ticaret Platformu");
        emailFromName.setEditable(true);
        createSetting(emailFromName);

        SystemSettings emailFromAddress = new SystemSettings();
        emailFromAddress.setKey("email.from.address");
        emailFromAddress.setValue("noreply@eticaret.com");
        emailFromAddress.setDescription("Gönderen email");
        emailFromAddress.setCategory("EMAIL");
        emailFromAddress.setType("STRING");
        emailFromAddress.setDefaultValue("noreply@eticaret.com");
        emailFromAddress.setEditable(true);
        createSetting(emailFromAddress);

        SystemSettings smtpHost = new SystemSettings();
        smtpHost.setKey("email.smtp.host");
        smtpHost.setValue("smtp.gmail.com");
        smtpHost.setDescription("SMTP sunucu");
        smtpHost.setCategory("EMAIL");
        smtpHost.setType("STRING");
        smtpHost.setDefaultValue("smtp.gmail.com");
        smtpHost.setEditable(true);
        createSetting(smtpHost);

        SystemSettings smtpPort = new SystemSettings();
        smtpPort.setKey("email.smtp.port");
        smtpPort.setValue("587");
        smtpPort.setDescription("SMTP port");
        smtpPort.setCategory("EMAIL");
        smtpPort.setType("NUMBER");
        smtpPort.setDefaultValue("587");
        smtpPort.setEditable(true);
        createSetting(smtpPort);

        // Ödeme Ayarları
        SystemSettings stripeEnabled = new SystemSettings();
        stripeEnabled.setKey("payment.stripe.enabled");
        stripeEnabled.setValue("false");
        stripeEnabled.setDescription("Stripe ödeme aktif");
        stripeEnabled.setCategory("PAYMENT");
        stripeEnabled.setType("BOOLEAN");
        stripeEnabled.setDefaultValue("false");
        stripeEnabled.setEditable(true);
        createSetting(stripeEnabled);

        SystemSettings stripePublicKey = new SystemSettings();
        stripePublicKey.setKey("payment.stripe.public.key");
        stripePublicKey.setValue("");
        stripePublicKey.setDescription("Stripe public key");
        stripePublicKey.setCategory("PAYMENT");
        stripePublicKey.setType("STRING");
        stripePublicKey.setDefaultValue("");
        stripePublicKey.setEditable(true);
        createSetting(stripePublicKey);

        SystemSettings stripeSecretKey = new SystemSettings();
        stripeSecretKey.setKey("payment.stripe.secret.key");
        stripeSecretKey.setValue("");
        stripeSecretKey.setDescription("Stripe secret key");
        stripeSecretKey.setCategory("PAYMENT");
        stripeSecretKey.setType("STRING");
        stripeSecretKey.setDefaultValue("");
        stripeSecretKey.setEditable(true);
        createSetting(stripeSecretKey);

        SystemSettings commissionRate = new SystemSettings();
        commissionRate.setKey("payment.commission.rate");
        commissionRate.setValue("5.0");
        commissionRate.setDescription("Komisyon oranı (%)");
        commissionRate.setCategory("PAYMENT");
        commissionRate.setType("NUMBER");
        commissionRate.setDefaultValue("5.0");
        commissionRate.setEditable(true);
        createSetting(commissionRate);

        // Satıcı Ayarları
        SystemSettings sellerAutoApproval = new SystemSettings();
        sellerAutoApproval.setKey("seller.auto.approval");
        sellerAutoApproval.setValue("false");
        sellerAutoApproval.setDescription("Otomatik satıcı onayı");
        sellerAutoApproval.setCategory("SELLER");
        sellerAutoApproval.setType("BOOLEAN");
        sellerAutoApproval.setDefaultValue("false");
        sellerAutoApproval.setEditable(true);
        createSetting(sellerAutoApproval);

        SystemSettings sellerMinProducts = new SystemSettings();
        sellerMinProducts.setKey("seller.min.products");
        sellerMinProducts.setValue("1");
        sellerMinProducts.setDescription("Minimum ürün sayısı");
        sellerMinProducts.setCategory("SELLER");
        sellerMinProducts.setType("NUMBER");
        sellerMinProducts.setDefaultValue("1");
        sellerMinProducts.setEditable(true);
        createSetting(sellerMinProducts);

        SystemSettings sellerCommissionRate = new SystemSettings();
        sellerCommissionRate.setKey("seller.commission.rate");
        sellerCommissionRate.setValue("10.0");
        sellerCommissionRate.setDescription("Satıcı komisyon oranı (%)");
        sellerCommissionRate.setCategory("SELLER");
        sellerCommissionRate.setType("NUMBER");
        sellerCommissionRate.setDefaultValue("10.0");
        sellerCommissionRate.setEditable(true);
        createSetting(sellerCommissionRate);

        // Ürün Ayarları
        SystemSettings productAutoApproval = new SystemSettings();
        productAutoApproval.setKey("product.auto.approval");
        productAutoApproval.setValue("true");
        productAutoApproval.setDescription("Otomatik ürün onayı");
        productAutoApproval.setCategory("PRODUCT");
        productAutoApproval.setType("BOOLEAN");
        productAutoApproval.setDefaultValue("true");
        productAutoApproval.setEditable(true);
        createSetting(productAutoApproval);

        SystemSettings productMaxImages = new SystemSettings();
        productMaxImages.setKey("product.max.images");
        productMaxImages.setValue("10");
        productMaxImages.setDescription("Maksimum resim sayısı");
        productMaxImages.setCategory("PRODUCT");
        productMaxImages.setType("NUMBER");
        productMaxImages.setDefaultValue("10");
        productMaxImages.setEditable(true);
        createSetting(productMaxImages);

        SystemSettings productMinStock = new SystemSettings();
        productMinStock.setKey("product.min.stock");
        productMinStock.setValue("0");
        productMinStock.setDescription("Minimum stok uyarısı");
        productMinStock.setCategory("PRODUCT");
        productMinStock.setType("NUMBER");
        productMinStock.setDefaultValue("0");
        productMinStock.setEditable(true);
        createSetting(productMinStock);

        // Bildirim Ayarları
        SystemSettings notificationEmail = new SystemSettings();
        notificationEmail.setKey("notification.email.enabled");
        notificationEmail.setValue("true");
        notificationEmail.setDescription("Email bildirimleri aktif");
        notificationEmail.setCategory("NOTIFICATION");
        notificationEmail.setType("BOOLEAN");
        notificationEmail.setDefaultValue("true");
        notificationEmail.setEditable(true);
        createSetting(notificationEmail);

        SystemSettings notificationSms = new SystemSettings();
        notificationSms.setKey("notification.sms.enabled");
        notificationSms.setValue("false");
        notificationSms.setDescription("SMS bildirimleri aktif");
        notificationSms.setCategory("NOTIFICATION");
        notificationSms.setType("BOOLEAN");
        notificationSms.setDefaultValue("false");
        notificationSms.setEditable(true);
        createSetting(notificationSms);

        SystemSettings notificationPush = new SystemSettings();
        notificationPush.setKey("notification.push.enabled");
        notificationPush.setValue("true");
        notificationPush.setDescription("Push bildirimleri aktif");
        notificationPush.setCategory("NOTIFICATION");
        notificationPush.setType("BOOLEAN");
        notificationPush.setDefaultValue("true");
        notificationPush.setEditable(true);
        createSetting(notificationPush);

        // Güvenlik Ayarları
        SystemSettings passwordMinLength = new SystemSettings();
        passwordMinLength.setKey("security.password.min.length");
        passwordMinLength.setValue("8");
        passwordMinLength.setDescription("Minimum şifre uzunluğu");
        passwordMinLength.setCategory("SECURITY");
        passwordMinLength.setType("NUMBER");
        passwordMinLength.setDefaultValue("8");
        passwordMinLength.setEditable(true);
        createSetting(passwordMinLength);

        SystemSettings loginMaxAttempts = new SystemSettings();
        loginMaxAttempts.setKey("security.login.max.attempts");
        loginMaxAttempts.setValue("5");
        loginMaxAttempts.setDescription("Maksimum giriş denemesi");
        loginMaxAttempts.setCategory("SECURITY");
        loginMaxAttempts.setType("NUMBER");
        loginMaxAttempts.setDefaultValue("5");
        loginMaxAttempts.setEditable(true);
        createSetting(loginMaxAttempts);

        SystemSettings sessionTimeout = new SystemSettings();
        sessionTimeout.setKey("security.session.timeout");
        sessionTimeout.setValue("3600");
        sessionTimeout.setDescription("Oturum zaman aşımı (saniye)");
        sessionTimeout.setCategory("SECURITY");
        sessionTimeout.setType("NUMBER");
        sessionTimeout.setDefaultValue("3600");
        sessionTimeout.setEditable(true);
        createSetting(sessionTimeout);

        System.out.println("Varsayılan sistem ayarları oluşturuldu");
    }
}
