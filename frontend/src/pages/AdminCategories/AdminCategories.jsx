import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Package } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      toast.error('Kategoriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Güncelleme
        await api.put(`/categories/${editingCategory.id}`, formData);
        toast.success('Kategori başarıyla güncellendi');
      } else {
        // Yeni kategori ekleme
        await api.post('/categories', formData);
        toast.success('Kategori başarıyla eklendi');
      }
      
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', imageUrl: '' });
      fetchCategories();
    } catch (error) {
      console.error('Kategori işlemi hatası:', error);
      toast.error(editingCategory ? 'Kategori güncellenirken hata oluştu' : 'Kategori eklenirken hata oluştu');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/categories/${categoryId}`);
        toast.success('Kategori başarıyla silindi');
        fetchCategories();
      } catch (error) {
        console.error('Kategori silme hatası:', error);
        toast.error('Kategori silinirken hata oluştu');
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({ name: '', description: '', imageUrl: '' });
    setEditingCategory(null);
  };

  return (
    <div className="admin-categories">
      <div className="categories-header">
        <div className="header-left">
          <h1>Kategori Yönetimi</h1>
          <p>Ürün kategorilerini yönetin</p>
        </div>
        <button 
          className="add-category-btn"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={20} />
          Yeni Kategori
        </button>
      </div>

      <div className="categories-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Kategori ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-stats">
          <span>Toplam: {categories.length} kategori</span>
          <span>Gösterilen: {filteredCategories.length} kategori</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Kategoriler yükleniyor...</p>
        </div>
      ) : (
        <div className="categories-grid">
          {filteredCategories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-image">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} />
                ) : (
                  <div className="no-image">
                    <Package size={40} />
                  </div>
                )}
              </div>
              <div className="category-content">
                <h3>{category.name}</h3>
                <p>{category.description || 'Açıklama yok'}</p>
                <div className="category-stats">
                  <span>Ürün Sayısı: {category.productCount || 0}</span>
                </div>
              </div>
              <div className="category-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(category)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="name">Kategori Adı *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Kategori adını girin"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Açıklama</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Kategori açıklaması (opsiyonel)"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="imageUrl">Resim URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  İptal
                </button>
                <button type="submit" className="save-btn">
                  {editingCategory ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
