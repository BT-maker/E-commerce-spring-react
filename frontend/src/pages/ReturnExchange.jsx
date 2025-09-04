import React, { useState } from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import { RefreshCw, Package, Clock, AlertCircle, CheckCircle, Send, Loader2 } from 'lucide-react';

const ReturnExchange = () => {
  const [activeTab, setActiveTab] = useState('return');
  const [formData, setFormData] = useState({
    orderNumber: '',
    name: '',
    email: '',
    phone: '',
    reason: '',
    description: '',
    items: []
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simüle edilmiş form gönderimi
    setTimeout(() => {
      setSuccess('İade/değişim talebiniz başarıyla alındı! En kısa sürede size dönüş yapacağız.');
      setFormData({
        orderNumber: '',
        name: '',
        email: '',
        phone: '',
        reason: '',
        description: '',
        items: []
      });
      setLoading(false);
    }, 2000);
  };

  const returnReasons = [
    'Ürün hasarlı geldi',
    'Ürün beklentilerimi karşılamadı',
    'Yanlış ürün gönderildi',
    'Ürün boyutu uygun değil',
    'Ürün kalitesi beklentilerimi karşılamadı',
    'Diğer'
  ];

  return (
    <div className="min-h-screen ">
      <PageTitle title="İade ve Değişim" />
      <MetaTags 
        title="İade ve Değişim"
        description="Shopping platformu iade ve değişim politikaları. Güvenli ve kolay iade süreci."
        keywords="iade, değişim, iade politikası, shopping iade"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">İade ve Değişim</h1>
          <p className="text-xl text-gray-600">Güvenli ve kolay iade sürecimiz hakkında bilgi alın</p>
        </div>
        
        {/* Tab Menüsü */}
        <div className="flex flex-wrap justify-center space-x-2 mb-12">
          <button 
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'return' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setActiveTab('return')}
          >
            <RefreshCw size={20} />
            <span>İade Politikası</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'exchange' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setActiveTab('exchange')}
          >
            <Package size={20} />
            <span>Değişim Politikası</span>
          </button>
          <button 
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'form' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setActiveTab('form')}
          >
            <Send size={20} />
            <span>İade/Değişim Talebi</span>
          </button>
        </div>

        {/* İade Politikası */}
        {activeTab === 'return' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">İade Politikası</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <Clock size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">İade Süresi</h3>
                <p className="text-gray-700 text-sm">Ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-500 rounded-lg">
                    <Package size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ürün Durumu</h3>
                <p className="text-gray-700 text-sm">İade edilecek ürünler orijinal ambalajında ve kullanılmamış durumda olmalıdır.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-500 rounded-lg">
                    <CheckCircle size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">İade Koşulları</h3>
                <p className="text-gray-700 text-sm">Ürün etiketleri çıkarılmamış ve ürün test edilmemiş olmalıdır.</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-red-500 rounded-lg">
                    <AlertCircle size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">İade Edilemeyen Ürünler</h3>
                <p className="text-gray-700 text-sm">Kişisel bakım ürünleri, iç çamaşırı, yüzme kıyafetleri iade edilemez.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">İade Süreci</h3>
              <ol className="space-y-4">
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <p className="text-gray-700">İade/değişim talebinizi online olarak oluşturun</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <p className="text-gray-700">Ürünü orijinal ambalajında hazırlayın</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <p className="text-gray-700">Kargo firması ürünü adresinizden alacak</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <p className="text-gray-700">Ürün kontrol edildikten sonra iade işlemi tamamlanır</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                  <p className="text-gray-700">Ödeme 3-5 iş günü içinde iade edilir</p>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Değişim Politikası */}
        {activeTab === 'exchange' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Değişim Politikası</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <Clock size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Değişim Süresi</h3>
                <p className="text-gray-700 text-sm">Ürünlerinizi teslim aldığınız tarihten itibaren 30 gün içinde değiştirebilirsiniz.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-500 rounded-lg">
                    <Package size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Değişim Koşulları</h3>
                <p className="text-gray-700 text-sm">Ürün orijinal durumunda ve ambalajında olmalıdır.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-500 rounded-lg">
                    <CheckCircle size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Değişim Seçenekleri</h3>
                <p className="text-gray-700 text-sm">Aynı ürünün farklı boyut/renk seçenekleri ile değiştirebilirsiniz.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-yellow-500 rounded-lg">
                    <AlertCircle size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Değişim Ücreti</h3>
                <p className="text-gray-700 text-sm">Değişim işlemi ücretsizdir, sadece kargo ücreti alınır.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Değişim Süreci</h3>
              <ol className="space-y-4">
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <p className="text-gray-700">Değişim talebinizi online olarak oluşturun</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <p className="text-gray-700">Yeni ürün seçiminizi yapın</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <p className="text-gray-700">Mevcut ürünü kargo ile gönderin</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <p className="text-gray-700">Yeni ürün hazırlandığında size gönderilir</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
                  <p className="text-gray-700">Fiyat farkı varsa hesaplanır ve ödenir</p>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* İade/Değişim Formu */}
        {activeTab === 'form' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">İade/Değişim Talebi</h2>
            
            <form className="max-w-2xl mx-auto space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Sipariş Numarası *
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Örn: ORDER123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  İade/Değişim Nedeni *
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Neden seçiniz</option>
                  {returnReasons.map((reason, index) => (
                    <option key={index} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  disabled={loading}
                  placeholder="Detaylı açıklama yazabilirsiniz..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Talep Gönder</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnExchange; 