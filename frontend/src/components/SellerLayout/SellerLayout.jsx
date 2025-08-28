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
  Bell
} from "lucide-react";
import "./SellerLayout.css";
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
      path: "/seller-panel/settings",
      name: "Ayarlar",
      icon: Settings
    },
    {
      path: "/seller-panel/notifications",
      name: "Bildirimler",
      icon: Bell,
      badge: 3
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
    <div className="seller-layout">
      {/* Sidebar */}
      <div className={`seller-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Store size={32} />
            <span>Seller Panel</span>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="customer-btn" onClick={handleNavigateToCustomer}>
            <Store size={20} />
            <span>Mağaza</span>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="seller-main">
        {/* Page Content */}
        <main className="seller-content">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SellerLayout; 