import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import "./AdminLogin.css";
import toast from 'react-hot-toast';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';

const AdminLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.email || !form.password) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      // Backend plain password bekliyor, hash'leme yapmıyoruz
      const requestBody = {
        email: form.email,
        password: form.password
      };

      const res = await fetch("http://localhost:8082/api/auth/admin/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setError("Bu sayfaya erişim yetkiniz bulunmamaktadır. Sadece admin kullanıcıları giriş yapabilir.");
        } else {
          setError(data.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
        }
        return;
      }

      const data = await res.json();

      // Login işlemi - userData olarak gönder
      await login(data);
      
      toast.success("Admin paneline hoş geldiniz!");
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Sunucu hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <PageTitle title="Admin Girişi" />
      <MetaTags 
        title="Admin Girişi"
        description="E-Ticaret platformu admin paneli giriş sayfası."
        keywords="admin, giriş, yönetim paneli, e-ticaret admin"
      />
      
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-icon">
            <Shield size={48} />
          </div>
          <h1>Admin Girişi</h1>
          <p>Yönetim paneline erişim için giriş yapın</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="form-input"
              disabled={loading}
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="form-input"
                disabled={loading}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="security-notice">
          <Shield size={16} />
          <span>Bu sayfa sadece yetkili admin kullanıcıları içindir.</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
