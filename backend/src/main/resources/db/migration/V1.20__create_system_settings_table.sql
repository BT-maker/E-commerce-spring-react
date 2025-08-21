-- Sistem ayarları tablosunu oluştur
CREATE TABLE IF NOT EXISTS system_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    default_value TEXT,
    editable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by_id VARCHAR(255),
    FOREIGN KEY (updated_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- İndeksler ekle
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_editable ON system_settings(editable);

-- Varsayılan sistem ayarlarını ekle
INSERT INTO system_settings (setting_key, setting_value, description, category, type, default_value, editable) VALUES
-- Genel Ayarlar
('site.name', 'E-Ticaret Platformu', 'Site adı', 'GENERAL', 'STRING', 'E-Ticaret Platformu', true),
('site.description', 'Modern e-ticaret platformu', 'Site açıklaması', 'GENERAL', 'STRING', 'Modern e-ticaret platformu', true),
('site.maintenance', 'false', 'Bakım modu', 'GENERAL', 'BOOLEAN', 'false', true),
('site.currency', 'TRY', 'Para birimi', 'GENERAL', 'STRING', 'TRY', true),
('site.timezone', 'Europe/Istanbul', 'Zaman dilimi', 'GENERAL', 'STRING', 'Europe/Istanbul', true),

-- Email Ayarları
('email.enabled', 'true', 'Email gönderimi aktif', 'EMAIL', 'BOOLEAN', 'true', true),
('email.from.name', 'E-Ticaret Platformu', 'Gönderen adı', 'EMAIL', 'STRING', 'E-Ticaret Platformu', true),
('email.from.address', 'noreply@eticaret.com', 'Gönderen email', 'EMAIL', 'STRING', 'noreply@eticaret.com', true),
('email.smtp.host', 'smtp.gmail.com', 'SMTP sunucu', 'EMAIL', 'STRING', 'smtp.gmail.com', true),
('email.smtp.port', '587', 'SMTP port', 'EMAIL', 'NUMBER', '587', true),

-- Ödeme Ayarları
('payment.stripe.enabled', 'false', 'Stripe ödeme aktif', 'PAYMENT', 'BOOLEAN', 'false', true),
('payment.stripe.public.key', '', 'Stripe public key', 'PAYMENT', 'STRING', '', true),
('payment.stripe.secret.key', '', 'Stripe secret key', 'PAYMENT', 'STRING', '', true),
('payment.commission.rate', '5.0', 'Komisyon oranı (%)', 'PAYMENT', 'NUMBER', '5.0', true),

-- Satıcı Ayarları
('seller.auto.approval', 'false', 'Otomatik satıcı onayı', 'SELLER', 'BOOLEAN', 'false', true),
('seller.min.products', '1', 'Minimum ürün sayısı', 'SELLER', 'NUMBER', '1', true),
('seller.commission.rate', '10.0', 'Satıcı komisyon oranı (%)', 'SELLER', 'NUMBER', '10.0', true),

-- Ürün Ayarları
('product.auto.approval', 'true', 'Otomatik ürün onayı', 'PRODUCT', 'BOOLEAN', 'true', true),
('product.max.images', '10', 'Maksimum resim sayısı', 'PRODUCT', 'NUMBER', '10', true),
('product.min.stock', '0', 'Minimum stok uyarısı', 'PRODUCT', 'NUMBER', '0', true),

-- Bildirim Ayarları
('notification.email.enabled', 'true', 'Email bildirimleri aktif', 'NOTIFICATION', 'BOOLEAN', 'true', true),
('notification.sms.enabled', 'false', 'SMS bildirimleri aktif', 'NOTIFICATION', 'BOOLEAN', 'false', true),
('notification.push.enabled', 'true', 'Push bildirimleri aktif', 'NOTIFICATION', 'BOOLEAN', 'true', true),

-- Güvenlik Ayarları
('security.password.min.length', '8', 'Minimum şifre uzunluğu', 'SECURITY', 'NUMBER', '8', true),
('security.login.max.attempts', '5', 'Maksimum giriş denemesi', 'SECURITY', 'NUMBER', '5', true),
('security.session.timeout', '3600', 'Oturum zaman aşımı (saniye)', 'SECURITY', 'NUMBER', '3600', true)

ON CONFLICT (setting_key) DO NOTHING;
