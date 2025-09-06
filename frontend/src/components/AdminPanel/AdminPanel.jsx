import React, { useState, useEffect, useContext } from "react";
import AdminCategories from "../../pages/AdminCategories/AdminCategories";
import AdminProducts from "../../pages/AdminProducts/AdminProducts";
import AdminDashboard from "../../pages/AdminDashboard/AdminDashboard";
import AdminUsers from "../../pages/AdminUsers/AdminUsers";
import AdminOrders from "../../pages/AdminOrders/AdminOrders";
import AdminSellers from "../../pages/AdminSellers/AdminSellers";
import AdminReports from "../../pages/AdminReports/AdminReports";
import AdminEmail from "../../pages/AdminEmail/AdminEmail";
import AdminNotifications from "../../pages/AdminNotifications/AdminNotifications";
import AdminFinancial from "../../pages/AdminFinancial/AdminFinancial";
import AdminSystemSettings from "../../pages/AdminSystemSettings/AdminSystemSettings";
import { AuthContext } from "../../context/AuthContext";

import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';
import { 
  Shield, 
  Package, 
  Settings, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Bell, 
  LogOut,
  Menu,
  X,
  Home,
  Tag,
  FileText,
  Mail,
  DollarSign,
  UserCheck
} from 'lucide-react';

const AdminPanel = () => {
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    toast.success("Başarıyla çıkış yapıldı");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Erişim Engellendi</h2>
          <p className="text-white/70 mb-6">Bu sayfaya erişim yetkiniz yok.</p>
          <button 
            onClick={() => window.location.href = '/admin/login'}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, color: "blue" },
    { id: "categories", label: "Kategoriler", icon: Tag, color: "green" },
    { id: "products", label: "Ürünler", icon: Package, color: "purple" },
    { id: "orders", label: "Siparişler", icon: ShoppingCart, color: "orange" },
    { id: "users", label: "Kullanıcılar", icon: Users, color: "indigo" },
    { id: "analytics", label: "Analitik", icon: BarChart3, color: "pink" },
    { id: "notifications", label: "Bildirimler", icon: Bell, color: "yellow" },
    { id: "emails", label: "E-posta", icon: Mail, color: "red" },
    { id: "financial", label: "Finansal", icon: DollarSign, color: "emerald" },
    { id: "sellers", label: "Satıcılar", icon: UserCheck, color: "cyan" },
    { id: "reports", label: "Raporlar", icon: FileText, color: "amber" },
    { id: "settings", label: "Ayarlar", icon: Settings, color: "gray" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <PageTitle title="Admin Paneli" />
      <MetaTags 
        title="Admin Paneli"
        description="Sistem yönetimi. Kategorileri ve ürünleri yönetin. Platform ayarlarını düzenleyin."
        keywords="admin paneli, yönetim, sistem yönetimi, kategori yönetimi"
      />
      
      <div className="flex h-screen">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 bg-orange-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                    <p className="text-sm text-gray-600">Yönetim Merkezi</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {user?.firstName?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-green-600 font-medium">Çevrimiçi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                  Ana Menü
                </h3>
                <div className="space-y-1">
                  {menuItems.slice(0, 6).map((item) => {
                    const Icon = item.icon;
                    const isActive = tab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          isActive 
                            ? 'bg-orange-500 text-white shadow-lg' 
                            : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${
                          isActive ? 'bg-white bg-opacity-20' : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                  Yönetim
                </h3>
                <div className="space-y-1">
                  {menuItems.slice(6, 10).map((item) => {
                    const Icon = item.icon;
                    const isActive = tab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          isActive 
                            ? 'bg-orange-500 text-white shadow-lg' 
                            : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${
                          isActive ? 'bg-white bg-opacity-20' : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                  Sistem
                </h3>
                <div className="space-y-1">
                  {menuItems.slice(10).map((item) => {
                    const Icon = item.icon;
                    const isActive = tab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          isActive 
                            ? 'bg-orange-500 text-white shadow-lg' 
                            : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${
                          isActive ? 'bg-white bg-opacity-20' : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 bg-red-50">
              <button
                onClick={handleLogout}
                className="group w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-100 transition-all duration-200 hover:shadow-md"
              >
                <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <span className="font-medium">Çıkış Yap</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {menuItems.find(item => item.id === tab)?.label || 'Dashboard'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {tab === 'dashboard' && 'Sistem genel bakış ve istatistikler'}
                    {tab === 'categories' && 'Kategori yönetimi ve düzenleme'}
                    {tab === 'products' && 'Ürün ekleme, düzenleme ve yönetimi'}
                    {tab === 'orders' && 'Sipariş takibi ve yönetimi'}
                    {tab === 'users' && 'Kullanıcı hesapları ve yetkilendirme'}
                    {tab === 'analytics' && 'Satış analizi ve raporlar'}
                    {tab === 'notifications' && 'Sistem bildirimleri'}
                    {tab === 'emails' && 'E-posta yönetimi'}
                    {tab === 'financial' && 'Finansal raporlar ve ödemeler'}
                    {tab === 'sellers' && 'Satıcı hesap yönetimi'}
                    {tab === 'reports' && 'Detaylı sistem raporları'}
                    {tab === 'settings' && 'Sistem ayarları ve konfigürasyon'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {tab === "dashboard" && <AdminDashboard />}
              {tab === "categories" && <AdminCategories />}
              {tab === "products" && <AdminProducts />}
              {tab === "orders" && <AdminOrders />}
              {tab === "users" && <AdminUsers />}
              {tab === "sellers" && <AdminSellers />}
              {tab === "analytics" && <AdminReports />}
              {tab === "notifications" && <AdminNotifications />}
              {tab === "emails" && <AdminEmail />}
              {tab === "financial" && <AdminFinancial />}
              {tab === "reports" && <AdminReports />}
              {tab === "settings" && <AdminSystemSettings />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;