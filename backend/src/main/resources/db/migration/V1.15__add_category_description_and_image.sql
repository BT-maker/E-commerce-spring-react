-- Category tablosuna description ve imageUrl alanlarını ekle
ALTER TABLE categories ADD COLUMN description TEXT;
ALTER TABLE categories ADD COLUMN image_url TEXT;
