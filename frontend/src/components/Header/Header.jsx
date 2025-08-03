import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { FaUserCircle } from "react-icons/fa";
import { Heart } from "lucide-react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
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

  // Kategoriler
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

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
    
    fetch("http://localhost:8080/api/categories")
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
  };

  return (
    <header className="w-full border-b border-gray-200 bg-background-primary dark:bg-gray-800 dark:border-gray-700">
      {/* Üst kısım */}
      <div className="flex items-center justify-between px-12 sm:px-16 lg:px-24 py-4 sm:py-6 max-w-8xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img src="/img/mascot2.png" alt="Logo" className="h-14 w-14 object-contain group-hover:opacity-80 transition" />
          <span className="text-3xl font-bold italic tracking-wide group-hover:text-orange-500 transition-colors dark:text-white">Shopping</span>
        </Link>
        {/* Arama kutusu */}
        <div className="flex-1 mx-8 flex justify-center items-start mt-9">
          <SearchSuggestions
            onSearch={handleSearch}
            placeholder="Ürün, kategori veya mağaza ara..."
            compact={true}
          />
        </div>
        {/* Giriş/Kayıt/Sepet */}
        <div className="flex items-center space-x-6">
          {/* Tema Toggle */}
          <ThemeToggle />
          {loading ? (
            <div className="flex items-center space-x-6">
              <Skeleton height={20} width={60} />
              <Skeleton height={20} width={60} />
              <Skeleton height={20} width={60} />
            </div>
          ) : !isLoggedIn ? (
            <>
                        <Link to="/login" className="text-sm font-semibold hover:text-orange-500 transition-colors no-underline dark:text-gray-300 dark:hover:text-orange-500">Giriş Yap</Link>
          <Link to="/register" className="text-sm font-semibold hover:text-orange-500 transition-colors no-underline dark:text-gray-300 dark:hover:text-orange-500">Kayıt Ol</Link>
            </>
          ) : (
            <>
              {user && user.role === "ADMIN" && (
                <Link to="/admin" className="text-sm font-semibold hover:text-orange-500 transition-colors no-underline dark:text-gray-300 dark:hover:text-orange-500">Panel</Link>
              )}

              <Link to="/favorites" className="text-sm font-semibold relative flex items-center gap-1 dark:text-gray-300 dark:hover:text-orange-500">
                <Heart size={16} />
                Favorilerim
                {getFavoriteCount() > 0 && (
                  <span className="absolute -top-2 -right-4 bg-error-400 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                    {getFavoriteCount()}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="text-sm font-semibold relative dark:text-gray-300 dark:hover:text-orange-500">
                Sepetim
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-4 bg-secondary-400 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              {isLoggedIn && <NotificationBell />}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center text-sm font-semibold hover:text-orange-500 transition-colors no-underline focus:outline-none dark:text-gray-300 dark:hover:text-orange-500"
                >
                  <FaUserCircle className="text-2xl mr-1" />
                  {user?.username || "Hesabım"}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-background-primary border border-gray-200 rounded shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
                    <button
                      onClick={handleProfile}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-background-secondary dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Profil
                    </button>
                    <button
                      onClick={handleFavorites}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-background-secondary dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Favorilerim
                    </button>
                    <button
                      onClick={handleOrders}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-background-secondary dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Siparişlerim
                    </button>
                    {user && user.role === "ADMIN" && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate("/admin");
                        }}
                        className="block w-full text-left px-4 py-2 text-orange-500 hover:bg-background-secondary dark:text-orange-500 dark:hover:bg-gray-700"
                      >
                        Admin Paneli
                      </button>
                    )}
                    {user && user.role === "SELLER" && (
                      <button
                        onClick={handleSellerPanel}
                        className="block w-full text-left px-4 py-2 text-orange-500 hover:bg-background-secondary dark:text-orange-500 dark:hover:bg-gray-700"
                      >
                        Mağaza Paneli
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-error-400 hover:bg-background-secondary dark:text-error-400 dark:hover:bg-gray-700"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Kategori menüsü */}
      <nav className="bg-background-primary border-t border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        {catLoading ? (
          <div className="flex justify-center gap-4 py-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={20} width={80} />
            ))}
          </div>
        ) : catError ? (
          <div className="text-center py-2 text-error-400 text-sm">{catError}</div>
        ) : (
          <ul className="flex flex-wrap justify-center gap-4 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="hover:text-orange-500 cursor-pointer transition-colors dark:hover:text-orange-500"
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Site Header: Web sitesinin üst kısmı
 * 2. Logo ve Branding: Site logosu ve marka kimliği
 * 3. Arama Kutusu: Ürün arama fonksiyonu
 * 4. Kullanıcı Menüsü: Giriş/kayıt, profil, sepet, favoriler
 * 5. Kategori Navigasyonu: Ürün kategorileri menüsü
 * 6. Tema Toggle: Açık/koyu tema değiştirme
 * 7. Loading States: Yükleme durumları için skeleton animasyonları
 * 8. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde web sitesi kullanıcı dostu ve işlevsel bir header'a sahip olur!
 */ 