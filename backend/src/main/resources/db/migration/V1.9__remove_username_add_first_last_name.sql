-- Username kolonunu kaldır ve first_name, last_name kolonlarını ekle
-- Önce mevcut username verilerini first_name'e kopyala
UPDATE users SET first_name = username WHERE first_name IS NULL;

-- last_name kolonu için varsayılan değer ata (eğer null ise)
UPDATE users SET last_name = 'Belirtilmemiş' WHERE last_name IS NULL;

-- Username kolonunu kaldır
ALTER TABLE users DROP COLUMN IF EXISTS username;

-- first_name ve last_name kolonlarını zorunlu yap
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
