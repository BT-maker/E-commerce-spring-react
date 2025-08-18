-- Store tablosundaki logo_url ve banner_url alanlarını TEXT tipine çevir
-- Bu sayede uzun resim URL'leri sorunsuz saklanabilir

ALTER TABLE stores 
ALTER COLUMN logo_url TYPE TEXT;

ALTER TABLE stores 
ALTER COLUMN banner_url TYPE TEXT;
