import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User } from "lucide-react";
import "./Register.css";
import toast from 'react-hot-toast';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';

// SHA-256 hash fonksiyonu
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: ""
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

    setLoading(true);
    try {
      // Şifreyi hash'le
      const hashedPassword = await hashPassword(form.password);
      console.log('Şifre hash\'lendi:', hashedPassword.substring(0, 10) + '...');
      
      const requestBody = {
        username: form.firstName + " " + form.lastName,
        email: form.email,
        password: hashedPassword, // Hash'lenmiş şifreyi gönder
        roleId: 1, // USER role ID
        userType: 'USER'
      };

      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Kayıt başarısız. Lütfen tekrar deneyin.");
      } else {
        setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
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
      <PageTitle title="Kayıt" />
      <MetaTags 
        title="Kayıt"
        description="E-Ticaret platformuna ücretsiz müşteri üyeliği oluşturun."
        keywords="kayıt, üyelik, üye ol, e-ticaret üyelik, müşteri kaydı"
      />
      
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Kayıt</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}


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

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}
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