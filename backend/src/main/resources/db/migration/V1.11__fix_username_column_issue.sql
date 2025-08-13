-- Username kolonu sorununu çöz
-- Eğer username kolonu hala varsa ve NOT NULL ise, önce NULL yapılabilir hale getir

-- 1. Username kolonunu NULL yapılabilir hale getir
ALTER TABLE users ALTER COLUMN username DROP NOT NULL;

-- 2. Mevcut username verilerini temizle (eğer varsa)
UPDATE users SET username = NULL WHERE username IS NOT NULL;

-- 3. Username kolonunu kaldır
ALTER TABLE users DROP COLUMN IF EXISTS username;

-- 4. first_name ve last_name kolonlarının NOT NULL olduğundan emin ol
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;

-- 5. Eğer address1 ve address2 kolonları yoksa ekle
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'address1') THEN
        ALTER TABLE users ADD COLUMN address1 VARCHAR(255);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'address2') THEN
        ALTER TABLE users ADD COLUMN address2 VARCHAR(255);
    END IF;
END $$;
