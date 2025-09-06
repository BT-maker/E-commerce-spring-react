import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit, 
  Eye,
  Globe,
  Mail,
  CreditCard,
  Users,
  Package,
  Bell,
  Shield,
  Check,
  X,
  AlertCircle,
  Database,
  Server,
  Lock,
  Key,
  DollarSign
} from 'lucide-react';
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';
import toast from 'react-hot-toast';

const AdminSystemSettings = () => {
  // Standart sistem ayarları - statik veri
  const [settings, setSettings] = useState([
    // GENEL AYARLAR
    {
      key: 'SITE_NAME',
      value: 'E-Ticaret Platformu',
      description: 'Platform adı',
      category: 'GENERAL',
      type: 'STRING',
      defaultValue: 'E-Ticaret Platformu',
      editable: true
    },
    {
      key: 'SITE_DESCRIPTION',
      value: 'Modern e-ticaret çözümü',
      description: 'Platform açıklaması',
      category: 'GENERAL',
      type: 'STRING',
      defaultValue: 'Modern e-ticaret çözümü',
      editable: true
    },
    {
      key: 'MAINTENANCE_MODE',
      value: 'false',
      description: 'Bakım modu',
      category: 'GENERAL',
      type: 'BOOLEAN',
      defaultValue: 'false',
      editable: true
    },
    {
      key: 'MAX_UPLOAD_SIZE',
      value: '10',
      description: 'Maksimum dosya yükleme boyutu (MB)',
      category: 'GENERAL',
      type: 'NUMBER',
      defaultValue: '10',
      editable: true
    },

    // KOMİSYON AYARLARI
    {
      key: 'COMMISSION_RATE',
      value: '5.0',
      description: 'Platform komisyon oranı (%)',
      category: 'COMMISSION',
      type: 'NUMBER',
      defaultValue: '5.0',
      editable: true
    },
    {
      key: 'MIN_COMMISSION',
      value: '1.00',
      description: 'Minimum komisyon tutarı (₺)',
      category: 'COMMISSION',
      type: 'NUMBER',
      defaultValue: '1.00',
      editable: true
    },
    {
      key: 'COMMISSION_PAYMENT_DAYS',
      value: '7',
      description: 'Komisyon ödeme günü',
      category: 'COMMISSION',
      type: 'NUMBER',
      defaultValue: '7',
      editable: true
    },

    // EMAIL AYARLARI
    {
      key: 'SMTP_HOST',
      value: 'smtp.gmail.com',
      description: 'SMTP sunucu adresi',
      category: 'EMAIL',
      type: 'STRING',
      defaultValue: 'smtp.gmail.com',
      editable: true
    },
    {
      key: 'SMTP_PORT',
      value: '587',
      description: 'SMTP port numarası',
      category: 'EMAIL',
      type: 'NUMBER',
      defaultValue: '587',
      editable: true
    },
    {
      key: 'SMTP_USERNAME',
      value: 'noreply@eticaret.com',
      description: 'SMTP kullanıcı adı',
      category: 'EMAIL',
      type: 'STRING',
      defaultValue: 'noreply@eticaret.com',
      editable: true
    },
    {
      key: 'SMTP_PASSWORD',
      value: '••••••••',
      description: 'SMTP şifresi',
      category: 'EMAIL',
      type: 'PASSWORD',
      defaultValue: '',
      editable: true
    },

    // GÜVENLİK AYARLARI
    {
      key: 'SESSION_TIMEOUT',
      value: '30',
      description: 'Oturum zaman aşımı (dakika)',
      category: 'SECURITY',
      type: 'NUMBER',
      defaultValue: '30',
      editable: true
    },
    {
      key: 'MAX_LOGIN_ATTEMPTS',
      value: '5',
      description: 'Maksimum giriş denemesi',
      category: 'SECURITY',
      type: 'NUMBER',
      defaultValue: '5',
      editable: true
    },
    {
      key: 'PASSWORD_MIN_LENGTH',
      value: '8',
      description: 'Minimum şifre uzunluğu',
      category: 'SECURITY',
      type: 'NUMBER',
      defaultValue: '8',
      editable: true
    },
    {
      key: 'TWO_FACTOR_AUTH',
      value: 'false',
      description: 'İki faktörlü kimlik doğrulama',
      category: 'SECURITY',
      type: 'BOOLEAN',
      defaultValue: 'false',
      editable: true
    },

    // BİLDİRİM AYARLARI
    {
      key: 'EMAIL_NOTIFICATIONS',
      value: 'true',
      description: 'Email bildirimleri',
      category: 'NOTIFICATION',
      type: 'BOOLEAN',
      defaultValue: 'true',
      editable: true
    },
    {
      key: 'SMS_NOTIFICATIONS',
      value: 'false',
      description: 'SMS bildirimleri',
      category: 'NOTIFICATION',
      type: 'BOOLEAN',
      defaultValue: 'false',
      editable: true
    },
    {
      key: 'PUSH_NOTIFICATIONS',
      value: 'true',
      description: 'Push bildirimleri',
      category: 'NOTIFICATION',
      type: 'BOOLEAN',
      defaultValue: 'true',
      editable: true
    },

    // ÖDEME AYARLARI
    {
      key: 'PAYMENT_GATEWAY',
      value: 'iyzico',
      description: 'Ödeme sağlayıcısı',
      category: 'PAYMENT',
      type: 'STRING',
      defaultValue: 'iyzico',
      editable: true
    },
    {
      key: 'CURRENCY',
      value: 'TRY',
      description: 'Para birimi',
      category: 'PAYMENT',
      type: 'STRING',
      defaultValue: 'TRY',
      editable: true
    },
    {
      key: 'MIN_ORDER_AMOUNT',
      value: '10.00',
      description: 'Minimum sipariş tutarı (₺)',
      category: 'PAYMENT',
      type: 'NUMBER',
      defaultValue: '10.00',
      editable: true
    }
  ]);

  const [categories] = useState(['GENERAL', 'COMMISSION', 'EMAIL', 'SECURITY', 'NOTIFICATION', 'PAYMENT']);
  const [activeCategory, setActiveCategory] = useState('GENERAL');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSetting, setNewSetting] = useState({
    key: '',
    value: '',
    description: '',
    category: 'GENERAL',
    type: 'STRING',
    defaultValue: '',
    editable: true
  });

  // Artık database'den çekmiyoruz, statik veri kullanıyoruz
  const fetchSettings = () => {
    // Statik veri zaten state'te tanımlı, sadece toast göster
    toast.success('Ayarlar yüklendi');
  };

  const saveSetting = (key, value) => {
    try {
      setSaving(true);
      
      // Statik veri üzerinde güncelleme yap
      setSettings(prevSettings => 
        prevSettings.map(setting => 
          setting.key === key 
            ? { ...setting, value: value }
            : setting
        )
      );
      
      toast.success('Ayar başarıyla güncellendi');
      setEditingKey(null);
    } catch (error) {
      console.error('Save setting error:', error);
      toast.error('Ayar güncellenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const createSetting = () => {
    try {
      setSaving(true);
      
      // Statik veriye yeni ayar ekle
      setSettings(prevSettings => [...prevSettings, newSetting]);
      
      toast.success('Yeni ayar başarıyla oluşturuldu');
      setShowCreateModal(false);
      setNewSetting({
        key: '',
        value: '',
        description: '',
        category: 'GENERAL',
        type: 'STRING',
        defaultValue: '',
        editable: true
      });
    } catch (error) {
      console.error('Create setting error:', error);
      toast.error('Ayar oluşturulurken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const deleteSetting = (key) => {
    if (!window.confirm('Bu ayarı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      // Statik veriden ayarı sil
      setSettings(prevSettings => 
        prevSettings.filter(setting => setting.key !== key)
      );
      
      toast.success('Ayar başarıyla silindi');
    } catch (error) {
      console.error('Delete setting error:', error);
      toast.error('Ayar silinirken hata oluştu');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'GENERAL':
        return <Settings className="w-5 h-5" />;
      case 'COMMISSION':
        return <DollarSign className="w-5 h-5" />;
      case 'EMAIL':
        return <Mail className="w-5 h-5" />;
      case 'PAYMENT':
        return <CreditCard className="w-5 h-5" />;
      case 'SECURITY':
        return <Shield className="w-5 h-5" />;
      case 'NOTIFICATION':
        return <Bell className="w-5 h-5" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'GENERAL':
        return 'bg-gray-100 text-gray-800';
      case 'COMMISSION':
        return 'bg-green-100 text-green-800';
      case 'EMAIL':
        return 'bg-blue-100 text-blue-800';
      case 'PAYMENT':
        return 'bg-purple-100 text-purple-800';
      case 'SECURITY':
        return 'bg-red-100 text-red-800';
      case 'NOTIFICATION':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'STRING':
        return <Edit className="w-4 h-4" />;
      case 'NUMBER':
        return <Edit className="w-4 h-4" />;
      case 'BOOLEAN':
        return <Check className="w-4 h-4" />;
      case 'PASSWORD':
        return <Lock className="w-4 h-4" />;
      default:
        return <Edit className="w-4 h-4" />;
    }
  };

  const filteredSettings = settings.filter(setting => setting.category === activeCategory);

  // Artık loading durumu yok, statik veri kullanıyoruz

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PageTitle title="Sistem Ayarları" />
      <MetaTags 
        title="Sistem Ayarları"
        description="Sistem ayarları ve konfigürasyon. Platform genel ayarları."
        keywords="sistem ayarları, konfigürasyon, platform ayarları"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
                  <p className="text-gray-600 mt-1">Platform genel ayarları ve konfigürasyon</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchSettings}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Yenile"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Yeni Ayar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm">
              <div className="p-6 border-b border-gray-200/50">
                <h2 className="text-lg font-semibold text-gray-900">Kategoriler</h2>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeCategory === category
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${
                        activeCategory === category ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                      }`}>
                        {getCategoryIcon(category)}
                      </div>
                      <span className="font-medium">{category}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-sm">
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(activeCategory)}`}>
                      {getCategoryIcon(activeCategory)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{activeCategory} Ayarları</h2>
                      <p className="text-gray-600 text-sm">{filteredSettings.length} ayar</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {filteredSettings.length > 0 ? (
                  <div className="space-y-4">
                    {filteredSettings.map((setting) => (
                      <div key={setting.key} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(setting.type)}
                                <span className="text-sm font-medium text-gray-500">{setting.type}</span>
                              </div>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                setting.editable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {setting.editable ? 'Düzenlenebilir' : 'Salt Okunur'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{setting.key}</h3>
                            <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                            
                            {editingKey === setting.key ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type={setting.type === 'PASSWORD' ? 'password' : setting.type === 'NUMBER' ? 'number' : 'text'}
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                <button
                                  onClick={() => saveSetting(setting.key, editValue)}
                                  disabled={saving}
                                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingKey(null);
                                    setEditValue('');
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-mono bg-white px-3 py-2 rounded border">
                                    {setting.type === 'PASSWORD' ? '••••••••' : setting.value}
                                  </p>
                                  {setting.defaultValue && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Varsayılan: {setting.defaultValue}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                  {setting.editable && (
                                    <button
                                      onClick={() => {
                                        setEditingKey(setting.key);
                                        setEditValue(setting.value);
                                      }}
                                      className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors duration-200"
                                      title="Düzenle"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteSetting(setting.key)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                    title="Sil"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ayar Bulunamadı</h3>
                    <p className="text-gray-500">Bu kategoride henüz ayar bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Setting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Yeni Ayar Oluştur</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ayar Anahtarı</label>
                <input
                  type="text"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="SETTING_KEY"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Değer</label>
                <input
                  type="text"
                  value={newSetting.value}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ayar değeri"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={newSetting.description}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Ayar açıklaması"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={newSetting.category}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="GENERAL">Genel</option>
                    <option value="COMMISSION">Komisyon</option>
                    <option value="EMAIL">Email</option>
                    <option value="PAYMENT">Ödeme</option>
                    <option value="SECURITY">Güvenlik</option>
                    <option value="NOTIFICATION">Bildirim</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tip</label>
                  <select
                    value={newSetting.type}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="STRING">Metin</option>
                    <option value="NUMBER">Sayı</option>
                    <option value="BOOLEAN">Boolean</option>
                    <option value="PASSWORD">Şifre</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Varsayılan Değer</label>
                <input
                  type="text"
                  value={newSetting.defaultValue}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, defaultValue: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Varsayılan değer"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editable"
                  checked={newSetting.editable}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, editable: e.target.checked }))}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="editable" className="ml-2 block text-sm text-gray-700">
                  Düzenlenebilir
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                İptal
              </button>
              <button
                onClick={createSetting}
                disabled={saving || !newSetting.key || !newSetting.value}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Oluştur</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSystemSettings;