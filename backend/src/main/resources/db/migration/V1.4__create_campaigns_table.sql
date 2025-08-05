-- Campaigns tablosu oluşturma
CREATE TABLE campaigns (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50) NOT NULL, -- 'product' veya 'category'
    target_id VARCHAR(36) NOT NULL, -- Product ID veya Category ID
    discount_type VARCHAR(50) NOT NULL, -- 'percentage' veya 'fixed'
    discount_value DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    store_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_campaigns_store (store_id),
    INDEX idx_campaigns_type (campaign_type),
    INDEX idx_campaigns_target (target_id),
    INDEX idx_campaigns_active (is_active),
    INDEX idx_campaigns_dates (start_date, end_date)
);

-- Kampanya örnekleri (opsiyonel)
INSERT INTO campaigns (id, name, description, campaign_type, target_id, discount_type, discount_value, start_date, end_date, is_active, store_id, created_at, updated_at) VALUES
('camp-001', 'Yaz Sezonu İndirimi', 'Tüm yaz ürünlerinde %20 indirim', 'category', 'cat-001', 'percentage', 20.00, '2024-06-01 00:00:00', '2024-08-31 23:59:59', true, 'store-001', NOW(), NOW()),
('camp-002', 'Elektronik Fırsatı', 'Seçili elektronik ürünlerde 100₺ indirim', 'product', 'prod-001', 'fixed', 100.00, '2024-07-01 00:00:00', '2024-07-31 23:59:59', true, 'store-001', NOW(), NOW()),
('camp-003', 'Kış Hazırlığı', 'Kış ürünlerinde %15 indirim', 'category', 'cat-002', 'percentage', 15.00, '2024-09-01 00:00:00', '2024-11-30 23:59:59', false, 'store-001', NOW(), NOW()); 