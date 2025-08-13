-- Eski adres kolonlarını sil (address1 ve address2 kolonları zaten oluşturuldu)
-- Bu migration sadece eski kolonları temizler

-- Eğer address kolonu hala varsa sil
ALTER TABLE users DROP COLUMN IF EXISTS address;

-- Eğer adress kolonu hala varsa sil (yazım hatası ile)
ALTER TABLE users DROP COLUMN IF EXISTS adress;
