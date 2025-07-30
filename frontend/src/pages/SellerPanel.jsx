import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { FaChartBar, FaBoxOpen } from "react-icons/fa";
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
  const [form, setForm] = useState({ name: "", price: "", stock: "", description: "", imageUrl: "", categoryId: "" });
  const [editId, setEditId] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [storeError, setStoreError] = useState("");
  const [activeTab, setActiveTab] = useState("products");
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
        category: { id: form.categoryId }
      };
      if (editId) {
        await api.put(`/seller/products/${editId}`, payload);
      } else {
        await api.post("/seller/products", payload);
      }
      setShowForm(false);
      setForm({ name: "", price: "", stock: "", description: "", imageUrl: "", categoryId: "" });
      setEditId(null);
      // Ürünleri güncelle
      const prodRes = await api.get("/seller/products");
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
    } catch {
      setError("Ürün kaydedilemedi.");
    }
  };

  // Ürün sil
  const handleDelete = async (id) => {
    if (!window.confirm("Ürünü silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/seller/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      setError("Ürün silinemedi.");
    }
  };

  // Ürün düzenle
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      imageUrl: product.imageUrl || "",
      categoryId: product.category?.id || ""
    });
    setEditId(product.id);
    setShowForm(true);
  };

  // İndirim modalını aç
  const handleAddDiscount = (product) => {
    setSelectedProduct(product);
    setDiscountForm({ 
      discountPercentage: "", 
      endDate: "" 
    });
    setShowDiscountModal(true);
  };

  // İndirim ekle
  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        discountPercentage: parseInt(discountForm.discountPercentage)
      };
      
      // Sadece tarih seçilmişse ekle
      if (discountForm.endDate && discountForm.endDate.trim() !== "") {
        payload.endDate = discountForm.endDate + ":00";
      }
      
      console.log('İndirim payload:', payload);
      
      const response = await api.post(`/seller/products/${selectedProduct.id}/discount`, payload);
      console.log('İndirim response:', response.data);
      
      // Ürünleri güncelle
      const prodRes = await api.get("/seller/products");
      console.log('Güncellenmiş ürünler:', prodRes.data);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
      
      setShowDiscountModal(false);
      setSelectedProduct(null);
      setDiscountForm({ discountPercentage: "", endDate: "" });
      alert('İndirim başarıyla eklendi!');
    } catch (error) {
      console.error('İndirim ekleme hatası:', error);
      console.error('Hata detayı:', error.response?.data);
      alert(`İndirim eklenirken hata oluştu: ${error.response?.data?.error || error.message}`);
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
    <div className="flex flex-col sm:flex-row max-w-6xl mx-auto mt-6 sm:mt-10 bg-white rounded-xl shadow min-h-[600px]">
      <aside className="w-full sm:w-56 border-b sm:border-b-0 sm:border-r bg-gray-50 rounded-t-xl sm:rounded-l-xl flex flex-row sm:flex-col py-4 sm:py-8 px-4 gap-2 sm:gap-0">
        <Skeleton height={40} width={120} className="mb-2" />
        <Skeleton height={40} width={120} />
      </aside>
      <div className="flex-1 p-4 sm:p-8">
        <Skeleton height={32} width={200} className="mx-auto mb-6" />
        <div className="space-y-4">
          <Skeleton height={60} width="100%" />
          <Skeleton height={60} width="100%" />
          <Skeleton height={60} width="100%" />
        </div>
      </div>
    </div>
  );
  if (!user || user.role !== "SELLER") return <div className="text-center mt-10 text-red-600">Bu sayfaya sadece satıcılar erişebilir.</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col sm:flex-row max-w-6xl mx-auto mt-6 sm:mt-10 bg-white rounded-xl shadow min-h-[600px]">
      <PageTitle title="Mağaza Paneli" />
      <MetaTags 
        title="Mağaza Paneli"
        description="Mağazanızı yönetin. Ürünlerinizi ekleyin, düzenleyin ve satış istatistiklerinizi takip edin."
        keywords="mağaza paneli, satıcı paneli, ürün yönetimi, satış istatistikleri"
      />
      {/* Sidebar */}
      <aside className="w-full sm:w-56 border-b sm:border-b-0 sm:border-r bg-gray-50 rounded-t-xl sm:rounded-l-xl flex flex-row sm:flex-col py-4 sm:py-8 px-4 gap-2 sm:gap-0">
        <button
          className={`flex items-center gap-2 px-4 py-2 mb-2 rounded font-semibold text-left ${activeTab === "products" ? "bg-green-600 text-white" : "hover:bg-green-50"}`}
          onClick={() => setActiveTab("products")}
        >
          <FaBoxOpen /> Ürünler
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 mb-2 rounded font-semibold text-left ${activeTab === "stats" ? "bg-green-600 text-white" : "hover:bg-green-50"}`}
          onClick={() => setActiveTab("stats")}
        >
          <FaChartBar /> İstatistikler
        </button>
      </aside>
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-8">
        {activeTab === "products" && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Satıcı Paneli</h2>
            {!store ? (
              <form onSubmit={handleCreateStore} className="max-w-md mx-auto mb-8">
                <label className="block mb-2 font-semibold">Mağaza Adı:</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full border px-3 py-2 rounded mb-2"
                  required
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold">Mağaza Oluştur</button>
                {storeError && <div className="text-red-600 mt-2">{storeError}</div>}
              </form>
            ) : (
              <>
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <span className="font-semibold">Mağaza:</span> <span className="text-lg text-green-700 font-bold">{store.name}</span>
                  </div>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
                    onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", price: "", stock: "", description: "", imageUrl: "", categoryId: "" }); }}
                  >
                    + Yeni Ürün
                  </button>
                </div>
                {showForm && (
                  <form onSubmit={handleFormSubmit} className="mb-8 bg-gray-50 p-4 rounded border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 font-semibold">Ürün Adı</label>
                        <input type="text" className="w-full border px-3 py-2 rounded" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold">Fiyat</label>
                        <input type="number" className="w-full border px-3 py-2 rounded" required min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold">Stok</label>
                        <input type="number" className="w-full border px-3 py-2 rounded" required min={0} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold">Kategori</label>
                        <select
                          className="w-full border px-3 py-2 rounded"
                          required
                          value={form.categoryId}
                          onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                        >
                          <option value="">Kategori Seçin</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold">Görsel URL</label>
                        <input type="text" className="w-full border px-3 py-2 rounded" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block mb-1 font-semibold">Açıklama</label>
                        <textarea className="w-full border px-3 py-2 rounded" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold" type="submit">{editId ? "Güncelle" : "Ekle"}</button>
                      <button className="bg-gray-300 px-4 py-2 rounded font-semibold" type="button" onClick={() => { setShowForm(false); setEditId(null); }}>İptal</button>
                    </div>
                  </form>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-t border-b border-gray-300">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="py-2 px-4 text-left">Ürün</th>
                        <th className="py-2 px-4 text-center">Fiyat</th>
                        <th className="py-2 px-4 text-center">İndirim</th>
                        <th className="py-2 px-4 text-center">Stok</th>
                        <th className="py-2 px-4 text-center">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100">
                          <td className="py-2 px-4">{product.name}</td>
                          <td className="py-2 px-4 text-center">
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
                                <span>{Number(product.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-4 text-center">
                            {product.isDiscountActive ? (
                              <div className="text-center">
                                <span className="text-red-600 font-bold">%{product.discountPercentage}</span>
                                <br />
                                <button 
                                  className="text-xs text-red-600 underline"
                                  onClick={() => handleRemoveDiscount(product.id)}
                                >
                                  Kaldır
                                </button>
                              </div>
                            ) : (
                              <button 
                                className="text-green-600 font-semibold text-sm"
                                onClick={() => handleAddDiscount(product)}
                              >
                                İndirim Ekle
                              </button>
                            )}
                          </td>
                          <td className="py-2 px-4 text-center">{product.stock}</td>
                          <td className="py-2 px-4 text-center">
                            <button className="text-blue-600 font-semibold mr-2" onClick={() => handleEdit(product)}>Düzenle</button>
                            <button className="text-red-600 font-semibold" onClick={() => handleDelete(product.id)}>Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
        {activeTab === "stats" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Satıcı İstatistikleri</h2>
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
                <div>
                  <Skeleton height={32} width={250} className="mb-4" />
                  <div className="space-y-2">
                    <Skeleton height={40} width="100%" />
                    <Skeleton height={40} width="100%" />
                    <Skeleton height={40} width="100%" />
                  </div>
                </div>
              </div>
            ) : statsError ? (
              <div className="text-center text-red-500">{statsError}</div>
            ) : stats ? (
              <div className="space-y-8">
                <div className="flex flex-wrap gap-8 justify-center">
                  <div className="bg-green-50 rounded-lg p-6 min-w-[180px] text-center shadow">
                    <div className="text-lg font-semibold text-gray-700 mb-2">Toplam Satış</div>
                    <div className="text-3xl font-bold text-green-700">{stats.totalSold ?? 0}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 min-w-[180px] text-center shadow">
                    <div className="text-lg font-semibold text-gray-700 mb-2">Toplam Gelir</div>
                    <div className="text-3xl font-bold text-green-700">{Number(stats.totalRevenue ?? 0).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Günlük Satışlar</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-t border-b border-gray-300">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <th className="py-2 px-4">Tarih</th>
                          <th className="py-2 px-4">Satış Adedi</th>
                          <th className="py-2 px-4">Gelir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(stats.dailySales ?? []).map(([date, qty, revenue], i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="py-2 px-4">{date}</td>
                            <td className="py-2 px-4">{qty}</td>
                            <td className="py-2 px-4">{Number(revenue).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">En Çok Satan Ürünler</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-t border-b border-gray-300">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <th className="py-2 px-4">Ürün</th>
                          <th className="py-2 px-4">Satış Adedi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(stats.bestSellers ?? []).map(([name, qty], i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="py-2 px-4">{name}</td>
                            <td className="py-2 px-4">{qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">İstatistik verisi yok.</div>
            )}
          </div>
        )}
      </div>
      
      {/* İndirim Modal */}
      {showDiscountModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">İndirim Ekle</h3>
            <p className="text-sm text-gray-600 mb-4">
              <strong>{selectedProduct.name}</strong> ürünü için indirim ayarlayın
            </p>
            
            <form onSubmit={handleDiscountSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-semibold">İndirim Yüzdesi (%)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="100" 
                  className="w-full border px-3 py-2 rounded" 
                  required 
                  value={discountForm.discountPercentage} 
                  onChange={e => setDiscountForm(f => ({ ...f, discountPercentage: e.target.value }))} 
                />
              </div>
              
              <div className="mb-6">
                <label className="block mb-1 font-semibold">Bitiş Tarihi (Opsiyonel)</label>
                <input 
                  type="datetime-local" 
                  className="w-full border px-3 py-2 rounded" 
                  value={discountForm.endDate} 
                  onChange={e => setDiscountForm(f => ({ ...f, endDate: e.target.value }))} 
                />
                <p className="text-xs text-gray-500 mt-1">
                  Boş bırakırsanız indirim süresiz olur
                </p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  type="submit" 
                  className="bg-green-600 text-white px-4 py-2 rounded font-semibold flex-1"
                >
                  İndirim Ekle
                </button>
                <button 
                  type="button" 
                  className="bg-gray-300 px-4 py-2 rounded font-semibold flex-1"
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