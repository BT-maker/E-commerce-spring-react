-- products tablosuna 5 adet resim URL kolonu ekleme
-- Her ürün için maksimum 5 resim eklenebilir

-- 1. Ana ürün resmi (mevcut image_url kolonu varsa güncelleme)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS image_url_1 TEXT;

-- 2. İkinci ürün resmi
ALTER TABLE products 
ADD COLUMN image_url_2 TEXT;

-- 3. Üçüncü ürün resmi
ALTER TABLE products 
ADD COLUMN image_url_3 TEXT;

-- 4. Dördüncü ürün resmi
ALTER TABLE products 
ADD COLUMN image_url_4 TEXT;

-- 5. Beşinci ürün resmi
ALTER TABLE products 
ADD COLUMN image_url_5 TEXT;

-- Mevcut image_url kolonundaki verileri image_url_1'e taşıma (eğer varsa)
UPDATE products 
SET image_url_1 = image_url 
WHERE image_url IS NOT NULL AND image_url_1 IS NULL;

-- Kolonların açıklamalarını ekleme
COMMENT ON COLUMN products.image_url_1 IS 'Ana ürün resmi URL';
COMMENT ON COLUMN products.image_url_2 IS 'İkinci ürün resmi URL';
COMMENT ON COLUMN products.image_url_3 IS 'Üçüncü ürün resmi URL';
COMMENT ON COLUMN products.image_url_4 IS 'Dördüncü ürün resmi URL';
COMMENT ON COLUMN products.image_url_5 IS 'Beşinci ürün resmi URL';

-- Değişiklikleri kaydetme
COMMIT;

-- Tablo yapısını kontrol etme
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name LIKE 'image_url%'
ORDER BY column_name;
