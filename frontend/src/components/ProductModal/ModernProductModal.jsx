import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Image, 
  Loader2, 
  Package, 
  DollarSign, 
  Tag, 
  Hash, 
  FileText,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const ModernProductModal = ({ 
  show, 
  onClose, 
  onSave, 
  categories = [], 
  initial = null, 
  loading = false 
}) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    categoryId: '',
    imageUrl: '',
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    description: '',
    stock: '',
    status: 'AKTİF',
    isDiscountActive: false,
    discountPercentage: 0
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);

  const steps = [
    { id: 1, title: 'Temel Bilgiler', icon: Package },
    { id: 2, title: 'Resimler', icon: Image },
    { id: 3, title: 'Detaylar', icon: FileText }
  ];

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || '',
        price: initial.price || '',
        categoryId: initial.categoryId || initial.category?.id || '',
        imageUrl: initial.imageUrl || '',
        imageUrl1: initial.imageUrl1 || '',
        imageUrl2: initial.imageUrl2 || '',
        imageUrl3: initial.imageUrl3 || '',
        description: initial.description || '',
        stock: initial.stock || '',
        status: initial.status || 'AKTİF',
        isDiscountActive: initial.isDiscountActive || false,
        discountPercentage: initial.discountPercentage || 0
      });
      setImagePreview(initial.imageUrl || initial.imageUrl1 || '');
    } else {
      setForm({
        name: '',
        price: '',
        categoryId: '',
        imageUrl: '',
        imageUrl1: '',
        imageUrl2: '',
        imageUrl3: '',
        description: '',
        stock: '',
        status: 'AKTİF',
        isDiscountActive: false,
        discountPercentage: 0
      });
      setImagePreview('');
    }
    setErrors({});
    setCurrentStep(1);
  }, [initial, show]);

  useEffect(() => {
    setImagePreview(form.imageUrl || form.imageUrl1);
  }, [form.imageUrl, form.imageUrl1]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!form.name.trim()) {
        newErrors.name = 'Ürün adı gereklidir';
      }
      if (!form.price || form.price <= 0) {
        newErrors.price = 'Geçerli bir fiyat giriniz';
      }
      if (!form.categoryId) {
        newErrors.categoryId = 'Kategori seçiniz';
      }
      if (!form.stock || form.stock < 0) {
        newErrors.stock = 'Geçerli bir stok miktarı giriniz';
      }
    }
    
    if (step === 2) {
      if (!form.imageUrl && !form.imageUrl1) {
        newErrors.imageUrl = 'En az bir resim URL\'si gereklidir';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        handleNext();
      } else {
        onSave(form);
      }
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Ürün Adı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-orange-500" />
                  <span>Ürün Adı *</span>
                </div>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Örn: iPhone 15 Pro Max"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={loading}
              />
              {errors.name && (
                <div className="flex items-center space-x-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Fiyat ve Kategori */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>Fiyat (₺) *</span>
                  </div>
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={loading}
                />
                {errors.price && (
                  <div className="flex items-center space-x-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.price}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-blue-500" />
                    <span>Kategori *</span>
                  </div>
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    errors.categoryId ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={loading}
                >
                  <option value="">Kategori seçin</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && (
                  <div className="flex items-center space-x-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.categoryId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stok ve Durum */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-purple-500" />
                    <span>Stok Miktarı *</span>
                  </div>
                </label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    errors.stock ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={loading}
                />
                {errors.stock && (
                  <div className="flex items-center space-x-1 text-red-500 text-sm mt-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.stock}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Durum</span>
                  </div>
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-gray-400"
                  disabled={loading}
                >
                  <option value="AKTİF">Aktif</option>
                  <option value="PASİF">Pasif</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Ana Resim */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Image className="w-4 h-4 text-orange-500" />
                  <span>Ana Resim URL *</span>
                </div>
              </label>
              <input
                name="imageUrl1"
                value={form.imageUrl1}
                onChange={handleChange}
                placeholder="https://example.com/main-image.jpg"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                  errors.imageUrl ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                disabled={loading}
              />
              {errors.imageUrl && (
                <div className="flex items-center space-x-1 text-red-500 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.imageUrl}</span>
                </div>
              )}
            </div>

            {/* Ek Resimler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resim 2 URL
                </label>
                <input
                  name="imageUrl2"
                  value={form.imageUrl2}
                  onChange={handleChange}
                  placeholder="https://example.com/image2.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-gray-400"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resim 3 URL
                </label>
                <input
                  name="imageUrl3"
                  value={form.imageUrl3}
                  onChange={handleChange}
                  placeholder="https://example.com/image3.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Resim Önizleme */}
            {imagePreview && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Resim Önizleme
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700"
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{showPreview ? 'Gizle' : 'Göster'}</span>
                  </button>
                </div>
                {showPreview && (
                  <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                    <img 
                      src={imagePreview} 
                      alt="Ürün resmi" 
                      className="max-w-full h-32 object-contain mx-auto rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="text-center text-gray-500 py-8 hidden">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                      Resim yüklenemedi
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Ürün Açıklaması</span>
                </div>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Ürün hakkında detaylı bilgi..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all hover:border-gray-400"
                disabled={loading}
              />
            </div>

            {/* İndirim Ayarları */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">İndirim Ayarları</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isDiscountActive"
                    checked={form.isDiscountActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    disabled={loading}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    İndirim aktif
                  </label>
                </div>
                
                {form.isDiscountActive && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İndirim Yüzdesi (%)
                    </label>
                    <input
                      name="discountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      value={form.discountPercentage}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all hover:border-gray-400"
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                {initial ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h3>
              <p className="text-orange-100 mt-1">
                {initial ? 'Ürün bilgilerini güncelleyin' : 'Mağazanıza yeni ürün ekleyin'}
              </p>
            </div>
            <button 
              onClick={handleClose} 
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive ? 'bg-orange-100 text-orange-700' :
                    isCompleted ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
            <button 
              type="button" 
              onClick={handlePrev}
              disabled={currentStep === 1 || loading}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Önceki
            </button>
            
            <div className="flex items-center space-x-3">
              <button 
                type="button" 
                onClick={handleClose} 
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium disabled:opacity-50"
                disabled={loading}
              >
                İptal
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all font-medium disabled:opacity-50 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    {currentStep === 3 ? (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{initial ? 'Güncelle' : 'Kaydet'}</span>
                      </>
                    ) : (
                      <>
                        <span>İleri</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModernProductModal;
