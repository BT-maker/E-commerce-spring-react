import React, { useState, useEffect } from "react";
import { X, Save, Image, Loader2, AlertCircle } from "lucide-react";

const EditProductModal = ({ show, onClose, onSave, categories, product, loading = false }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    imageUrl1: "",
    imageUrl2: "",
    imageUrl3: "",
    description: "",
    stock: "",
    status: "AKTİF"
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        categoryId: product.categoryId || product.category?.id || "",
        imageUrl: product.imageUrl || "",
        imageUrl1: product.imageUrl1 || "",
        imageUrl2: product.imageUrl2 || "",
        imageUrl3: product.imageUrl3 || "",
        description: product.description || "",
        stock: product.stock || "",
        status: product.status || "AKTİF"
      });
      setImagePreview(product.imageUrl1 || product.imageUrl || "");
    } else {
      setForm({ 
        name: "", 
        price: "", 
        categoryId: "", 
        imageUrl: "", 
        imageUrl1: "",
        imageUrl2: "",
        imageUrl3: "",
        description: "", 
        stock: "",
        status: "AKTİF"
      });
      setImagePreview("");
    }
    setErrors({});
  }, [product, show]);

  useEffect(() => {
    setImagePreview(form.imageUrl1 || form.imageUrl);
  }, [form.imageUrl1, form.imageUrl]);

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

    if (!form.price || parseFloat(form.price) <= 0) {
      newErrors.price = "Geçerli bir fiyat giriniz";
    }

    if (!form.categoryId) {
      newErrors.categoryId = "Kategori seçiniz";
    }

    if (!form.stock || parseInt(form.stock) < 0) {
      newErrors.stock = "Geçerli bir stok miktarı giriniz";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock)
    };

    onSave(productData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Save className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ürün Düzenle</h2>
              <p className="text-gray-600">Ürün bilgilerini güncelleyin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sol Kolon */}
            <div className="space-y-6">
              {/* Ürün Adı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ürün adını giriniz"
                />
                {errors.name && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Fiyat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat (₺) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.price}</span>
                  </div>
                )}
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Kategori seçiniz</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.categoryId}</span>
                  </div>
                )}
              </div>

              {/* Stok */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok Miktarı *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.stock ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.stock}</span>
                  </div>
                )}
              </div>

              {/* Durum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="AKTİF">Aktif</option>
                  <option value="PASİF">Pasif</option>
                </select>
              </div>
            </div>

            {/* Sağ Kolon */}
            <div className="space-y-6">
              {/* Ana Resim */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ana Resim URL
                </label>
                <input
                  type="url"
                  name="imageUrl1"
                  value={form.imageUrl1}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Ek Resimler */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ek Resim URL'leri
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    name="imageUrl2"
                    value={form.imageUrl2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Resim 2 URL"
                  />
                  <input
                    type="url"
                    name="imageUrl3"
                    value={form.imageUrl3}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Resim 3 URL"
                  />
                </div>
              </div>

              {/* Resim Önizleme */}
              {imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resim Önizleme
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Önizleme"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  placeholder="Ürün açıklamasını giriniz"
                />
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Güncelle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
