-- Mevcut satıcılar için başvuru tarihlerini güncelle
DO $$ 
BEGIN
    -- seller_application_date boş olan satıcılar için registration_date'i kullan
    UPDATE users 
    SET seller_application_date = registration_date 
    WHERE seller_application_date IS NULL 
    AND seller_status IS NOT NULL;
    
    -- approved_by_admin_id boş olan onaylanmış satıcılar için varsayılan admin ID'si ata
    -- (Bu kısım opsiyonel, eğer admin ID'si yoksa NULL kalabilir)
    -- UPDATE users 
    -- SET approved_by_admin_id = (SELECT id FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'ADMIN') LIMIT 1)
    -- WHERE approved_by_admin_id IS NULL 
    -- AND seller_status IN ('APPROVED', 'ACTIVE');
END $$;
