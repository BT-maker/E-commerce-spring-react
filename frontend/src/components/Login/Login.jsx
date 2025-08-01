import React, { useState, useContext } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
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

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      console.log('Login denemesi:', form.email);
      
      // Şifreyi hash'le
      const hashedPassword = await hashPassword(form.password);
      console.log('Şifre hash\'lendi:', hashedPassword.substring(0, 10) + '...');
      
      const response = await api.post('/auth/signin', {
        email: form.email,
        password: hashedPassword // Hash'lenmiş şifreyi gönder
      }, { withCredentials: true });
      
      console.log('Login başarılı:', response.data);
      setSuccess("Giriş başarılı! Yönlendiriliyorsunuz...");
      await login(response.data); // User data'yı direkt geç
      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      console.error('Login hatası:', error);
      const errorMessage = error.response?.data?.message || "Giriş başarısız. Bilgilerinizi kontrol edin.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
          <div className="login-container">
        <PageTitle title="Giriş Yap" />
        <MetaTags 
          title="Giriş Yap"
          description="E-Ticaret platformuna güvenli giriş yapın. Hesabınıza erişin ve alışverişe başlayın."
          keywords="giriş, login, hesap, e-ticaret giriş"
        />
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Giriş Yap</h2>
          {error && <div style={{ color: "#d32f2f", textAlign: "center", fontSize: "1rem", marginBottom: 8 }}>{error}</div>}
          {success && <div style={{ color: "#388e3c", textAlign: "center", fontSize: "1rem", marginBottom: 8 }}>{success}</div>}
        <input
          type="email"
          name="email"
          placeholder="E-posta"
          value={form.email}
          onChange={handleChange}
          required
          className="login-input"
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          required
          className="login-input"
          disabled={loading}
        />
        <button type="submit" className="login-btn" disabled={loading}>{loading ? "Giriş Yapılıyor..." : "Giriş Yap"}</button>
        <div className="login-link-row">
          <span>Hesabınız yok mu?</span>
          <Link to="/register" className="login-link">Kayıt olun</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

/**
 * Bu component şu işlevleri sağlar:
 * 
 * 1. Kullanıcı Girişi: Kullanıcı authentication sistemi
 * 2. Form Validation: Giriş formu doğrulama
 * 3. Error Handling: Hata durumlarının yönetimi
 * 4. Loading States: Giriş işlemi sırasında loading göstergesi
 * 5. Success Messages: Başarılı giriş mesajları
 * 6. SEO Optimizasyonu: Sayfa başlığı ve meta etiketleri
 * 7. Responsive Design: Mobil ve desktop uyumlu tasarım
 * 8. Redirect: Başarılı giriş sonrası yönlendirme
 * 
 * Bu component sayesinde kullanıcılar güvenli şekilde sisteme giriş yapabilir!
 */ 