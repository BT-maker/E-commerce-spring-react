import React, { useState, useEffect } from "react";
import { X, Save, Image, Loader2 } from "lucide-react";

const ProductModal = ({ show, onClose, onSave, categories, initial, loading = false }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    description: "",
    stock: ""
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

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
      setImagePreview(initial.imageUrl || "");
    } else {
      setForm({ name: "", price: "", categoryId: "", imageUrl: "", description: "", stock: "" });
      setImagePreview("");
    }
    setErrors({});
  }, [initial, show]);

  useEffect(() => {
    setImagePreview(form.imageUrl);
  }, [form.imageUrl]);

  if (!show) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Ürün adı gereklidir";
    }
    
    if (!form.price || form.price <= 0) {
      newErrors.price = "Geçerli bir fiyat giriniz";
    }
    
    if (!form.categoryId) {
      newErrors.categoryId = "Kategori seçiniz";
    }
    
    if (!form.stock || form.stock < 0) {
      newErrors.stock = "Geçerli bir stok miktarı giriniz";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(form);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {initial ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </h3>
          <button 
            onClick={handleClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Ürün Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Adı *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Örn: iPhone 15 Pro"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
          </div>

          {/* Fiyat ve Kategori */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat (₺) *
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori *
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.categoryId ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Kategori seçin</option>
                {Array.isArray(categories) && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <div className="text-red-500 text-sm mt-1">{errors.categoryId}</div>}
            </div>
          </div>

          {/* Stok */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stok Miktarı *
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.stock && <div className="text-red-500 text-sm mt-1">{errors.stock}</div>}
          </div>

          {/* Resim URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Image className="w-4 h-4" />
                <span>Resim URL</span>
              </div>
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Resim Önizleme - Sadece yeni ürün ekleme sırasında göster */}
          {!initial && imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resim Önizleme
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <img 
                  src={imagePreview} 
                  alt="Ürün resmi" 
                  className="max-w-full h-32 object-contain mx-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="text-center text-gray-500 py-8" style={{ display: 'none' }}>
                  Resim yüklenemedi
                </div>
              </div>
            </div>
          )}

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Açıklaması
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ürün hakkında detaylı bilgi..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>

          {/* Butonlar */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button 
              type="button" 
              onClick={handleClose} 
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50"
              disabled={loading}
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{initial ? "Güncelle" : "Kaydet"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal; 