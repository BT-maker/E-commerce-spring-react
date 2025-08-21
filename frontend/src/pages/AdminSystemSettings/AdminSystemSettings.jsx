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
  AlertCircle
} from 'lucide-react';
import './AdminSystemSettings.css';
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';
import toast from 'react-hot-toast';

const AdminSystemSettings = () => {
  const [settings, setSettings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('GENERAL');
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8082/api/admin/system-settings', {
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || []);
        setCategories(data.categories || []);
      } else {
        console.error('Ayarlar alınamadı');
        toast.error('Sistem ayarları alınamadı');
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
      toast.error('Ayarlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'GENERAL': return <Globe size={20} />;
      case 'EMAIL': return <Mail size={20} />;
      case 'PAYMENT': return <CreditCard size={20} />;
      case 'SELLER': return <Users size={20} />;
      case 'PRODUCT': return <Package size={20} />;
      case 'NOTIFICATION': return <Bell size={20} />;
      case 'SECURITY': return <Shield size={20} />;
      default: return <Settings size={20} />;
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'GENERAL': return 'Genel Ayarlar';
      case 'EMAIL': return 'Email Ayarları';
      case 'PAYMENT': return 'Ödeme Ayarları';
      case 'SELLER': return 'Satıcı Ayarları';
      case 'PRODUCT': return 'Ürün Ayarları';
      case 'NOTIFICATION': return 'Bildirim Ayarları';
      case 'SECURITY': return 'Güvenlik Ayarları';
      default: return category;
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'STRING': return 'Metin';
      case 'BOOLEAN': return 'Evet/Hayır';
      case 'NUMBER': return 'Sayı';
      case 'JSON': return 'JSON';
      default: return type;
    }
  };

  const filteredSettings = settings.filter(setting => setting.category === activeCategory);

  const handleEdit = (setting) => {
    setEditingKey(setting.key);
    setEditValue(setting.value);
  };

  const handleSave = async (key) => {
    try {
      setSaving(true);
      const response = await fetch(`http://localhost:8082/api/admin/system-settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ value: editValue })
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => prev.map(s => s.key === key ? data.setting : s));
        setEditingKey(null);
        setEditValue('');
        toast.success('Ayar başarıyla güncellendi');
      } else {
        toast.error('Ayar güncellenemedi');
      }
    } catch (error) {
      console.error('Ayar güncellenirken hata:', error);
      toast.error('Ayar güncellenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const handleDelete = async (key) => {
    if (!window.confirm('Bu ayarı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8082/api/admin/system-settings/${key}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setSettings(prev => prev.filter(s => s.key !== key));
        toast.success('Ayar başarıyla silindi');
      } else {
        toast.error('Ayar silinemedi');
      }
    } catch (error) {
      console.error('Ayar silinirken hata:', error);
      toast.error('Ayar silinirken hata oluştu');
    }
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      const response = await fetch('http://localhost:8082/api/admin/system-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newSetting)
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => [...prev, data.setting]);
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
        toast.success('Ayar başarıyla oluşturuldu');
      } else {
        toast.error('Ayar oluşturulamadı');
      }
    } catch (error) {
      console.error('Ayar oluşturulurken hata:', error);
      toast.error('Ayar oluşturulurken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleInitializeDefaults = async () => {
    if (!window.confirm('Varsayılan ayarları oluşturmak istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('http://localhost:8082/api/admin/system-settings/initialize', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchSettings();
        toast.success('Varsayılan ayarlar başarıyla oluşturuldu');
      } else {
        toast.error('Varsayılan ayarlar oluşturulamadı');
      }
    } catch (error) {
      console.error('Varsayılan ayarlar oluşturulurken hata:', error);
      toast.error('Varsayılan ayarlar oluşturulurken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const renderValueInput = (setting) => {
    if (setting.type === 'BOOLEAN') {
      return (
        <select
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="setting-input"
        >
          <option value="true">Evet</option>
          <option value="false">Hayır</option>
        </select>
      );
    } else if (setting.type === 'NUMBER') {
      return (
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="setting-input"
        />
      );
    } else {
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="setting-input"
        />
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-system-settings">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Ayarlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-system-settings">
      <PageTitle title="Sistem Ayarları" />
      <MetaTags 
        title="Sistem Ayarları"
        description="E-Ticaret platformu sistem ayarları yönetimi."
        keywords="sistem ayarları, admin, yönetim"
      />

      <div className="settings-header">
        <div className="header-content">
          <h1>Sistem Ayarları</h1>
          <p>Platform genelinde sistem ayarlarını yönetin</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleInitializeDefaults}
            disabled={saving}
          >
            <RefreshCw size={16} />
            Varsayılanları Oluştur
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
            Yeni Ayar
          </button>
        </div>
      </div>

      <div className="settings-content">
        {/* Kategori Seçimi */}
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {getCategoryIcon(category)}
              <span>{getCategoryName(category)}</span>
            </button>
          ))}
        </div>

        {/* Ayarlar Listesi */}
        <div className="settings-list">
          {filteredSettings.length === 0 ? (
            <div className="empty-state">
              <Settings size={48} />
              <p>Bu kategoride ayar bulunamadı</p>
            </div>
          ) : (
            filteredSettings.map(setting => (
              <div key={setting.key} className="setting-item">
                <div className="setting-info">
                  <div className="setting-header">
                    <h3>{setting.description}</h3>
                    <span className="setting-key">{setting.key}</span>
                  </div>
                  <div className="setting-details">
                    <span className="setting-type">{getTypeName(setting.type)}</span>
                    <span className="setting-category">{getCategoryName(setting.category)}</span>
                  </div>
                  {setting.defaultValue && (
                    <div className="setting-default">
                      <span>Varsayılan: {setting.defaultValue}</span>
                    </div>
                  )}
                </div>

                <div className="setting-value">
                  {editingKey === setting.key ? (
                    <div className="edit-mode">
                      {renderValueInput(setting)}
                      <div className="edit-actions">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleSave(setting.key)}
                          disabled={saving}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancel}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="view-mode">
                      <span className="value-display">
                        {setting.type === 'BOOLEAN' ? (setting.value === 'true' ? 'Evet' : 'Hayır') : setting.value}
                      </span>
                      <div className="value-actions">
                        {setting.editable && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEdit(setting)}
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(setting.key)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Yeni Ayar Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Yeni Ayar Oluştur</h3>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label>Ayar Anahtarı</label>
                <input
                  type="text"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="örn: site.name"
                />
              </div>

              <div className="form-group">
                <label>Açıklama</label>
                <input
                  type="text"
                  value={newSetting.description}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ayar açıklaması"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kategori</label>
                  <select
                    value={newSetting.category}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {getCategoryName(category)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tip</label>
                  <select
                    value={newSetting.type}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="STRING">Metin</option>
                    <option value="BOOLEAN">Evet/Hayır</option>
                    <option value="NUMBER">Sayı</option>
                    <option value="JSON">JSON</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Değer</label>
                <input
                  type="text"
                  value={newSetting.value}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Ayar değeri"
                />
              </div>

              <div className="form-group">
                <label>Varsayılan Değer</label>
                <input
                  type="text"
                  value={newSetting.defaultValue}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, defaultValue: e.target.value }))}
                  placeholder="Varsayılan değer"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newSetting.editable}
                    onChange={(e) => setNewSetting(prev => ({ ...prev, editable: e.target.checked }))}
                  />
                  Düzenlenebilir
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                İptal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={saving || !newSetting.key || !newSetting.description}
              >
                <Save size={16} />
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSystemSettings;
