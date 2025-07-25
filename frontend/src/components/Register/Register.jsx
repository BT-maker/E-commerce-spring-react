import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

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
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.firstName + " " + form.lastName,
          email: form.email,
          password: form.password,
          roleId: 2
        })
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
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Kayıt Ol</h2>
        {error && <div style={{ color: "#d32f2f", textAlign: "center", fontSize: "1rem", marginBottom: 8 }}>{error}</div>}
        {success && <div style={{ color: "#388e3c", textAlign: "center", fontSize: "1rem", marginBottom: 8 }}>{success}</div>}
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
        <button type="submit" className="register-btn" disabled={loading}>{loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}</button>
        <div className="login-link-row">
          <span>Hesabınız var mı?</span>
          <Link to="/login" className="login-link">Giriş yapın</Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 