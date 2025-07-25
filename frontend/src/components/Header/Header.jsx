import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const { isLoggedIn, user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Kategoriler
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then(res => {
        if (!res.ok) throw new Error("Kategoriler alınamadı");
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setCatLoading(false);
      })
      .catch(err => {
        setCatError(err.message);
        setCatLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/search?q=${searchQuery}`);
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

  const handleSellerPanel = () => {
    setUserMenuOpen(false);
    navigate("/seller-panel");
  };

  const handleCategoryClick = (catId) => {
    navigate(`/category/${catId}`);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Üst kısım */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-6 max-w-8xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img src="/img/mascot2.png" alt="Logo" className="h-14 w-14 object-contain group-hover:opacity-80 transition" />
          <span className="text-3xl font-bold italic tracking-wide group-hover:text-green-700 transition-colors">Shopping</span>
        </Link>
        {/* Arama kutusu */}
        <div className="flex-1 mx-8">
          <input
            type="text"
            placeholder="Ürün , kategori veya marka girin"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        {/* Giriş/Kayıt/Sepet */}
        <div className="flex items-center space-x-6">
          {loading ? (
            <div className="w-32 h-8 bg-gray-200 animate-pulse rounded" />
          ) : !isLoggedIn ? (
            <>
              <Link to="/login" className="text-sm font-semibold hover:text-green-700 transition-colors no-underline">Giriş Yap</Link>
              <Link to="/register" className="text-sm font-semibold hover:text-green-700 transition-colors no-underline">Kayıt Ol</Link>
            </>
          ) : (
            <>
              {user && user.role === "ADMIN" && (
                <Link to="/admin" className="text-sm font-semibold hover:text-green-700 transition-colors no-underline">Panel</Link>
              )}
              <Link to="/cart" className="text-sm font-semibold relative">
                Sepetim
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-4 bg-green-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center text-sm font-semibold hover:text-green-700 transition-colors no-underline focus:outline-none"
                >
                  <FaUserCircle className="text-2xl mr-1" />
                  {user?.username || "Hesabım"}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <button
                      onClick={handleProfile}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Profil
                    </button>
                    <button
                      onClick={handleOrders}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Siparişlerim
                    </button>
                    {user && user.role === "SELLER" && (
                      <button
                        onClick={handleSellerPanel}
                        className="block w-full text-left px-4 py-2 text-green-700 hover:bg-gray-100"
                      >
                        Mağaza Paneli
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
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
      <nav className="bg-white border-t border-b border-gray-100">
        {catLoading ? (
          <div className="text-center py-2 text-gray-400 text-sm">Kategoriler yükleniyor...</div>
        ) : catError ? (
          <div className="text-center py-2 text-red-500 text-sm">{catError}</div>
        ) : (
          <ul className="flex flex-wrap justify-center gap-4 py-2 text-sm font-medium text-gray-700">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="hover:text-green-600 cursor-pointer transition-colors"
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