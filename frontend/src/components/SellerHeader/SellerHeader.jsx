import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaStore, FaSignOutAlt, FaBell, FaCog, FaUser, FaHome, FaBox, FaChartBar, FaGift, FaExclamationTriangle, FaClipboardList } from 'react-icons/fa';
import './SellerHeader.css';

const SellerHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/seller/login');
  };

  const handleNavigateToCustomer = () => {
    navigate('/');
  };

  const menuItems = [
    { path: '/seller-panel', icon: <FaHome />, label: 'Ana Sayfa' },
    { path: '/seller-panel/products', icon: <FaBox />, label: 'Ürünlerim' },
    { path: '/seller-panel/orders', icon: <FaClipboardList />, label: 'Siparişler' },
    { path: '/seller-panel/stock', icon: <FaExclamationTriangle />, label: 'Stok' },
    { path: '/seller-panel/statistics', icon: <FaChartBar />, label: 'İstatistikler' },
    { path: '/seller-panel/campaigns', icon: <FaGift />, label: 'Kampanyalar' },
    { path: '/seller-panel/settings', icon: <FaCog />, label: 'Ayarlar' }
  ];

  return (
    <header className="seller-header">
      <div className="seller-header-container">
        {/* Logo ve Branding */}
        <div className="seller-brand">
          <Link to="/seller-panel" className="brand-link">
            <div className="brand-logo">
              <FaStore className="logo-icon" />
              <div className="logo-text">
                <span className="logo-title">Seller</span>
                <span className="logo-subtitle">Panel</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="seller-nav desktop-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className="nav-link"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Side Actions */}
        <div className="seller-actions">
          {/* Müşteri Sayfasına Git */}
          <button 
            onClick={handleNavigateToCustomer}
            className="customer-link-btn"
            title="Müşteri Sayfasına Git"
          >
            <FaStore />
            <span>Mağaza</span>
          </button>

          {/* Bildirimler */}
          <button className="notification-btn" title="Bildirimler">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>

          {/* User Menu */}
          <div className="user-menu-container">
            <button 
              className="user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <FaUser />
              <span>{user?.username || 'Satıcı'}</span>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <FaUser className="user-avatar" />
                  <div className="user-details">
                    <span className="user-name">{user?.username || 'Satıcı'}</span>
                    <span className="user-role">Mağaza Sahibi</span>
                  </div>
                </div>
                
                <div className="dropdown-divider"></div>
                
                <button 
                  onClick={handleLogout}
                  className="dropdown-item logout-item"
                >
                  <FaSignOutAlt />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <span className={`hamburger ${showMobileMenu ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <nav className="seller-nav mobile-nav">
          <ul className="mobile-nav-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className="mobile-nav-link"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <button 
                onClick={handleNavigateToCustomer}
                className="mobile-nav-link"
              >
                <FaStore />
                <span>Müşteri Sayfası</span>
              </button>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="mobile-nav-link logout-link"
              >
                <FaSignOutAlt />
                <span>Çıkış Yap</span>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default SellerHeader; 