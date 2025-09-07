import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { 
  Heart, 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Package, 
  Store,
  Crown,
  Bell,
  ChevronDown,
  Sparkles,
  Star,
  Gift,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  Zap,
  Award,
  Target,
  Users,
  ShoppingBag,
  Home,
  Grid,
  Bookmark,
  MessageCircle,
  HelpCircle,
  Info
} from "lucide-react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import NotificationBell from '../NotificationBell/NotificationBell';
import SearchSuggestions from '../SearchSuggestions/SearchSuggestions';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const { isLoggedIn, user, logout, loading } = useContext(AuthContext);
  const { getFavoriteCount } = useFavorites();
  
  // Debug için user bilgilerini logla
  console.log('Header - User:', user, 'Role:', user?.role, 'isLoggedIn:', isLoggedIn);
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Kategoriler
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  // Gerçek zamanlı saat güncellemesi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Eğer kategoriler zaten yüklendiyse tekrar yükleme
    if (categoriesLoaded) return;
    
    // Backend offline ise kategorileri yükleme
    if (window.BACKEND_OFFLINE) {
      console.log('Backend offline, kategoriler yüklenmedi');
      setCategories([]);
      setCatLoading(false);
      setCategoriesLoaded(true);
      return;
    }
    
    fetch("http://localhost:8082/api/categories")
      .then(res => {
        if (!res.ok) throw new Error("Kategoriler alınamadı");
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setCatLoading(false);
        setCategoriesLoaded(true);
      })
      .catch(err => {
        setCatError(err.message);
        setCatLoading(false);
        setCategoriesLoaded(true);
      });
  }, [categoriesLoaded]);

  const handleSearch = (query) => {
    if (query.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfile = () => {
    setUserMenuOpen(false);
    navigate("/profile");
  };

  const handleOrders = () => {
    setUserMenuOpen(false);
    navigate("/orders");
  };

  const handleFavorites = () => {
    setUserMenuOpen(false);
    navigate("/favorites");
  };

  const handleSellerPanel = () => {
    setUserMenuOpen(false);
    navigate("/seller-panel");
  };

  const handleCategoryClick = (catId) => {
    navigate(`/category/${catId}`);
    setMobileMenuOpen(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <>
      {/* Üst Duyuru Çubuğu */}
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white py-2 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">
                🎉 Sezon sonu indirimleri başladı! %50'ye varan indirimler
              </span>
            </div>
            
          </div>
          {/* Animasyonlu arka plan efektleri */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>
      )}

      {/* Ana Header */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-white/30 shadow-lg overflow-visible">
        {/* Üst kısım */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group relative flex-shrink-0">
            <div className="relative">
              <img src="/img/mascot2.png" alt="Logo" className="h-12 w-12 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Shopping
              </span>
              <span className="text-xs text-gray-500 font-medium">Premium Alışveriş</span>
            </div>
          </Link>

          {/* Desktop Arama kutusu - Genişletilmiş */}
          <div className="hidden lg:flex flex-1 mx-8 max-w-4xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-full overflow-visible">
              <SearchSuggestions
                onSearch={handleSearch}
                placeholder="🔍 Ürün, kategori veya mağaza ara..."
                compact={true}
              />
            </div>
          </div>

          {/* Tablet Arama kutusu - Orta boyut */}
          <div className="hidden md:flex lg:hidden flex-1 mx-4 max-w-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative w-full overflow-visible">
              <SearchSuggestions
                onSearch={handleSearch}
                placeholder="🔍 Ara..."
                compact={true}
              />
            </div>
          </div>

          {/* Desktop Menü */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {loading ? (
              <div className="flex items-center space-x-4">
                <Skeleton height={20} width={60} />
                <Skeleton height={20} width={60} />
                <Skeleton height={20} width={60} />
              </div>
            ) : !isLoggedIn ? (
              <>
                {/* Hızlı Erişim Butonları - Giriş yapmamış kullanıcılar için */}
                <Link 
                  to="/discounted-products" 
                  className="relative flex items-center space-x-1 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 transition-all duration-200 rounded-lg hover:bg-red-50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Gift size={14} />
                  <span className="hidden xl:inline">İndirimler</span>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </Link>

                <Link 
                  to="/trending" 
                  className="flex items-center space-x-1 px-3 py-2 text-xs font-medium text-purple-600 hover:text-purple-700 transition-all duration-200 rounded-lg hover:bg-purple-50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <TrendingUp size={14} />
                  <span className="hidden xl:inline">Trend</span>
                </Link>

                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-all duration-200 rounded-xl hover:bg-orange-50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <User size={16} />
                  <span>Giriş Yap</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
                >
                  <Sparkles size={16} />
                  <span>Ücretsiz Kayıt</span>
                </Link>
              </>
            ) : (
              <>
                {/* Hızlı Erişim Butonları */}
                <Link 
                  to="/discounted-products" 
                  className="relative flex items-center space-x-1 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 transition-all duration-200 rounded-lg hover:bg-red-50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Gift size={14} />
                  <span className="hidden xl:inline">İndirimler</span>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </Link>

                <Link 
                  to="/trending" 
                  className="flex items-center space-x-1 px-3 py-2 text-xs font-medium text-purple-600 hover:text-purple-700 transition-all duration-200 rounded-lg hover:bg-purple-50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <TrendingUp size={14} />
                  <span className="hidden xl:inline">Trend</span>
                </Link>

                {user && user.role === "ADMIN" && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-all duration-200 rounded-lg hover:bg-purple-50 hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <Crown size={16} />
                    <span>Admin</span>
                  </Link>
                )}

                <Link 
                  to="/favorites" 
                  className="relative flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-500 transition-all duration-200 rounded-lg hover:bg-red-50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Heart size={16} className="hover:scale-110 transition-transform duration-200" />
                  <span className="hidden sm:inline">Favoriler</span>
                  {getFavoriteCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                      {getFavoriteCount()}
                    </span>
                  )}
                </Link>

                <Link 
                  to="/cart" 
                  className="relative flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-all duration-200 rounded-lg hover:bg-orange-50 hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <ShoppingCart size={16} className="hover:scale-110 transition-transform duration-200" />
                  <span className="hidden sm:inline">Sepet</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                      {cartItems.length}
                    </span>
                  )}
                </Link>

                {isLoggedIn && <NotificationBell />}

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-all duration-200 rounded-lg hover:bg-orange-50 hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <div className="relative">
                      <User size={16} />
                      {user?.role === "ADMIN" && (
                        <Crown size={10} className="absolute -top-1 -right-1 text-purple-500" />
                      )}
                      {user?.role === "SELLER" && (
                        <Store size={10} className="absolute -top-1 -right-1 text-blue-500" />
                      )}
                    </div>
                    <span className="hidden sm:inline">{user?.username || "Hesabım"}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      {/* Kullanıcı Bilgileri */}
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 border-b border-orange-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                            <User size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user?.username || "Kullanıcı"}</p>
                            <p className="text-xs text-gray-600">{user?.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={handleProfile}
                          className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all duration-200"
                        >
                          <User size={16} />
                          <span>Profil</span>
                        </button>
                        <button
                          onClick={handleFavorites}
                          className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
                        >
                          <Heart size={16} />
                          <span>Favorilerim</span>
                        </button>
                        <button
                          onClick={handleOrders}
                          className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                        >
                          <Package size={16} />
                          <span>Siparişlerim</span>
                        </button>
                        
                        <hr className="my-2 border-gray-200" />
                        
                        {user && user.role === "ADMIN" && (
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate("/admin");
                            }}
                            className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                          >
                            <Crown size={16} />
                            <span>Admin Paneli</span>
                          </button>
                        )}
                        {user && user.role === "SELLER" && (
                          <button
                            onClick={handleSellerPanel}
                            className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                          >
                            <Store size={16} />
                            <span>Mağaza Paneli</span>
                          </button>
                        )}
                        
                        <hr className="my-2 border-gray-200" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                          <LogOut size={16} />
                          <span>Çıkış Yap</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-white/30">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search - Tam genişlik */}
              <div className="w-full overflow-visible">
                <SearchSuggestions
                  onSearch={handleSearch}
                  placeholder="🔍 Ürün, kategori veya mağaza ara..."
                  compact={true}
                />
              </div>

              {/* Mobile User Actions */}
              {!isLoggedIn ? (
                <div className="flex space-x-3">
                  <Link 
                    to="/login" 
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-all duration-200 rounded-xl hover:bg-orange-50"
                  >
                    <User size={16} />
                    <span>Giriş Yap</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-xl hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-200"
                  >
                    <Sparkles size={16} />
                    <span>Ücretsiz Kayıt</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    to="/favorites" 
                    className="relative flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-500 transition-all duration-200 rounded-xl hover:bg-red-50"
                  >
                    <Heart size={16} />
                    <span>Favoriler</span>
                    {getFavoriteCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {getFavoriteCount()}
                      </span>
                    )}
                  </Link>
                  <Link 
                    to="/cart" 
                    className="relative flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-all duration-200 rounded-xl hover:bg-orange-50"
                  >
                    <ShoppingCart size={16} />
                    <span>Sepet</span>
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {/* Mobile Quick Actions */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                <Link 
                  to="/discounted-products" 
                  className="flex flex-col items-center space-y-1 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 transition-all duration-200 rounded-lg hover:bg-red-50"
                >
                  <Gift size={16} />
                  <span>İndirimler</span>
                </Link>
                <Link 
                  to="/trending" 
                  className="flex flex-col items-center space-y-1 px-3 py-2 text-xs font-medium text-purple-600 hover:text-purple-700 transition-all duration-200 rounded-lg hover:bg-purple-50"
                >
                  <TrendingUp size={16} />
                  <span>Trend</span>
                </Link>
                <Link 
                  to="/help" 
                  className="flex flex-col items-center space-y-1 px-3 py-2 text-xs font-medium text-blue-600 hover:text-blue-700 transition-all duration-200 rounded-lg hover:bg-blue-50"
                >
                  <HelpCircle size={16} />
                  <span>Yardım</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Kategori menüsü */}
        <nav className="bg-gradient-to-r from-orange-50 via-orange-50 to-orange-100/50 border-t border-orange-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {catLoading ? (
              <div className="flex justify-center gap-4 py-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} height={20} width={80} />
                ))}
              </div>
            ) : catError ? (
              <div className="text-center py-3 text-red-500 text-sm">{catError}</div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4 py-3">
                {Array.isArray(categories) && categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="text-sm font-medium text-orange-700 hover:text-orange-800 transition-all duration-200 px-4 py-2 rounded-xl hover:bg-orange-200/50 hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header; 