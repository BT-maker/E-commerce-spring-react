import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { 
  FaChartBar, 
  FaBoxOpen, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaShoppingCart,
  FaExclamationTriangle,
  FaStar,
  FaEye,
  FaTimes
} from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';

const SellerPanel = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    name: "", 
    price: "", 
    stock: "", 
    description: "", 
    imageUrl: "", 
    imageUrl1: "", 
    imageUrl2: "", 
    imageUrl3: "", 
    imageUrl4: "", 
    imageUrl5: "", 
    categoryId: "" 
  });
  const [editId, setEditId] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [storeError, setStoreError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountForm, setDiscountForm] = useState({ discountPercentage: "", endDate: "" });

  // Mağaza, ürünler ve kategorileri getir
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [storeRes, prodRes, catRes] = await Promise.all([
          api.get("/seller/store").catch(e => e.response),
          api.get("/seller/products").catch(e => e.response),
          api.get("/categories").catch(e => e.response)
        ]);
        if (storeRes?.status === 401 || prodRes?.status === 401) {
          setError("Bu sayfaya erişim için satıcı olarak giriş yapmalısınız.");
        } else {
          setStore(storeRes?.data);
          setStoreName(storeRes?.data?.name || "");
          setProducts(Array.isArray(prodRes?.data) ? prodRes.data : []);
          setCategories(Array.isArray(catRes?.data) ? catRes.data : []);
        }
      } catch (err) {
        setError("Mağaza, ürünler veya kategoriler alınamadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (activeTab === "stats") {
      setStatsLoading(true);
      setStatsError("");
      api.get("/seller/stats")
        .then(res => setStats(res.data))
        .catch(() => setStatsError("İstatistikler alınamadı."))
        .finally(() => setStatsLoading(false));
    }
  }, [activeTab]);

  // Mağaza oluştur
  const handleCreateStore = async (e) => {
    e.preventDefault();
    setStoreError("");
    try {
      const res = await api.post(`/seller/store?name=${encodeURIComponent(storeName)}`);
      setStore(res.data);
    } catch (err) {
      setStoreError("Mağaza oluşturulamadı. Bu isimde mağaza olabilir.");
    }
  };

  // Ürün ekle/güncelle
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: form.categoryId || null
      };

      if (editId) {
        await api.put(`/seller/products/${editId}`, payload);
      } else {
        await api.post("/seller/products", payload);
      }

      // Ürünleri yeniden yükle
      const prodRes = await api.get("/seller/products");
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      
      setShowForm(false);
      setEditId(null);
      setForm({ 
        name: "", 
        price: "", 
        stock: "", 
        description: "", 
        imageUrl: "", 
        imageUrl1: "", 
        imageUrl2: "", 
        imageUrl3: "", 
        imageUrl4: "", 
        imageUrl5: "", 
        categoryId: "" 
      });
    } catch (err) {
      console.error('Ürün kaydetme hatası:', err);
      alert('Ürün kaydedilirken bir hata oluştu.');
    }
  };

  // Ürün düzenle
  const handleEdit = (product) => {
    setEditId(product.id);
    setForm({
      name: product.name || "",
      price: product.price || "",
      stock: product.stock || "",
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      imageUrl1: product.imageUrl1 || "",
      imageUrl2: product.imageUrl2 || "",
      imageUrl3: product.imageUrl3 || "",
      imageUrl4: product.imageUrl4 || "",
      imageUrl5: product.imageUrl5 || "",
      categoryId: product.categoryId || ""
    });
    setShowForm(true);
  };

  // Ürün sil
  const handleDelete = async (productId) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await api.delete(`/seller/products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Ürün silme hatası:', err);
      alert('Ürün silinirken bir hata oluştu.');
    }
  };

  // İndirim ekle
  const handleAddDiscount = (product) => {
    setSelectedProduct(product);
    setDiscountForm({ discountPercentage: "", endDate: "" });
    setShowDiscountModal(true);
  };

  // İndirim kaydet
  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/seller/products/${selectedProduct.id}/discount`, {
        discountPercentage: Number(discountForm.discountPercentage),
        endDate: discountForm.endDate || null
      });
      
      // Ürünleri güncelle
      const prodRes = await api.get("/seller/products");
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      
      setShowDiscountModal(false);
      setSelectedProduct(null);
      setDiscountForm({ discountPercentage: "", endDate: "" });
    } catch (err) {
      console.error('İndirim ekleme hatası:', err);
      alert('İndirim eklenirken bir hata oluştu.');
    }
  };

  // İndirim kaldır
  const handleRemoveDiscount = async (productId) => {
    if (!window.confirm("İndirimi kaldırmak istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/seller/products/${productId}/discount`);
      
      // Ürünleri güncelle
      const prodRes = await api.get("/seller/products");
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
    } catch (error) {
      console.error('İndirim kaldırma hatası:', error);
      alert('İndirim kaldırılırken hata oluştu!');
    }
  };

  if (authLoading || loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!user || user.role !== "SELLER") return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold">Bu sayfaya sadece satıcılar erişebilir.</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center py-12">
        <div className="text-red-600 text-lg font-semibold">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageTitle title="Mağaza Paneli" />
      <MetaTags 
        title="Mağaza Paneli"
        description="Mağazanızı yönetin. Ürünlerinizi ekleyin, düzenleyin ve satış istatistiklerinizi takip edin."
        keywords="mağaza paneli, satıcı paneli, ürün yönetimi, satış istatistikleri"
      />
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mağaza Paneli</h1>
              <p className="text-orange-100">Mağazanızı yönetin ve satışlarınızı takip edin</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm">
                <FaBoxOpen className="text-orange-200" />
                <span>Toplam {products.length} ürün</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Toplam Ürün</p>
                  <p className="text-2xl font-bold text-blue-900">{products.length}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-lg">
                  <FaBoxOpen className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Aktif Ürün</p>
                  <p className="text-2xl font-bold text-green-900">
                    {products.filter(p => p.status === 'ACTIVE').length}
                  </p>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <FaBoxOpen className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Düşük Stok</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {products.filter(p => p.stock <= 10).length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-500 rounded-lg">
                  <FaExclamationTriangle className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">İndirimli Ürün</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {products.filter(p => p.isDiscountActive).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-500 rounded-lg">
                  <FaStar className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button 
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "dashboard" 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <FaBoxOpen />
              <span>Dashboard</span>
            </button>
            <button 
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "products" 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab("products")}
            >
              <FaBoxOpen />
              <span>Ürünler</span>
            </button>
            <button 
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "stats" 
                  ? 'border-orange-500 text-orange-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab("stats")}
            >
              <FaChartBar />
              <span>İstatistikler</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div>
              {!store ? (
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Mağaza Oluştur</h3>
                    <form onSubmit={handleCreateStore} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mağaza Adı:</label>
                        <input
                          type="text"
                          value={storeName}
                          onChange={e => setStoreName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                          required
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Mağaza Oluştur
                      </button>
                      {storeError && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                          {storeError}
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Welcome Section */}
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-orange-900 mb-2">Hoş Geldiniz!</h2>
                        <p className="text-orange-700">Mağazanız: <span className="font-semibold">{store.name}</span></p>
                        <p className="text-orange-600 text-sm mt-1">{new Date().toLocaleDateString('tr-TR')}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-orange-900">{products.length}</div>
                        <div className="text-orange-700 text-sm">Toplam Ürün</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Hızlı İşlemler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button
                        onClick={() => setActiveTab("products")}
                        className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors"
                      >
                        <FaPlus className="text-blue-600 text-2xl mx-auto mb-2" />
                        <div className="font-semibold text-blue-900">Yeni Ürün Ekle</div>
                      </button>
                      
                      <button
                        onClick={() => setActiveTab("stats")}
                        className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors"
                      >
                        <FaChartBar className="text-green-600 text-2xl mx-auto mb-2" />
                        <div className="font-semibold text-green-900">İstatistikleri Görüntüle</div>
                      </button>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <FaExclamationTriangle className="text-yellow-600 text-2xl mx-auto mb-2" />
                        <div className="font-semibold text-yellow-900">Düşük Stok Uyarıları</div>
                        <div className="text-yellow-700 text-sm mt-1">
                          {products.filter(p => p.stock <= 10).length} ürün
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                        <FaStar className="text-purple-600 text-2xl mx-auto mb-2" />
                        <div className="font-semibold text-purple-900">İndirimli Ürünler</div>
                        <div className="text-purple-700 text-sm mt-1">
                          {products.filter(p => p.isDiscountActive).length} ürün
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Products */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Son Eklenen Ürünler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.slice(0, 6).map((product) => (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.imageUrl || product.imageUrl1 || '/img/default-product.png'}
                              alt={product.name}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src = '/img/default-product.png';
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                              <p className="text-sm text-gray-600">
                                Stok: {product.stock} adet
                              </p>
                              <p className="text-sm font-medium text-orange-600">
                                {Number(product.price).toLocaleString('tr-TR')} ₺
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              {!store ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg font-semibold">Önce mağaza oluşturmalısınız.</div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Mağaza:</span>
                      <span className="text-lg font-bold text-orange-600">{store.name}</span>
                    </div>
                    <button
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                      onClick={() => { 
                        setShowForm(true); 
                        setEditId(null); 
                        setForm({ 
                          name: "", 
                          price: "", 
                          stock: "", 
                          description: "", 
                          imageUrl: "", 
                          imageUrl1: "", 
                          imageUrl2: "", 
                          imageUrl3: "", 
                          imageUrl4: "", 
                          imageUrl5: "", 
                          categoryId: "" 
                        }); 
                      }}
                    >
                      <FaPlus />
                      <span>Yeni Ürün</span>
                    </button>
                  </div>

                  {showForm && (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">
                        {editId ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
                      </h3>
                      <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                              required 
                              value={form.name} 
                              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat</label>
                            <input 
                              type="number" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                              required 
                              min={0} 
                              value={form.price} 
                              onChange={e => setForm(f => ({ ...f, price: e.target.value }))} 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stok</label>
                            <input 
                              type="number" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                              required 
                              min={0} 
                              value={form.stock} 
                              onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                              required
                              value={form.categoryId}
                              onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                            >
                              <option value="">Kategori Seçin</option>
                              {Array.isArray(categories) && categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                            rows={3} 
                            value={form.description} 
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                          />
                        </div>
                        <div className="flex gap-3">
                          <button 
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                          >
                            {editId ? "Güncelle" : "Ekle"}
                          </button>
                          <button 
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg font-semibold transition-colors" 
                            onClick={() => { setShowForm(false); setEditId(null); }}
                          >
                            İptal
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="py-3 px-4 text-left font-semibold text-gray-700">Ürün</th>
                          <th className="py-3 px-4 text-center font-semibold text-gray-700">Fiyat</th>
                          <th className="py-3 px-4 text-center font-semibold text-gray-700">İndirim</th>
                          <th className="py-3 px-4 text-center font-semibold text-gray-700">Stok</th>
                          <th className="py-3 px-4 text-center font-semibold text-gray-700">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                            <td className="py-3 px-4 text-center">
                              <div>
                                {product.isDiscountActive ? (
                                  <>
                                    <span className="line-through text-gray-500 text-xs">
                                      {Number(product.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                                    </span>
                                    <br />
                                    <span className="text-red-600 font-bold">
                                      {Number(product.discountedPrice).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                                    </span>
                                    <br />
                                    <span className="text-xs text-red-600">%{product.discountPercentage} İndirim</span>
                                  </>
                                ) : (
                                  <span className="font-medium text-gray-900">
                                    {Number(product.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {product.isDiscountActive ? (
                                <div className="text-center">
                                  <span className="text-red-600 font-bold">%{product.discountPercentage}</span>
                                  <br />
                                  <button 
                                    className="text-xs text-red-600 underline hover:text-red-700 transition-colors"
                                    onClick={() => handleRemoveDiscount(product.id)}
                                  >
                                    Kaldır
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  className="text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors"
                                  onClick={() => handleAddDiscount(product)}
                                >
                                  İndirim Ekle
                                </button>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.stock > 10 ? 'bg-green-100 text-green-800' :
                                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {product.stock}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors" 
                                  onClick={() => handleEdit(product)}
                                >
                                  Düzenle
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors" 
                                  onClick={() => handleDelete(product.id)}
                                >
                                  Sil
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Satıcı İstatistikleri</h2>
              {statsLoading ? (
                <div className="space-y-8">
                  <div className="flex flex-wrap gap-8 justify-center">
                    <Skeleton height={120} width={180} className="rounded-lg" />
                    <Skeleton height={120} width={180} className="rounded-lg" />
                  </div>
                  <div>
                    <Skeleton height={32} width={200} className="mb-4" />
                    <div className="space-y-2">
                      <Skeleton height={40} width="100%" />
                      <Skeleton height={40} width="100%" />
                      <Skeleton height={40} width="100%" />
                    </div>
                  </div>
                </div>
              ) : statsError ? (
                <div className="text-center py-12">
                  <div className="text-red-500 text-lg font-semibold">{statsError}</div>
                </div>
              ) : stats ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 text-center shadow-sm border border-green-200">
                      <div className="text-lg font-semibold text-gray-700 mb-2">Toplam Satış</div>
                      <div className="text-3xl font-bold text-green-700">{stats.totalSold ?? 0}</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center shadow-sm border border-blue-200">
                      <div className="text-lg font-semibold text-gray-700 mb-2">Toplam Gelir</div>
                      <div className="text-3xl font-bold text-blue-700">
                        {Number(stats.totalRevenue ?? 0).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Günlük Satışlar</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-3 px-4 text-left font-semibold text-gray-700">Tarih</th>
                            <th className="py-3 px-4 text-center font-semibold text-gray-700">Satış Adedi</th>
                            <th className="py-3 px-4 text-center font-semibold text-gray-700">Gelir</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(stats.dailySales ?? []).map(([date, qty, revenue], i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 font-medium text-gray-900">{date}</td>
                              <td className="py-3 px-4 text-center">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {qty}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center font-medium text-gray-900">
                                {Number(revenue).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">En Çok Satan Ürünler</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-3 px-4 text-left font-semibold text-gray-700">Ürün</th>
                            <th className="py-3 px-4 text-center font-semibold text-gray-700">Satış Adedi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(stats.bestSellers ?? []).map(([name, qty], i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 font-medium text-gray-900">{name}</td>
                              <td className="py-3 px-4 text-center">
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {qty}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg font-semibold">İstatistik verisi yok.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* İndirim Modal */}
      {showDiscountModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900">İndirim Ekle</h3>
            <p className="text-sm text-gray-600 mb-6">
              <strong className="text-gray-900">{selectedProduct.name}</strong> ürünü için indirim ayarlayın
            </p>
            
            <form onSubmit={handleDiscountSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İndirim Yüzdesi (%)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="100" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                  required 
                  value={discountForm.discountPercentage} 
                  onChange={e => setDiscountForm(f => ({ ...f, discountPercentage: e.target.value }))} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bitiş Tarihi (Opsiyonel)</label>
                <input 
                  type="datetime-local" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                  value={discountForm.endDate} 
                  onChange={e => setDiscountForm(f => ({ ...f, endDate: e.target.value }))} 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Boş bırakırsanız indirim süresiz olur
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  İndirim Ekle
                </button>
                <button 
                  type="button" 
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                  onClick={() => {
                    setShowDiscountModal(false);
                    setSelectedProduct(null);
                    setDiscountForm({ discountPercentage: "", endDate: "" });
                  }}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPanel;
