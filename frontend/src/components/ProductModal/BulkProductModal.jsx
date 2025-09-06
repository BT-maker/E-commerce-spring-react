import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Loader2, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Copy,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const BulkProductModal = ({ 
  show, 
  onClose, 
  onSave, 
  categories = [], 
  loading = false 
}) => {
  const [jsonData, setJsonData] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isValidJson, setIsValidJson] = useState(false);

  useEffect(() => {
    if (show) {
      setJsonData('');
      setPreviewData([]);
      setShowPreview(false);
      setErrors([]);
      setIsValidJson(false);
    }
  }, [show]);

  const validateJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        setErrors(['JSON bir array olmalıdır']);
        setIsValidJson(false);
        return null;
      }
      
      const validationErrors = [];
      parsed.forEach((item, index) => {
        if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
          validationErrors.push(`Satır ${index + 1}: Ürün adı gereklidir`);
        }
        if (!item.price || isNaN(parseFloat(item.price))) {
          validationErrors.push(`Satır ${index + 1}: Geçerli bir fiyat gereklidir`);
        }
        if (!item.categoryName || typeof item.categoryName !== 'string' || item.categoryName.trim() === '') {
          validationErrors.push(`Satır ${index + 1}: Geçerli bir kategori adı gereklidir`);
        }
      });
      
      setErrors(validationErrors);
      setIsValidJson(validationErrors.length === 0);
      return validationErrors.length === 0 ? parsed : null;
    } catch (error) {
      setErrors(['Geçersiz JSON formatı: ' + error.message]);
      setIsValidJson(false);
      return null;
    }
  };

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setJsonData(value);
    
    if (value.trim()) {
      const validated = validateJson(value);
      if (validated) {
        setPreviewData(validated);
      } else {
        setPreviewData([]);
      }
    } else {
      setPreviewData([]);
      setErrors([]);
      setIsValidJson(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValidJson || previewData.length === 0) {
      return;
    }
    
    onSave(previewData);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const generateSampleJson = () => {
    const sample = [
      {
        "name": "Örnek Ürün 1",
        "description": "Bu bir örnek ürün açıklamasıdır",
        "price": 99.99,
        "stock": 50,
        "categoryName": categories.length > 0 ? categories[0].name : "Ev & Yaşam",
        "status": "AKTİF",
        "imageUrl1": "https://example.com/image1.jpg",
        "imageUrl2": "https://example.com/image2.jpg",
        "imageUrl3": "https://example.com/image3.jpg",
        "isDiscountActive": false,
        "discountPercentage": 0
      },
      {
        "name": "Örnek Ürün 2",
        "description": "İkinci örnek ürün",
        "price": 149.50,
        "stock": 25,
        "categoryName": categories.length > 1 ? categories[1].name : "Elektronik",
        "status": "AKTİF",
        "imageUrl1": "https://example.com/image4.jpg",
        "isDiscountActive": true,
        "discountPercentage": 15
      }
    ];
    
    setJsonData(JSON.stringify(sample, null, 2));
    const validated = validateJson(JSON.stringify(sample, null, 2));
    if (validated) {
      setPreviewData(validated);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonData);
  };

  const clearData = () => {
    setJsonData('');
    setPreviewData([]);
    setErrors([]);
    setIsValidJson(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Toplu Ürün Ekleme</h3>
              <p className="text-orange-100 mt-1">JSON formatında ürün listesi yükleyin</p>
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

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sol Panel - JSON Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">JSON Verisi</h4>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={generateSampleJson}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Örnek</span>
                  </button>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
                    disabled={!jsonData}
                  >
                    <Copy className="w-4 h-4" />
                    <span>Kopyala</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearData}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
                    disabled={!jsonData}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Temizle</span>
                  </button>
                </div>
              </div>
              
              <textarea
                value={jsonData}
                onChange={handleJsonChange}
                placeholder="JSON formatında ürün listesi yapıştırın..."
                className="w-full h-80 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none font-mono text-sm"
                disabled={loading}
              />
              
              {/* Validation Status */}
              <div className="flex items-center space-x-2">
                {isValidJson ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Geçerli JSON - {previewData.length} ürün</span>
                  </div>
                ) : errors.length > 0 ? (
                  <div className="flex items-center space-x-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{errors.length} hata bulundu</span>
                  </div>
                ) : null}
              </div>
              
              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-red-800 mb-2">Hatalar:</h5>
                  <ul className="text-sm text-red-700 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sağ Panel - Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Önizleme</h4>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-1 text-sm text-orange-600 hover:text-orange-700"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showPreview ? 'Gizle' : 'Göster'}</span>
                </button>
              </div>
              
              {showPreview && previewData.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto">
                  <div className="space-y-3">
                    {previewData.map((product, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{product.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>Fiyat: {product.price} ₺</span>
                              <span>Stok: {product.stock}</span>
                              <span>Kategori: {product.categoryName}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.status === 'AKTİF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center h-80 flex flex-col items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">JSON verisi yükleyin ve önizleme görün</p>
                </div>
              )}
            </div>
          </div>

          {/* JSON Format Bilgisi */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="text-sm font-medium text-blue-800 mb-2">JSON Formatı:</h5>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Zorunlu alanlar:</strong> name, price, categoryName</p>
              <p><strong>Opsiyonel alanlar:</strong> description, stock, status, imageUrl1, imageUrl2, imageUrl3, isDiscountActive, discountPercentage</p>
              <p><strong>Durum değerleri:</strong> "AKTİF" veya "PASİF"</p>
            </div>
          </div>
        </div>

        {/* Footer - Butonlar */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-end space-x-3">
            <button 
              type="button" 
              onClick={handleClose} 
              className="px-6 py-2 text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-colors font-medium disabled:opacity-50 border border-gray-300"
              disabled={loading}
            >
              İptal
            </button>
            <button 
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all font-medium disabled:opacity-50 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              disabled={!isValidJson || previewData.length === 0 || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Yükleniyor...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>{previewData.length} Ürün Ekle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkProductModal;
