import React, { useState, useEffect } from "react";

const ProductModal = ({ show, onClose, onSave, categories, initial }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    description: "",
    stock: ""
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        price: initial.price || "",
        categoryId: initial.categoryId || initial.category?.id || "",
        imageUrl: initial.imageUrl || "",
        description: initial.description || "",
        stock: initial.stock || ""
      });
    } else {
      setForm({ name: "", price: "", categoryId: "", imageUrl: "", description: "", stock: "" });
    }
  }, [initial, show]);

  if (!show) return null;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
        <h3 className="text-xl font-bold mb-4">{initial ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ürün adı"
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Fiyat"
            className="border rounded px-3 py-2"
            required
          />
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Kategori seç</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Resim URL"
            className="border rounded px-3 py-2"
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Açıklama"
            className="border rounded px-3 py-2"
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stok"
            className="border rounded px-3 py-2"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-semibold mt-2">
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Ürün Modal: Ürün ekleme/düzenleme için popup modal
 * 2. Form Yönetimi: Ürün bilgilerini form formatında toplama
 * 3. Kategori Seçimi: Ürün kategorisi seçme dropdown'u
 * 4. Form Validation: Gerekli alanların doğrulaması
 * 5. Edit Mode: Mevcut ürün bilgilerini düzenleme
 * 6. Add Mode: Yeni ürün oluşturma
 * 7. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde admin kullanıcıları ürün ekleme ve düzenleme işlemlerini kolayca yapabilir!
 */ 