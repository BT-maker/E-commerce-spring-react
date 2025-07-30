import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User, Store } from "lucide-react";
import "./Register.css";
import toast from 'react-hot-toast';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    userType: "customer", // customer veya seller
    storeName: "", // Sadece seller için
    phone: "" // Sadece seller için
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (form.password !== form.password2) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (form.userType === "seller" && !form.storeName.trim()) {
      setError("Mağaza adı gereklidir.");
      return;
    }

    setLoading(true);
    try {
      const roleId = form.userType === "seller" ? 3 : 2; // 2: USER, 3: SELLER
      
      const requestBody = {
        username: form.firstName + " " + form.lastName,
        email: form.email,
        password: form.password,
        roleId: roleId,
        userType: form.userType
      };

      // Seller için ek bilgiler
      if (form.userType === "seller") {
        requestBody.storeName = form.storeName;
        requestBody.phone = form.phone;
      }

      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Kayıt başarısız. Lütfen tekrar deneyin.");
      } else {
        const message = form.userType === "seller" 
          ? "Satıcı kaydınız başarılı! Giriş sayfasına yönlendiriliyorsunuz..." 
          : "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...";
        setSuccess(message);
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError("Sunucu hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <PageTitle title="Kayıt Ol" />
      <MetaTags 
        title="Kayıt Ol"
        description="E-Ticaret platformuna ücretsiz üye olun. Müşteri veya satıcı olarak kayıt olabilirsiniz."
        keywords="kayıt, üyelik, üye ol, e-ticaret üyelik, satıcı kaydı"
      />
      
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Kayıt Ol</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {/* Kullanıcı Tipi Seçimi */}
        <div className="user-type-selection">
          <h3>Hesap Türünü Seçin</h3>
          <div className="user-type-options">
            <label className={`user-type-option ${form.userType === 'customer' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="userType"
                value="customer"
                checked={form.userType === "customer"}
                onChange={handleChange}
                disabled={loading}
              />
              <div className="option-content">
                <User size={24} />
                <div>
                  <h4>Müşteri</h4>
                  <p>Alışveriş yapmak için kayıt olun</p>
                </div>
              </div>
            </label>
            
            <label className={`user-type-option ${form.userType === 'seller' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="userType"
                value="seller"
                checked={form.userType === "seller"}
                onChange={handleChange}
                disabled={loading}
              />
              <div className="option-content">
                <Store size={24} />
                <div>
                  <h4>Satıcı</h4>
                  <p>Ürün satmak için mağaza açın</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Temel Bilgiler */}
        <div className="form-section">
          <h3>Temel Bilgiler</h3>
          <div className="register-row">
            <input
              type="text"
              name="firstName"
              placeholder="Ad"
              value={form.firstName}
              onChange={handleChange}
              required
              className="register-input"
              disabled={loading}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Soyad"
              value={form.lastName}
              onChange={handleChange}
              required
              className="register-input"
              disabled={loading}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="E-posta"
            value={form.email}
            onChange={handleChange}
            required
            className="register-input"
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={form.password}
            onChange={handleChange}
            required
            className="register-input"
            disabled={loading}
          />
          <input
            type="password"
            name="password2"
            placeholder="Şifre Tekrar"
            value={form.password2}
            onChange={handleChange}
            required
            className="register-input"
            disabled={loading}
          />
        </div>

        {/* Satıcı Bilgileri (Sadece seller seçildiğinde) */}
        {form.userType === "seller" && (
          <div className="form-section">
            <h3>Mağaza Bilgileri</h3>
            <input
              type="text"
              name="storeName"
              placeholder="Mağaza Adı *"
              value={form.storeName}
              onChange={handleChange}
              required
              className="register-input"
              disabled={loading}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefon Numarası"
              value={form.phone}
              onChange={handleChange}
              className="register-input"
              disabled={loading}
            />
          </div>
        )}

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "Kayıt Olunuyor..." : `Kayıt Ol (${form.userType === 'seller' ? 'Satıcı' : 'Müşteri'})`}
        </button>
        
        <div className="login-link-row">
          <span>Hesabınız var mı?</span>
          <Link to="/login" className="login-link">Giriş yapın</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Kullanıcı Kaydı: Yeni kullanıcı kayıt sistemi
 * 2. Hesap Türü Seçimi: Müşteri veya satıcı olarak kayıt
 * 3. Form Validation: Kayıt formu doğrulama ve hata kontrolü
 * 4. Satıcı Kaydı: Mağaza bilgileri ile satıcı kaydı
 * 5. Loading States: Kayıt işlemi sırasında loading göstergesi
 * 6. Success/Error Messages: Başarı ve hata mesajları
 * 7. SEO Optimizasyonu: Sayfa başlığı ve meta etiketleri
 * 8. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 
 * Bu component sayesinde kullanıcılar güvenli şekilde sisteme kayıt olabilir!
 */ 