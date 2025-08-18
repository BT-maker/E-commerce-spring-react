import React, { useState, useEffect } from 'react';
import { 
  FaSave, 
  FaStore, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaGlobe,
  FaClock,
  FaImage,
  FaEdit,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaBell,
  FaPalette,
  FaCog
} from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import './SellerSettings.css';

const SellerSettings = () => {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  
  const [storeData, setStoreData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    workingHours: '',
    logo: '',
    banner: ''
  });
  
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    stockNotifications: true,
    language: 'tr'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('store');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchStoreData();
    fetchUserData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/seller/store', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        
        // URL ve base64 verilerini kabul et
        const cleanLogo = data.logo && typeof data.logo === 'string' && data.logo.trim() !== '' ? data.logo.trim() : '';
        const cleanBanner = data.banner && typeof data.banner === 'string' && data.banner.trim() !== '' ? data.banner.trim() : '';
        
        console.log('Original logo:', data.logo);
        console.log('Original logo type:', typeof data.logo);
        console.log('Original logo length:', data.logo ? data.logo.length : 'null/undefined');
        console.log('Cleaned logo:', cleanLogo);
        console.log('Original banner:', data.banner);
        console.log('Original banner type:', typeof data.banner);
        console.log('Original banner length:', data.banner ? data.banner.length : 'null/undefined');
        console.log('Cleaned banner:', cleanBanner);
        
        setStoreData({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          workingHours: data.workingHours || '',
          logo: cleanLogo,
          banner: cleanBanner
        });
      }
    } catch (err) {
      console.error('Mağaza veri hatası:', err);
      setError('Mağaza verileri yüklenirken bir hata oluştu.');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(prev => ({
          ...prev,
          username: data.username || '',
          email: data.email || ''
        }));
      }
    } catch (err) {
      console.error('Kullanıcı veri hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStoreUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // URL validasyonu
      const logoUrl = storeData.logo ? storeData.logo.trim() : '';
      const bannerUrl = storeData.banner ? storeData.banner.trim() : '';
      
      console.log('Validating logo URL:', logoUrl);
      console.log('Logo URL validation result:', isValidUrl(logoUrl));
      console.log('Validating banner URL:', bannerUrl);
      console.log('Banner URL validation result:', isValidUrl(bannerUrl));
      
      if (logoUrl && !isValidUrl(logoUrl)) {
        setError('Geçerli bir logo URL\'si girin');
        setSaving(false);
        return;
      }
      
      if (bannerUrl && !isValidUrl(bannerUrl)) {
        setError('Geçerli bir banner URL\'si girin');
        setSaving(false);
        return;
      }

      const response = await fetch('http://localhost:8082/api/seller/store', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...storeData,
          logo: logoUrl,
          banner: bannerUrl
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message || 'Mağaza bilgileri başarıyla güncellendi!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        let errorMessage = 'Mağaza bilgileri güncellenirken bir hata oluştu.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Mağaza güncelleme hatası:', err);
      setError('Mağaza bilgileri güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  // URL validasyon fonksiyonu
  const isValidUrl = (string) => {
    // Boş, null, undefined veya sadece boşluk içeren string'ler geçerli
    if (!string || typeof string !== 'string' || string.trim() === '') {
      return true;
    }
    
    const trimmedString = string.trim();
    
    // Base64 kontrolü - base64 verilerini de kabul et
    if (trimmedString.includes('data:image') || trimmedString.includes('base64')) {
      // Base64 formatını kontrol et
      const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i;
      return base64Pattern.test(trimmedString);
    }
    
    // URL protokolü kontrolü - http ve https destekle
    if (!trimmedString.startsWith('http://') && !trimmedString.startsWith('https://')) {
      return false;
    }
    
    // URL uzunluğu kontrolü (çok uzun URL'ler için)
    if (trimmedString.length > 2000) {
      return false;
    }
    
    try {
      new URL(trimmedString);
      return true;
    } catch (_) {
      // URL constructor başarısız olursa, basit bir regex kontrolü yap
      const urlPattern = /^https?:\/\/.+/i;
      return urlPattern.test(trimmedString);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (userData.newPassword !== userData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor!');
      return;
    }

    if (userData.newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır!');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8082/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: userData.currentPassword,
          newPassword: userData.newPassword
        })
      });

      if (response.ok) {
        setSuccess('Şifre başarıyla değiştirildi!');
        setUserData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Şifre değiştirilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Şifre değiştirme hatası:', err);
      setError('Şifre değiştirilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8082/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: userData.username,
          email: userData.email
        })
      });

      if (response.ok) {
        setSuccess('Hesap bilgileri başarıyla güncellendi!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Hesap bilgileri güncellenirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Hesap güncelleme hatası:', err);
      setError('Hesap bilgileri güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsUpdate = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8082/api/seller/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSuccess('Ayarlar başarıyla güncellendi!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ayarlar güncellenirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Ayarlar güncelleme hatası:', err);
      setError('Ayarlar güncellenirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  if (loading) {
    return (
      <div className="seller-settings">
        <div className="settings-loading">
          <div className="loading-spinner"></div>
          <h3>Ayarlar Yükleniyor...</h3>
          <p>Mağaza bilgileriniz hazırlanıyor, lütfen bekleyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-settings">
      {/* Header */}
      <div className="settings-header">
        <div className="header-content">
          <h1>{t('settings')}</h1>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="success-message">
          <FaCheck />
          <span>{success}</span>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <FaTimes />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="settings-tabs">
        <button 
          className={`tab-btn ${activeTab === 'store' ? 'active' : ''}`}
          onClick={() => setActiveTab('store')}
        >
          <FaStore />
          <span>{t('store')}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <FaUser />
          <span>{t('account')}</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell />
          <span>{t('notifications')}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="settings-content">
        {/* Store Information Tab */}
        {activeTab === 'store' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Mağaza Bilgileri</h2>
              <p>Mağazanızın temel bilgilerini güncelleyin</p>
            </div>

            <form onSubmit={handleStoreUpdate} className="settings-form">
              <div className="form-section">
                <h3>Genel Bilgiler</h3>
                
                <div className="form-group">
                  <label htmlFor="storeName">Mağaza Adı *</label>
                  <div className="input-group">
                    <FaStore className="input-icon" />
                    <input
                      type="text"
                      id="storeName"
                      value={storeData.name}
                      onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                      required
                      className="form-input"
                      placeholder="Mağaza adınızı girin"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="storeDescription">Mağaza Açıklaması</label>
                  <textarea
                    id="storeDescription"
                    value={storeData.description}
                    onChange={(e) => setStoreData({...storeData, description: e.target.value})}
                    className="form-textarea"
                    rows="4"
                    placeholder="Mağazanız hakkında kısa bir açıklama yazın"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="storeAddress">Adres</label>
                  <div className="input-group">
                    <FaMapMarkerAlt className="input-icon" />
                    <input
                      type="text"
                      id="storeAddress"
                      value={storeData.address}
                      onChange={(e) => setStoreData({...storeData, address: e.target.value})}
                      className="form-input"
                      placeholder="Mağaza adresinizi girin"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>İletişim Bilgileri</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="storePhone">Telefon</label>
                    <div className="input-group">
                      <FaPhone className="input-icon" />
                      <input
                        type="tel"
                        id="storePhone"
                        value={storeData.phone}
                        onChange={(e) => setStoreData({...storeData, phone: e.target.value})}
                        className="form-input"
                        placeholder="Telefon numaranızı girin"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="storeEmail">E-posta</label>
                    <div className="input-group">
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        id="storeEmail"
                        value={storeData.email}
                        onChange={(e) => setStoreData({...storeData, email: e.target.value})}
                        className="form-input"
                        placeholder="E-posta adresinizi girin"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="storeWebsite">Web Sitesi</label>
                  <div className="input-group">
                    <FaGlobe className="input-icon" />
                    <input
                      type="url"
                      id="storeWebsite"
                      value={storeData.website}
                      onChange={(e) => setStoreData({...storeData, website: e.target.value})}
                      className="form-input"
                      placeholder="https://www.example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="workingHours">Çalışma Saatleri</label>
                  <div className="input-group">
                    <FaClock className="input-icon" />
                    <input
                      type="text"
                      id="workingHours"
                      value={storeData.workingHours}
                      onChange={(e) => setStoreData({...storeData, workingHours: e.target.value})}
                      className="form-input"
                      placeholder="Örn: Pazartesi-Cuma 09:00-18:00"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Görsel Öğeler</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="storeLogo">Mağaza Logosu URL</label>
                    <div className="image-input-group">
                                             {storeData.logo && (
                         <img src={storeData.logo} alt="Logo" className="preview-image" />
                       )}
                      <div className="input-group">
                        <FaImage className="input-icon" />
                        <input
                          type="url"
                          id="storeLogo"
                          value={storeData.logo || ''}
                          onChange={(e) => setStoreData({...storeData, logo: e.target.value})}
                          className="form-input"
                                                     placeholder="https://example.com/logo.png veya base64 resim verisi"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="storeBanner">Mağaza Banner'ı URL</label>
                    <div className="image-input-group">
                                             {storeData.banner && (
                         <img src={storeData.banner} alt="Banner" className="preview-image" />
                       )}
                      <div className="input-group">
                        <FaImage className="input-icon" />
                        <input
                          type="url"
                          id="storeBanner"
                          value={storeData.banner || ''}
                          onChange={(e) => setStoreData({...storeData, banner: e.target.value})}
                          className="form-input"
                                                     placeholder="https://example.com/banner.png veya base64 resim verisi"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  <FaSave />
                  {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Account Settings Tab */}
        {activeTab === 'account' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Hesap Ayarları</h2>
              <p>Hesap bilgilerinizi ve şifrenizi güncelleyin</p>
            </div>

            <form onSubmit={handlePasswordChange} className="settings-form">
              <div className="form-section">
                <h3>Hesap Bilgileri</h3>
                
                <div className="form-group">
                  <label htmlFor="username">Kullanıcı Adı</label>
                  <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      id="username"
                      value={userData.username}
                      onChange={(e) => setUserData({...userData, username: e.target.value})}
                      className="form-input"
                      placeholder="Kullanıcı adınız"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="userEmail">E-posta</label>
                  <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      id="userEmail"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="form-input"
                      placeholder="E-posta adresiniz"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button onClick={handleProfileUpdate} className="btn-primary" disabled={saving}>
                    <FaSave />
                    {saving ? 'Güncelleniyor...' : 'Hesap Bilgilerini Güncelle'}
                  </button>
                </div>
              </div>

              <div className="form-section">
                <h3>Şifre Değiştirme</h3>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Mevcut Şifre *</label>
                  <div className="input-group">
                    <FaShieldAlt className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="currentPassword"
                      value={userData.currentPassword}
                      onChange={(e) => setUserData({...userData, currentPassword: e.target.value})}
                      required
                      className="form-input"
                      placeholder="Mevcut şifrenizi girin"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">Yeni Şifre *</label>
                  <div className="input-group">
                    <FaShieldAlt className="input-icon" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      value={userData.newPassword}
                      onChange={(e) => setUserData({...userData, newPassword: e.target.value})}
                      required
                      className="form-input"
                      placeholder="Yeni şifrenizi girin"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Yeni Şifre Tekrar *</label>
                  <div className="input-group">
                    <FaShieldAlt className="input-icon" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
                      required
                      className="form-input"
                      placeholder="Yeni şifrenizi tekrar girin"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  <FaSave />
                  {saving ? 'Şifre Değiştiriliyor...' : 'Şifreyi Değiştir'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="tab-content">
            <div className="content-header">
              <h2>Bildirim Ayarları</h2>
              <p>Bildirim tercihlerinizi yönetin</p>
            </div>

            <div className="settings-form">
              <div className="form-section">
                <h3>Bildirim Türleri</h3>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>E-posta Bildirimleri</h4>
                    <p>Önemli güncellemeler için e-posta alın</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>SMS Bildirimleri</h4>
                    <p>Acil durumlar için SMS alın</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Sipariş Bildirimleri</h4>
                    <p>Yeni siparişler için bildirim alın</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.orderNotifications}
                      onChange={(e) => setSettings({...settings, orderNotifications: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Stok Bildirimleri</h4>
                    <p>Düşük stok uyarıları alın</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.stockNotifications}
                      onChange={(e) => setSettings({...settings, stockNotifications: e.target.checked})}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button onClick={handleSettingsUpdate} className="btn-primary" disabled={saving}>
                  <FaSave />
                  {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default SellerSettings; 