import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaImage, FaSpinner } from "react-icons/fa";
import "./ProductModal.css";

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

  const getInputClassName = (fieldName) => {
    const baseClass = fieldName === 'description' ? 'form-textarea' : 
                     fieldName === 'categoryId' ? 'form-select' : 'form-input';
    return `${baseClass} ${errors[fieldName] ? 'error' : ''}`;
  };

  return (
    <div className="product-modal-overlay" onClick={handleClose}>
      <div className="product-modal" onClick={e => e.stopPropagation()}>
        <div className="product-modal-header">
          <h3 className="product-modal-title">
            {initial ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
          </h3>
          <button 
            onClick={handleClose} 
            className="product-modal-close"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-modal-form">
          {/* Ürün Adı */}
          <div className="form-group">
            <label className="form-label">Ürün Adı *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Örn: iPhone 15 Pro"
              className={getInputClassName('name')}
              disabled={loading}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          {/* Fiyat ve Kategori */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fiyat (₺) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className={getInputClassName('price')}
                disabled={loading}
              />
              {errors.price && <div className="error-message">{errors.price}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Kategori *</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className={getInputClassName('categoryId')}
                disabled={loading}
              >
                <option value="">Kategori seçin</option>
                {Array.isArray(categories) && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <div className="error-message">{errors.categoryId}</div>}
            </div>
          </div>

          {/* Stok */}
          <div className="form-group">
            <label className="form-label">Stok Miktarı *</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              className={getInputClassName('stock')}
              disabled={loading}
            />
            {errors.stock && <div className="error-message">{errors.stock}</div>}
          </div>

          {/* Resim URL */}
          <div className="form-group">
            <label className="form-label">
              <FaImage style={{ marginRight: '0.5rem' }} />
              Resim URL
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={getInputClassName('imageUrl')}
              disabled={loading}
            />
          </div>

          {/* Resim Önizleme - Sadece yeni ürün ekleme sırasında göster */}
          {!initial && imagePreview && (
            <div className="form-group">
              <label className="form-label">Resim Önizleme</label>
              <div className="image-preview">
                <img 
                  src={imagePreview} 
                  alt="Ürün resmi" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="image-preview-placeholder" style={{ display: 'none' }}>
                  Resim yüklenemedi
                </div>
              </div>
            </div>
          )}

          {/* Açıklama */}
          <div className="form-group">
            <label className="form-label">Ürün Açıklaması</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ürün hakkında detaylı bilgi..."
              className={getInputClassName('description')}
              disabled={loading}
            />
          </div>

          {/* Butonlar */}
          <div className="product-modal-actions">
            <button 
              type="button" 
              onClick={handleClose} 
              className="btn btn-secondary"
              disabled={loading}
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <FaSave />
                  {initial ? "Güncelle" : "Kaydet"}
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