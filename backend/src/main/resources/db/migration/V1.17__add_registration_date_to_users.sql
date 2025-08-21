-- Users tablosuna kayıt tarihi kolonu ekle
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'registration_date') THEN
        ALTER TABLE users ADD COLUMN registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Mevcut kayıtlar için varsayılan tarih ata (eğer NULL ise)
UPDATE users SET registration_date = CURRENT_TIMESTAMP WHERE registration_date IS NULL;

-- Kolonu zorunlu yap
ALTER TABLE users ALTER COLUMN registration_date SET NOT NULL;

-- İndeks ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_users_registration_date ON users(registration_date);
