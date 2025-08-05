-- Stores tablosunu güncelleme - yeni alanlar ekleme
ALTER TABLE stores 
ADD COLUMN description TEXT,
ADD COLUMN address VARCHAR(500),
ADD COLUMN phone VARCHAR(20),
ADD COLUMN email VARCHAR(100),
ADD COLUMN website VARCHAR(200),
ADD COLUMN working_hours VARCHAR(200),
ADD COLUMN logo_url VARCHAR(500),
ADD COLUMN banner_url VARCHAR(500),
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Mevcut mağazalar için örnek veriler (opsiyonel)
UPDATE stores SET 
description = 'Kaliteli ürünler ve uygun fiyatlarla hizmetinizdeyiz.',
address = 'İstanbul, Türkiye',
phone = '+90 212 555 0123',
email = 'info@magaza.com',
website = 'https://www.magaza.com',
working_hours = 'Pazartesi-Cuma 09:00-18:00, Cumartesi 10:00-16:00',
logo_url = '/api/images/store/default-logo.png',
banner_url = '/api/images/store/default-banner.png'
WHERE description IS NULL; 