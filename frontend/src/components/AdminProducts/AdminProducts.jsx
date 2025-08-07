// Admin panelde ürünleri listeleme, arama ve ekleme işlemleri

import React, { useEffect, useState } from "react";
import ProductModal from "../ProductModal/ProductModal";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PAGE_SIZE = 12;

const AdminProducts = () => {
  // State'ler
  const [products, setProducts] = useState([]); // API'den gelen ürünler
  const [categories, setCategories] = useState([]); // Kategori listesi
  const [loading, setLoading] = useState(true); // Yükleniyor durumu
  const [error, setError] = useState(""); // Hata mesajı
  const [modalOpen, setModalOpen] = useState(false); // Ürün ekle/düzenle modalı açık mı
  const [modalInitial, setModalInitial] = useState(null); // Modal için başlangıç verisi
  const [modalType, setModalType] = useState("add"); // Modal tipi (add/edit)
  const [page, setPage] = useState(0); // Aktif sayfa
  const [totalPages, setTotalPages] = useState(1); // Toplam sayfa
  const [searchTerm, setSearchTerm] = useState(""); // API'ye gönderilecek arama terimi
  const [searchInput, setSearchInput] = useState(""); // Inputtaki arama terimi

  // Ürünleri backend'den çeker, arama ve sayfalama destekler
  const fetchProducts = (page = 0, search = "") => {
    setLoading(true);
    let url = `http://localhost:8082/api/products?page=${page}&size=${PAGE_SIZE}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setError("Ürünler alınamadı");
        setLoading(false);
      });
  };

  // Kategorileri backend'den çeker
  const fetchCategories = () => {
    fetch("http://localhost:8082/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  // Sayfa veya arama terimi değiştiğinde ürünleri tekrar çek
  useEffect(() => {
    fetchProducts(page, searchTerm);
    fetchCategories();
  }, [page, searchTerm]);

  // Arama formu submit edildiğinde arama terimini state'e aktar
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setSearchTerm(searchInput);
  };

  // Modal kaydetme işlemleri (ekle/düzenle)
  const handleModalSave = (form) => {
    const body = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      imageUrl: form.imageUrl
    };

    if (modalType === "add") {
      fetch("http://localhost:8082/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include"
      })
        .then(() => {
          setModalOpen(false);
          fetchProducts(page, searchTerm);
        });
    } else if (modalType === "edit" && modalInitial) {
      fetch(`http://localhost:8082/api/products/${modalInitial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include"
      })
        .then(() => {
          setModalOpen(false);
          setModalInitial(null);
          fetchProducts(page, searchTerm);
        });
    }
  };

  // Ürün düzenleme modalını aç
  const handleEdit = (product) => {
    setModalType("edit");
    setModalInitial({
      ...product,
      categoryId: product.category.id
    });
    setModalOpen(true);
  };

  // Ürün ekleme modalını aç
  const handleAdd = () => {
    setModalType("add");
    setModalInitial(null);
    setModalOpen(true);
  };

  // Ürün silme işlemi
  const handleDelete = (id) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;
    fetch(`http://localhost:8082/api/products/${id}`, {
      method: "DELETE",
      credentials: "include"
    }).then(() => fetchProducts(page, searchTerm));
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Ürünler</h3>
      {/* Arama formu ve yeni ürün butonu */}
      <div className="flex items-center mb-6 space-x-4">
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded font-semibold">+ Yeni Ürün</button>
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ürün adına göre ara..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />
          <button type="submit" className="bg-gray-200 px-3 py-2 rounded font-semibold">Ara</button>
        </form>
      </div>
      <ProductModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        categories={categories}
        initial={modalInitial}
      />
      {/* Ürünler tablosu */}
      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center mb-6 space-x-4">
            <Skeleton height={40} width={120} />
            <div className="flex items-center space-x-2">
              <Skeleton height={40} width={250} />
              <Skeleton height={40} width={60} />
            </div>
          </div>
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
        <>
          <table className="w-full text-left border-t">
            <thead>
              <tr className="border-b">
                <th className="py-2">ID</th>
                <th>Adı</th>
                <th>Fiyat</th>
                <th>Kategori</th>
                <th>Resim</th>
                <th>Açıklama</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products && products.map(product => (
                <tr key={product.id} className="border-b">
                  <td className="py-2">{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category?.name}</td>
                  <td><img src={product.imageUrl} alt={product.name} className="w-14 h-14 object-contain bg-gray-100 rounded" /></td>
                  <td>{product.description}</td>
                  <td>
                    <button onClick={() => handleEdit(product)} className="text-green-700 font-semibold mr-2">Düzenle</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 font-semibold">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Sayfalama butonları */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`px-3 py-1 rounded font-semibold border ${page === i ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-300 hover:bg-green-50"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminProducts;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Ürün Yönetimi: Admin panelinde ürün CRUD işlemleri
 * 2. Ürün Listeleme: Tüm ürünleri tablo formatında görüntüleme
 * 3. Ürün Arama: İsme göre ürün arama fonksiyonu
 * 4. Ürün Ekleme: Yeni ürün oluşturma modalı
 * 5. Ürün Düzenleme: Mevcut ürünleri güncelleme
 * 6. Ürün Silme: Ürünleri kaldırma işlemi
 * 7. Sayfalama: Büyük veri setleri için sayfalama
 * 8. Loading States: Yükleme durumları için skeleton animasyonları
 * 
 * Bu component sayesinde admin kullanıcıları ürün yönetimini kapsamlı şekilde yapabilir!
 */ 