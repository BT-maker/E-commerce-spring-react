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
      setError('Mağaza bilgileri yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
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
        setUserData({
          username: data.username || '',
          email: data.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error('Kullanıcı veri hatası:', err);
    }
  };

  const handleStoreUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8082/api/seller/store', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(storeData)
      });

      if (response.ok) {
        setSuccess('Mağaza bilgileri başarıyla güncellendi.');
      } else {
        setError('Mağaza bilgileri güncellenirken hata oluştu.');
      }
    } catch (err) {
      console.error('Mağaza güncelleme hatası:', err);
      setError('Mağaza bilgileri güncellenirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileUpdate = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8082/api/auth/profile', {
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
        setSuccess('Hesap bilgileri başarıyla güncellendi.');
      } else {
        setError('Hesap bilgileri güncellenirken hata oluştu.');
      }
    } catch (err) {
      console.error('Profil güncelleme hatası:', err);
      setError('Hesap bilgileri güncellenirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (userData.newPassword !== userData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor.');
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
        setSuccess('Şifre başarıyla değiştirildi.');
        setUserData({
          ...userData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError('Şifre değiştirilirken hata oluştu.');
      }
    } catch (err) {
      console.error('Şifre değiştirme hatası:', err);
      setError('Şifre değiştirilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8082/api/seller/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSuccess('Bildirim ayarları başarıyla güncellendi.');
      } else {
        setError('Bildirim ayarları güncellenirken hata oluştu.');
      }
    } catch (err) {
      console.error('Bildirim ayarları hatası:', err);
      setError('Bildirim ayarları güncellenirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mağaza Ayarları</h1>
              <p className="text-indigo-100">Mağazanızın ayarlarını yönetin</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm">
                <FaCog className="text-indigo-200" />
                <span>Ayarlar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              <FaCheck className="text-green-500" />
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              <FaTimes className="text-red-500" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button 
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'store' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('store')}
            >
              <FaStore />
              <span>Mağaza</span>
            </button>
            <button 
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'account' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('account')}
            >
              <FaUser />
              <span>Hesap</span>
            </button>
            <button 
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'notifications' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <FaBell />
              <span>Bildirimler</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Store Information Tab */}
          {activeTab === 'store' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Mağaza Bilgileri</h2>
                <p className="text-gray-600">Mağazanızın temel bilgilerini güncelleyin</p>
              </div>

              <form onSubmit={handleStoreUpdate} className="space-y-8">
                {/* General Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaStore className="mr-2 text-indigo-500" />
                    Genel Bilgiler
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                        Mağaza Adı *
                      </label>
                      <input
                        type="text"
                        id="storeName"
                        value={storeData.name}
                        onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Mağaza adınızı girin"
                      />
                    </div>

                    <div>
                      <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          id="storeEmail"
                          value={storeData.email}
                          onChange={(e) => setStoreData({...storeData, email: e.target.value})}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="E-posta adresinizi girin"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      Mağaza Açıklaması
                    </label>
                    <textarea
                      id="storeDescription"
                      value={storeData.description}
                      onChange={(e) => setStoreData({...storeData, description: e.target.value})}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Mağazanız hakkında kısa bir açıklama yazın"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaPhone className="mr-2 text-indigo-500" />
                    İletişim Bilgileri
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          id="storePhone"
                          value={storeData.phone}
                          onChange={(e) => setStoreData({...storeData, phone: e.target.value})}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Telefon numaranızı girin"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="storeWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                        Web Sitesi
                      </label>
                      <div className="relative">
                        <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          id="storeWebsite"
                          value={storeData.website}
                          onChange={(e) => setStoreData({...storeData, website: e.target.value})}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="https://www.example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Adres
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="storeAddress"
                        value={storeData.address}
                        onChange={(e) => setStoreData({...storeData, address: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Mağaza adresinizi girin"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700 mb-2">
                      Çalışma Saatleri
                    </label>
                    <div className="relative">
                      <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="workingHours"
                        value={storeData.workingHours}
                        onChange={(e) => setStoreData({...storeData, workingHours: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Örn: Pazartesi-Cuma 09:00-18:00"
                      />
                    </div>
                  </div>
                </div>

                {/* Visual Elements */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaImage className="mr-2 text-indigo-500" />
                    Görsel Öğeler
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="storeLogo" className="block text-sm font-medium text-gray-700 mb-2">
                        Mağaza Logosu URL
                      </label>
                      <input
                        type="url"
                        id="storeLogo"
                        value={storeData.logo}
                        onChange={(e) => setStoreData({...storeData, logo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="https://example.com/logo.png"
                      />
                      {storeData.logo && (
                        <div className="mt-2">
                          <img 
                            src={storeData.logo} 
                            alt="Mağaza logosu" 
                            className="w-16 h-16 object-contain border border-gray-300 rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="storeBanner" className="block text-sm font-medium text-gray-700 mb-2">
                        Mağaza Banner URL
                      </label>
                      <input
                        type="url"
                        id="storeBanner"
                        value={storeData.banner}
                        onChange={(e) => setStoreData({...storeData, banner: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="https://example.com/banner.png"
                      />
                      {storeData.banner && (
                        <div className="mt-2">
                          <img 
                            src={storeData.banner} 
                            alt="Mağaza banner" 
                            className="w-full h-20 object-cover border border-gray-300 rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <FaSave />
                    <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Account Settings Tab */}
          {activeTab === 'account' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Hesap Ayarları</h2>
                <p className="text-gray-600">Hesap bilgilerinizi ve şifrenizi güncelleyin</p>
              </div>

              <div className="space-y-8">
                {/* Account Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUser className="mr-2 text-indigo-500" />
                    Hesap Bilgileri
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        Kullanıcı Adı
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={userData.username}
                        onChange={(e) => setUserData({...userData, username: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Kullanıcı adınız"
                      />
                    </div>

                    <div>
                      <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta
                      </label>
                      <input
                        type="email"
                        id="userEmail"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="E-posta adresiniz"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button 
                      onClick={handleProfileUpdate} 
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                      <FaSave />
                      <span>{saving ? 'Güncelleniyor...' : 'Hesap Bilgilerini Güncelle'}</span>
                    </button>
                  </div>
                </div>

                {/* Password Change */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaShieldAlt className="mr-2 text-indigo-500" />
                    Şifre Değiştirme
                  </h3>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Mevcut Şifre *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="currentPassword"
                          value={userData.currentPassword}
                          onChange={(e) => setUserData({...userData, currentPassword: e.target.value})}
                          required
                          className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Mevcut şifrenizi girin"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Yeni Şifre *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          value={userData.newPassword}
                          onChange={(e) => setUserData({...userData, newPassword: e.target.value})}
                          required
                          className="w-full pr-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                          placeholder="Yeni şifrenizi girin"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Yeni Şifre Tekrar *
                      </label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={userData.confirmPassword}
                        onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Yeni şifrenizi tekrar girin"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={saving}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                      >
                        <FaSave />
                        <span>{saving ? 'Şifre Değiştiriliyor...' : 'Şifreyi Değiştir'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Bildirim Ayarları</h2>
                <p className="text-gray-600">Bildirim tercihlerinizi yönetin</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaBell className="mr-2 text-indigo-500" />
                  Bildirim Türleri
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">E-posta Bildirimleri</h4>
                      <p className="text-sm text-gray-600">Önemli güncellemeler için e-posta alın</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Bildirimleri</h4>
                      <p className="text-sm text-gray-600">Acil durumlar için SMS alın</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Sipariş Bildirimleri</h4>
                      <p className="text-sm text-gray-600">Yeni siparişler için bildirim alın</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.orderNotifications}
                        onChange={(e) => setSettings({...settings, orderNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Stok Bildirimleri</h4>
                      <p className="text-sm text-gray-600">Düşük stok uyarıları alın</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.stockNotifications}
                        onChange={(e) => setSettings({...settings, stockNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleNotificationSettings}
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  >
                    <FaSave />
                    <span>{saving ? 'Kaydediliyor...' : 'Bildirim Ayarlarını Kaydet'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerSettings; 