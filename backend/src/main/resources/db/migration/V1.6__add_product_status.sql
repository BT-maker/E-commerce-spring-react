-- V1.6__add_product_status.sql
-- Products tablosuna status kolonu ekleme

ALTER TABLE products ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'AKTİF';

-- Mevcut ürünleri aktif olarak işaretle
UPDATE products SET status = 'AKTİF' WHERE status IS NULL;