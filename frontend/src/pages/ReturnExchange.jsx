import React, { useState } from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import { RefreshCw, Package, Clock, AlertCircle, CheckCircle, Send } from 'lucide-react';
import './ReturnExchange.css';

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
    <div className="return-exchange-container">
      <PageTitle title="İade ve Değişim" />
      <MetaTags 
        title="İade ve Değişim"
        description="Shopping platformu iade ve değişim politikaları. Güvenli ve kolay iade süreci."
        keywords="iade, değişim, iade politikası, shopping iade"
      />
      
      <div className="return-exchange-content">
        <h1 className="return-exchange-title">İade ve Değişim</h1>
        
        {/* Tab Menüsü */}
        <div className="tab-menu">
          <button 
            className={`tab-btn ${activeTab === 'return' ? 'active' : ''}`}
            onClick={() => setActiveTab('return')}
          >
            <RefreshCw size={20} />
            İade Politikası
          </button>
          <button 
            className={`tab-btn ${activeTab === 'exchange' ? 'active' : ''}`}
            onClick={() => setActiveTab('exchange')}
          >
            <Package size={20} />
            Değişim Politikası
          </button>
          <button 
            className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            <Send size={20} />
            İade/Değişim Talebi
          </button>
        </div>

        {/* İade Politikası */}
        {activeTab === 'return' && (
          <div className="policy-section">
            <h2>İade Politikası</h2>
            
            <div className="policy-grid">
              <div className="policy-card">
                <div className="policy-icon">
                  <Clock size={24} />
                </div>
                <h3>İade Süresi</h3>
                <p>Ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz.</p>
              </div>

              <div className="policy-card">
                <div className="policy-icon">
                  <Package size={24} />
                </div>
                <h3>Ürün Durumu</h3>
                <p>İade edilecek ürünler orijinal ambalajında ve kullanılmamış durumda olmalıdır.</p>
              </div>

              <div className="policy-card">
                <div className="policy-icon">
                  <CheckCircle size={24} />
                </div>
                <h3>İade Koşulları</h3>
                <p>Ürün etiketleri çıkarılmamış ve ürün test edilmemiş olmalıdır.</p>
              </div>

              <div className="policy-card">
                <div className="policy-icon">
                  <AlertCircle size={24} />
                </div>
                <h3>İade Edilemeyen Ürünler</h3>
                <p>Kişisel bakım ürünleri, iç çamaşırı, yüzme kıyafetleri iade edilemez.</p>
              </div>
            </div>

            <div className="policy-details">
              <h3>İade Süreci</h3>
              <ol className="process-list">
                <li>İade/değişim talebinizi online olarak oluşturun</li>
                <li>Ürünü orijinal ambalajında hazırlayın</li>
                <li>Kargo firması ürünü adresinizden alacak</li>
                <li>Ürün kontrol edildikten sonra iade işlemi tamamlanır</li>
                <li>Ödeme 3-5 iş günü içinde iade edilir</li>
              </ol>
            </div>
          </div>
        )}

        {/* Değişim Politikası */}
        {activeTab === 'exchange' && (
          <div className="policy-section">
            <h2>Değişim Politikası</h2>
            
            <div className="policy-grid">
              <div className="policy-card">
                <div className="policy-icon">
                  <Clock size={24} />
                </div>
                <h3>Değişim Süresi</h3>
                <p>Ürünlerinizi teslim aldığınız tarihten itibaren 30 gün içinde değiştirebilirsiniz.</p>
              </div>

              <div className="policy-card">
                <div className="policy-icon">
                  <Package size={24} />
                </div>
                <h3>Değişim Koşulları</h3>
                <p>Ürün orijinal durumunda ve ambalajında olmalıdır.</p>
              </div>

              <div className="policy-card">
                <div className="policy-icon">
                  <CheckCircle size={24} />
                </div>
                <h3>Değişim Seçenekleri</h3>
                <p>Aynı ürünün farklı boyut/renk seçenekleri ile değiştirebilirsiniz.</p>
              </div>

              <div className="policy-card">
                <div className="policy-icon">
                  <AlertCircle size={24} />
                </div>
                <h3>Değişim Ücreti</h3>
                <p>Değişim işlemi ücretsizdir, sadece kargo ücreti alınır.</p>
              </div>
            </div>

            <div className="policy-details">
              <h3>Değişim Süreci</h3>
              <ol className="process-list">
                <li>Değişim talebinizi online olarak oluşturun</li>
                <li>Yeni ürün seçiminizi yapın</li>
                <li>Mevcut ürünü kargo ile gönderin</li>
                <li>Yeni ürün hazırlandığında size gönderilir</li>
                <li>Fiyat farkı varsa hesaplanır ve ödenir</li>
              </ol>
            </div>
          </div>
        )}

        {/* İade/Değişim Formu */}
        {activeTab === 'form' && (
          <div className="form-section">
            <h2>İade/Değişim Talebi</h2>
            
            <form className="return-form" onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="orderNumber">Sipariş Numarası *</label>
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    value={formData.orderNumber}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Örn: ORDER123"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Ad Soyad *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">E-posta *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefon *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="reason">İade/Değişim Nedeni *</label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Neden seçiniz</option>
                  {returnReasons.map((reason, index) => (
                    <option key={index} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Açıklama</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  disabled={loading}
                  placeholder="Detaylı açıklama yazabilirsiniz..."
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Talep Gönder
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