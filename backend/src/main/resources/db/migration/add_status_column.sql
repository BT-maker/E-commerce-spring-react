-- Products tablosuna status kolonu ekleme
-- Bu dosyayı veritabanında çalıştırın

-- Önce kolonun var olup olmadığını kontrol et
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'status'
    ) THEN
        -- Kolon yoksa ekle
        ALTER TABLE products ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'AKTİF';
        
        -- Mevcut ürünleri aktif olarak işaretle
        UPDATE products SET status = 'AKTİF' WHERE status IS NULL;
        
        RAISE NOTICE 'Status kolonu başarıyla eklendi ve tüm ürünler AKTİF olarak işaretlendi.';
    ELSE
        RAISE NOTICE 'Status kolonu zaten mevcut.';
    END IF;
END $$;