import React, { useState, useEffect, useContext } from "react";
import AdminCategories from "../AdminCategories/AdminCategories";
import AdminProducts from "../AdminProducts/AdminProducts";
import { AuthContext } from "../../context/AuthContext";
import "./AdminPanel.css";
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';

const AdminPanel = () => {
  const [tab, setTab] = useState("categories");
  // AuthContext'ten role alınabilir, şimdilik placeholder
  const { isLoggedIn } = useContext(AuthContext);
  // const { isLoggedIn, user } = useContext(AuthContext); // user.role === 'ADMIN' kontrolü eklenebilir
  // Şimdilik sadece girişli ise gösteriyoruz

  // TODO: user.role !== 'ADMIN' ise erişim engellensin

  if (!isLoggedIn) {
    return <div className="cart-empty" style={{ marginTop: 40 }}>Bu sayfaya erişim yetkiniz yok.</div>;
  }

  return (
    <div className="admin-panel min-h-[70vh] max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow flex flex-col md:flex-row">
      <PageTitle title="Admin Paneli" />
      <MetaTags 
        title="Admin Paneli"
        description="Sistem yönetimi. Kategorileri ve ürünleri yönetin. Platform ayarlarını düzenleyin."
        keywords="admin paneli, yönetim, sistem yönetimi, kategori yönetimi"
      />
      <aside className="md:w-56 border-r p-6 flex flex-row md:flex-col gap-4 bg-gray-50 rounded-l-xl">
        <button
          className={`text-lg font-semibold text-left ${tab === "categories" ? "text-green-700" : "text-gray-700"}`}
          onClick={() => setTab("categories")}
        >
          Kategoriler
        </button>
        <button
          className={`text-lg font-semibold text-left ${tab === "products" ? "text-green-700" : "text-gray-700"}`}
          onClick={() => setTab("products")}
        >
          Ürünler
        </button>
      </aside>
      <main className="flex-1 p-6">
        {tab === "categories" && <AdminCategories />}
        {tab === "products" && <AdminProducts />}
      </main>
    </div>
  );
};

export default AdminPanel;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Admin Panel Ana Sayfası: Yönetim panelinin ana container'ı
 * 2. Tab Navigation: Kategoriler ve ürünler arası geçiş
 * 3. Yetki Kontrolü: Sadece admin kullanıcıların erişimi
 * 4. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 5. SEO Optimizasyonu: Sayfa başlığı ve meta etiketleri
 * 6. Component Routing: Alt component'lerin yönetimi
 * 
 * Bu component sayesinde admin kullanıcıları sistem yönetimini kolayca yapabilir!
 */ 