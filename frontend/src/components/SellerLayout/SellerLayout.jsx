import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  BarChart3,
  Gift,
  Settings,
  Store,
  LogOut,
  X,
  Bell,
  Menu
} from "lucide-react";

import toast from 'react-hot-toast';

const SellerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const menuItems = [
    {
      path: "/seller-panel",
      name: "Ana Sayfa",
      icon: LayoutDashboard
    },
    {
      path: "/seller-panel/products",
      name: "Ürünlerim",
      icon: Package
    },
    {
      path: "/seller-panel/orders",
      name: "Siparişler",
      icon: ShoppingCart
    },
    {
      path: "/seller-panel/stock",
      name: "Stok",
      icon: AlertTriangle
    },
    {
      path: "/seller-panel/statistics",
      name: "İstatistikler",
      icon: BarChart3
    },
    {
      path: "/seller-panel/campaigns",
      name: "Kampanyalar",
      icon: Gift
    },
    {
      path: "/seller-panel/notifications",
      name: "Bildirimler",
      icon: Bell
    },
    {
      path: "/seller-panel/settings",
      name: "Ayarlar",
      icon: Settings
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Başarıyla çıkış yapıldı");
      navigate("/seller/login");
    } catch (error) {
      toast.error("Çıkış yapılırken hata oluştu");
    }
  };

  const handleNavigateToCustomer = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between absolute top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center space-x-2">
            <Store size={28} className="text-orange-500" />
            <span className="font-semibold text-gray-900">Seller Panel</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Store size={32} className="text-orange-500" />
              <span className="text-xl font-bold text-gray-900">Seller Panel</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button 
              onClick={handleNavigateToCustomer}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Store size={20} />
              <span>Mağaza</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut size={20} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <main className="min-h-screen pt-16 lg:pt-0">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SellerLayout; 