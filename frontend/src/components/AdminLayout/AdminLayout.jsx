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
import "./AdminLayout.css";
import toast from 'react-hot-toast';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

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
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Shield size={32} />
            <span>Admin Panel</span>
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
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Header */}
        

        {/* Page Content */}
        <main className="admin-content items-center">
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

export default AdminLayout;
