-- Satıcı onay sistemi için gerekli kolonları ekle
DO $$ 
BEGIN
    -- Satıcı durumu kolonu (PENDING, APPROVED, REJECTED, ACTIVE, INACTIVE)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'seller_status') THEN
        ALTER TABLE users ADD COLUMN seller_status VARCHAR(20) DEFAULT 'PENDING';
    END IF;
    
    -- Onay tarihi kolonu
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'approval_date') THEN
        ALTER TABLE users ADD COLUMN approval_date TIMESTAMP NULL;
    END IF;
    
    -- Onaylayan admin ID kolonu
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'approved_by') THEN
        ALTER TABLE users ADD COLUMN approved_by BIGINT NULL;
    END IF;
    
    -- Red sebebi kolonu
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'rejection_reason') THEN
        ALTER TABLE users ADD COLUMN rejection_reason TEXT NULL;
    END IF;
    
    -- Satıcı başvuru tarihi kolonu
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'seller_application_date') THEN
        ALTER TABLE users ADD COLUMN seller_application_date TIMESTAMP NULL;
    END IF;
END $$;

-- Mevcut satıcılar için varsayılan değerler ata
UPDATE users 
SET seller_status = 'APPROVED', 
    seller_application_date = registration_date,
    approval_date = registration_date
WHERE role_id = (SELECT id FROM roles WHERE name = 'SELLER') 
AND seller_status IS NULL;

-- İndeksler ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_users_seller_status ON users(seller_status);
CREATE INDEX IF NOT EXISTS idx_users_seller_application_date ON users(seller_application_date);
CREATE INDEX IF NOT EXISTS idx_users_approved_by ON users(approved_by);
