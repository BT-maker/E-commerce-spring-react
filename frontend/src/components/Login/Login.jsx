import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import toast from 'react-hot-toast';
import PageTitle from '../PageTitle/PageTitle';
import MetaTags from '../MetaTags/MetaTags';
import { Mail, Lock, Eye, EyeOff, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
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
      console.log('Customer login denemesi:', form.email);
      
      // Şifreyi SHA-256 ile hash'le (kayıt olurken de aynı yöntem kullanılıyor)
      const hashedPassword = await hashPassword(form.password);
      console.log('Şifre hash\'lendi:', hashedPassword.substring(0, 10) + '...');
      
      const response = await api.post('/auth/signin', {
        email: form.email,
        password: hashedPassword // Hash'lenmiş şifreyi gönder
      }, { withCredentials: true });
      
      console.log('Login başarılı:', response.data);
      
      // Sadece USER rolündeki kullanıcılar giriş yapabilir
      if (response.data.role === 'USER') {
        setSuccess("Giriş başarılı! Yönlendiriliyorsunuz...");
        await login(response.data); // User data'yı direkt geç
        setTimeout(() => navigate("/"), 1200);
      } else {
        setError("Bu hesap müşteri hesabı değil. Lütfen doğru giriş sayfasını kullanın.");
      }
    } catch (error) {
      console.error('Login hatası:', error);
      const errorMessage = error.response?.data?.message || "Giriş başarısız. Bilgilerinizi kontrol edin.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <PageTitle title="Giriş" />
      <MetaTags 
        title="Giriş"
        description="E-Ticaret platformuna güvenli giriş yapın. Hesabınıza erişin ve alışverişe başlayın."
        keywords="giriş, login, hesap, e-ticaret giriş, giriş"
      />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo ve Başlık */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hoş Geldiniz
          </h2>
          <p className="text-gray-600">
            Hesabınıza giriş yapın ve alışverişe başlayın
          </p>
        </div>

        {/* Login Kartı */}
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

            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Şifremi Unuttum Linki */}
            <div className="flex items-center justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors duration-200"
              >
                Şifremi Unuttum
              </Link>
            </div>

            {/* Giriş Butonu */}
            <button 
              type="submit" 
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>

            {/* Kayıt Ol Linki */}
            <div className="text-center pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Hesabınız yok mu? </span>
              <Link 
                to="/register" 
                className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors duration-200"
              >
                Hemen Kayıt Olun
              </Link>
            </div>
          </form>
        </div>

        {/* Alt Bilgi */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Güvenli giriş için SSL şifreleme kullanılmaktadır
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

export default Login; 