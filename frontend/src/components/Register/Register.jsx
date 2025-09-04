import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ShoppingBag, ArrowRight, UserPlus, Shield, CheckCircle } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    console.log('Form submit edildi!');
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
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: hashedPassword, // Hash'lenmiş şifreyi gönder
        roleId: 1, // USER role ID
        userType: 'USER'
      };

      console.log('Kayıt isteği gönderiliyor:', requestBody);
      const res = await fetch("http://localhost:8082/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      console.log('Kayıt response status:', res.status);
      
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
    <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      

      <PageTitle title="Kayıt" />
      <MetaTags 
        title="Kayıt"
        description="E-Ticaret platformuna ücretsiz müşteri üyeliği oluşturun."
        keywords="kayıt, üyelik, üye ol, e-ticaret üyelik, müşteri kaydı"
      />
      
      <div className="relative z-10 w-full max-w-lg">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hesap Oluşturun
          </h2>
          <p className="text-gray-600">
            Ücretsiz üye olun ve alışverişe başlayın
          </p>
        </div>

        {/* Register Kartı */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm text-center">
                {success}
              </div>
            )}

            {/* Ad Soyad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ad</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Adınız"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Soyad</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Soyadınız"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">E-posta Adresi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="ornek@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Şifre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Şifre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Şifre Tekrar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Şifre Tekrar</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="password2"
                  placeholder="••••••••"
                  value={form.password2}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  {showPassword2 ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Özellikler */}
            <div className="bg-orange-50 rounded-xl p-4 space-y-3">
              <h4 className="font-medium text-orange-900 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-orange-600" />
                Ücretsiz Üyelik Avantajları
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-orange-800">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-orange-600" />
                  Hızlı sipariş
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-orange-600" />
                  Özel indirimler
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-orange-600" />
                  Güvenli ödeme
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-orange-600" />
                  7/24 destek
                </div>
              </div>
            </div>

            {/* Kayıt Butonu */}
            <button 
              type="submit" 
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Kayıt Olunuyor...
                </>
              ) : (
                <>
                  Ücretsiz Kayıt Ol
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>

            {/* Giriş Yap Linki */}
            <div className="text-center pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Zaten hesabınız var mı? </span>
              <Link 
                to="/login" 
                className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors duration-200"
              >
                Giriş Yapın
              </Link>
            </div>
          </form>
        </div>

        {/* Alt Bilgi */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Kişisel bilgileriniz güvenle korunmaktadır
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Register; 