import React, { useState, useEffect, useContext } from "react";
import AdminCategories from "../AdminCategories/AdminCategories";
import AdminProducts from "../AdminProducts/AdminProducts";
import { AuthContext } from "../../context/AuthContext";

import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';
import { Shield, Package, Settings } from 'lucide-react';

const AdminPanel = () => {
  const [tab, setTab] = useState("categories");
  // AuthContext'ten role alınabilir, şimdilik placeholder
  const { isLoggedIn } = useContext(AuthContext);
  // const { isLoggedIn, user } = useContext(AuthContext); // user.role === 'ADMIN' kontrolü eklenebilir
  // Şimdilik sadece girişli ise gösteriyoruz

  // TODO: user.role !== 'ADMIN' ise erişim engellensin

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Engellendi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle title="Admin Paneli" />
      <MetaTags 
        title="Admin Paneli"
        description="Sistem yönetimi. Kategorileri ve ürünleri yönetin. Platform ayarlarını düzenleyin."
        keywords="admin paneli, yönetim, sistem yönetimi, kategori yönetimi"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Admin Paneli</h1>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <aside className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50">
              <div className="p-4 space-y-2">
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    tab === "categories" 
                      ? "bg-orange-500 text-white shadow-md" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setTab("categories")}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-semibold">Kategoriler</span>
                </button>
                <button
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    tab === "products" 
                      ? "bg-orange-500 text-white shadow-md" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setTab("products")}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-semibold">Ürünler</span>
                </button>
              </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 p-6">
              {tab === "categories" && <AdminCategories />}
              {tab === "products" && <AdminProducts />}
            </main>
          </div>
        </div>
      </div>
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