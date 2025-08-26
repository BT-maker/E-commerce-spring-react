-- Kategorilere öncelik alanı ekleme
ALTER TABLE categories ADD COLUMN priority INT NOT NULL DEFAULT 0;

-- Öncelik sıralaması için indeks oluşturma
CREATE INDEX idx_categories_priority ON categories(priority DESC, name ASC);

-- Mevcut kategorilere öncelik değerleri atama
UPDATE categories SET priority = 5 WHERE name = 'Elektronik';
UPDATE categories SET priority = 4 WHERE name = 'Giyim';
UPDATE categories SET priority = 3 WHERE name = 'Ev & Yaşam';
UPDATE categories SET priority = 2 WHERE name = 'Spor & Outdoor';
UPDATE categories SET priority = 1 WHERE name = 'Kitap';
