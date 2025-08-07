import React, { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CategoryModal = ({ show, onClose, onSave, initial }) => {
  const [name, setName] = useState("");
  useEffect(() => {
    setName(initial ? initial.name : "");
  }, [initial, show]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
        <h3 className="text-xl font-bold mb-4">{initial ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}</h3>
        <form onSubmit={e => { e.preventDefault(); onSave(name); }} className="flex flex-col gap-3">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Kategori adı"
            className="border rounded px-3 py-2"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-semibold mt-2">Kaydet</button>
        </form>
      </div>
    </div>
  );
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState(null);
  const [modalType, setModalType] = useState("add");

  const fetchCategories = () => {
    setLoading(true);
    fetch("http://localhost:8082/api/categories")
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Kategoriler alınamadı");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleModalSave = (name) => {
    if (modalType === "add") {
      fetch("http://localhost:8082/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        credentials: "include"
      })
        .then(() => {
          setModalOpen(false);
          fetchCategories();
        });
    } else if (modalType === "edit" && modalInitial) {
      fetch(`http://localhost:8082/api/categories/${modalInitial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        credentials: "include"
      })
        .then(() => {
          setModalOpen(false);
          setModalInitial(null);
          fetchCategories();
        });
    }
  };

  const handleEdit = (cat) => {
    setModalType("edit");
    setModalInitial(cat);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setModalType("add");
    setModalInitial(null);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;
    fetch(`http://localhost:8082/api/categories/${id}`, {
      method: "DELETE",
      credentials: "include"
    }).then(() => fetchCategories());
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Kategoriler</h3>
      <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded font-semibold mb-6">+ Yeni Kategori</button>
      <CategoryModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        initial={modalInitial}
      />
      {loading ? (
        <div className="space-y-4">
          <Skeleton height={40} width={150} className="mb-6" />
          <div className="space-y-2">
            <Skeleton height={50} width="100%" />
            <Skeleton height={50} width="100%" />
            <Skeleton height={50} width="100%" />
            <Skeleton height={50} width="100%" />
            <Skeleton height={50} width="100%" />
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full text-left border-t">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th>Adı</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b">
                <td className="py-2">{cat.id}</td>
                <td>{cat.name}</td>
                <td>
                  <button onClick={() => handleEdit(cat)} className="text-green-700 font-semibold mr-2">Düzenle</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 font-semibold">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCategories;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Kategori Yönetimi: Admin panelinde kategori CRUD işlemleri
 * 2. Kategori Listeleme: Tüm kategorileri tablo formatında görüntüleme
 * 3. Kategori Ekleme: Yeni kategori oluşturma modalı
 * 4. Kategori Düzenleme: Mevcut kategorileri güncelleme
 * 5. Kategori Silme: Kategorileri kaldırma işlemi
 * 6. Loading States: Yükleme durumları için skeleton animasyonları
 * 7. Error Handling: Hata durumlarının yönetimi
 * 
 * Bu component sayesinde admin kullanıcıları ürün kategorilerini tam olarak yönetebilir!
 */ 