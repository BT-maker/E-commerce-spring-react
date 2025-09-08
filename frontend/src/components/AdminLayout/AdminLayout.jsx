import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  User,
  Mail,
  FolderOpen
} from "lucide-react";

import toast from 'react-hot-toast';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: LayoutDashboard
    },
    {
      path: "/admin/users",
      name: "Kullanıcı Yönetimi",
      icon: Users
    },
    {
      path: "/admin/sellers",
      name: "Satıcı Yönetimi",
      icon: Store
    },
    {
      path: "/admin/categories",
      name: "Kategori Yönetimi",
      icon: FolderOpen
    },
    {
      path: "/admin/products",
      name: "Ürün Yönetimi",
      icon: Package
    },
    {
      path: "/admin/orders",
      name: "Sipariş Yönetimi",
      icon: ShoppingCart
    },
    {
      path: "/admin/financial",
      name: "Finansal Yönetim",
      icon: DollarSign
    },
    {
      path: "/admin/reports",
      name: "Raporlar",
      icon: BarChart3
    },
    {
      path: "/admin/email",
      name: "Email Yönetimi",
      icon: Mail
    },
    {
      path: "/admin/notifications",
      name: "Bildirimler",
      icon: Bell
    },
    {
      path: "/admin/settings",
      name: "Sistem Ayarları",
      icon: Settings
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Başarıyla çıkış yapıldı");
      navigate("/admin/login");
    } catch (error) {
      toast.error("Çıkış yapılırken hata oluştu");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-xl transform transition-all duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-11 h-11 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                    <p className="text-xs text-gray-600">Yönetim Merkezi</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-3 space-y-1">
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Ana Menü
                </h3>
                <div className="space-y-1">
                  {menuItems.slice(0, 6).map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`group w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
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
                        <span className="font-medium text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Yönetim
                </h3>
                <div className="space-y-1">
                  {menuItems.slice(6, 10).map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`group w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
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
                        <span className="font-medium text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Sistem
                </h3>
                <div className="space-y-1">
                  {menuItems.slice(10).map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`group w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
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
                        <span className="font-medium text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <button
                onClick={handleLogout}
                className="group w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-red-600 hover:bg-red-100 transition-all duration-200 hover:shadow-md"
              >
                <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-200">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <span className="font-medium text-sm">Çıkış Yap</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-white">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
