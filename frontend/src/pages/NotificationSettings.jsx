import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Mail, Smartphone, Settings, Save, X } from 'lucide-react';
import api from '../services/api';


const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    promotions: true,
    systemAlerts: true,
    reviewReminders: false,
    cartReminders: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.get('/user/notification-settings', { withCredentials: true });
      setSettings(response.data);
    } catch (error) {
      console.log('Ayarlar yüklenemedi:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await api.put('/user/notification-settings', settings, { withCredentials: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.log('Ayarlar kaydedilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleQuietHoursToggle = () => {
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled
      }
    }));
  };

  const handleTimeChange = (type, value) => {
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [type]: value
      }
    }));
  };

  const notificationTypes = [
    {
      key: 'orderUpdates',
      title: 'Sipariş Güncellemeleri',
      description: 'Sipariş durumu değişikliklerinde bildirim al',
      icon: Bell
    },
    {
      key: 'promotions',
      title: 'Promosyonlar ve İndirimler',
      description: 'Özel teklifler ve kampanyalardan haberdar ol',
      icon: Bell
    },
    {
      key: 'systemAlerts',
      title: 'Sistem Bildirimleri',
      description: 'Önemli sistem güncellemeleri ve bakım bildirimleri',
      icon: Settings
    },
    {
      key: 'reviewReminders',
      title: 'Değerlendirme Hatırlatıcıları',
      description: 'Satın aldığın ürünler için değerlendirme yapmayı hatırlat',
      icon: Bell
    },
    {
      key: 'cartReminders',
      title: 'Sepet Hatırlatıcıları',
      description: 'Sepetindeki ürünler için hatırlatmalar',
      icon: Bell
    }
  ];

  const deliveryMethods = [
    {
      key: 'emailNotifications',
      title: 'E-posta Bildirimleri',
      description: 'Önemli güncellemeler için e-posta al',
      icon: Mail
    },
    {
      key: 'smsNotifications',
      title: 'SMS Bildirimleri',
      description: 'Acil durumlar için SMS al',
      icon: Smartphone
    },
    {
      key: 'pushNotifications',
      title: 'Push Bildirimleri',
      description: 'Tarayıcı üzerinden anlık bildirimler',
      icon: Bell
    }
  ];

  return (
    <div className="notification-settings">
      <div className="settings-container">
        <div className="settings-header">
          <div className="header-content">
            <h1>Bildirim Ayarları</h1>
            <p>Bildirim tercihlerinizi yönetin ve kişiselleştirin</p>
          </div>
          <div className="header-actions">
            <button
              onClick={saveSettings}
              disabled={loading}
              className={`save-button ${saved ? 'saved' : ''}`}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : saved ? (
                <>
                  <X size={16} />
                  Kaydedildi
                </>
              ) : (
                <>
                  <Save size={16} />
                  Kaydet
                </>
              )}
            </button>
          </div>
        </div>

        <div className="settings-content">
          {/* Bildirim Kanalları */}
          <div className="settings-section">
            <h2>Bildirim Kanalları</h2>
            <p className="section-description">
              Hangi kanallardan bildirim almak istediğinizi seçin
            </p>
            
            <div className="settings-grid">
              {deliveryMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div key={method.key} className="setting-card">
                    <div className="setting-header">
                      <div className="setting-icon">
                        <Icon size={20} />
                      </div>
                      <div className="setting-info">
                        <h3>{method.title}</h3>
                        <p>{method.description}</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings[method.key]}
                        onChange={() => handleToggle(method.key)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bildirim Türleri */}
          <div className="settings-section">
            <h2>Bildirim Türleri</h2>
            <p className="section-description">
              Hangi türde bildirimler almak istediğinizi seçin
            </p>
            
            <div className="settings-grid">
              {notificationTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.key} className="setting-card">
                    <div className="setting-header">
                      <div className="setting-icon">
                        <Icon size={20} />
                      </div>
                      <div className="setting-info">
                        <h3>{type.title}</h3>
                        <p>{type.description}</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings[type.key]}
                        onChange={() => handleToggle(type.key)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sessiz Saatler */}
          <div className="settings-section">
            <h2>Sessiz Saatler</h2>
            <p className="section-description">
              Belirli saatlerde bildirim almayı durdurun
            </p>
            
            <div className="quiet-hours-card">
              <div className="setting-header">
                <div className="setting-icon">
                  <BellOff size={20} />
                </div>
                <div className="setting-info">
                  <h3>Sessiz Saatleri Etkinleştir</h3>
                  <p>Bu saatlerde sadece acil bildirimler gönderilir</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.quietHours.enabled}
                    onChange={handleQuietHoursToggle}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              {settings.quietHours.enabled && (
                <div className="time-settings">
                  <div className="time-input-group">
                    <label>Başlangıç Saati</label>
                    <input
                      type="time"
                      value={settings.quietHours.start}
                      onChange={(e) => handleTimeChange('start', e.target.value)}
                      className="time-input"
                    />
                  </div>
                  <div className="time-input-group">
                    <label>Bitiş Saati</label>
                    <input
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) => handleTimeChange('end', e.target.value)}
                      className="time-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bildirim Önizlemesi */}
          <div className="settings-section">
            <h2>Bildirim Önizlemesi</h2>
            <p className="section-description">
              Bildirimlerinizin nasıl görüneceğini test edin
            </p>
            
            <div className="notification-preview">
              <div className="preview-header">
                <h3>Test Bildirimi</h3>
                <button className="test-button">
                  Test Bildirimi Gönder
                </button>
              </div>
              <div className="preview-content">
                <div className="preview-notification">
                  <div className="preview-icon">
                    <Bell size={16} />
                  </div>
                  <div className="preview-text">
                    <p className="preview-title">Test Bildirimi</p>
                    <p className="preview-message">Bu bir test bildirimidir. Ayarlarınız doğru çalışıyor.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
