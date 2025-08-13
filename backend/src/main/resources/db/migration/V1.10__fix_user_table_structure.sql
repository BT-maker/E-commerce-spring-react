-- Veritabanı yapısını düzelt
-- Eğer first_name kolonu yoksa ekle
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'first_name') THEN
        ALTER TABLE users ADD COLUMN first_name VARCHAR(255);
    END IF;
END $$;

-- Eğer last_name kolonu yoksa ekle
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_name') THEN
        ALTER TABLE users ADD COLUMN last_name VARCHAR(255);
    END IF;
END $$;

-- Eğer address1 kolonu yoksa ekle
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'address1') THEN
        ALTER TABLE users ADD COLUMN address1 VARCHAR(255);
    END IF;
END $$;

-- Eğer address2 kolonu yoksa ekle
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'address2') THEN
        ALTER TABLE users ADD COLUMN address2 VARCHAR(255);
    END IF;
END $$;

-- Null değerleri düzelt
UPDATE users SET first_name = 'Belirtilmemiş' WHERE first_name IS NULL;
UPDATE users SET last_name = 'Belirtilmemiş' WHERE last_name IS NULL;

-- Kolonları zorunlu yap
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
