import React, { useState, useContext } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

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
      const res = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Giriş başarısız. Bilgilerinizi kontrol edin.");
      } else {
        setSuccess("Giriş başarılı! Yönlendiriliyorsunuz...");
        await login();
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (err) {
      setError("Sunucu hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
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