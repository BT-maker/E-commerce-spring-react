import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { hashPassword } from '../../utils/passwordUtils';

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
  const { login, isLoggedIn, user, loading: authLoading } = useContext(AuthContext);

  // Eğer zaten giriş yapmışsa ve admin ise dashboard'a yönlendir
  useEffect(() => {
    if (isLoggedIn && user && user.role === 'ADMIN') {
      navigate('/admin/dashboard');
    }
  }, [isLoggedIn, user, navigate]);

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
      // Şifreyi SHA-256 ile hash'le
      const hashedPassword = await hashPassword(form.password);
      console.log('Admin şifre hash\'lendi, uzunluk:', hashedPassword.length);
      
      const requestBody = {
        email: form.email,
        password: hashedPassword // Hash'lenmiş şifreyi gönder
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
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-800 to-orange-600 flex items-center justify-center p-4 relative overflow-hidden">
      <PageTitle title="Admin Girişi" />
      <MetaTags 
        title="Admin Girişi"
        description="E-Ticaret platformu admin paneli giriş sayfası."
        keywords="admin, giriş, yönetim paneli, e-ticaret admin"
      />
      
      {/* Animasyonlu Arka Plan Elementleri */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Yüzen Geometrik Şekiller */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-orange-300/20 rounded-lg rotate-45 animate-float-medium"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-white/5 rounded-full animate-float-fast"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-orange-400/15 rounded-lg rotate-12 animate-float-slow"></div>
        
        {/* Orta Kısımda Büyük Şekiller */}
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-orange-300/10 to-red-300/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-white/8 rounded-lg rotate-45 animate-spin-slow"></div>
        
        {/* Üst Kısımda Küçük Şekiller */}
        <div className="absolute top-10 left-1/2 w-16 h-16 bg-orange-200/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-32 right-10 w-20 h-20 bg-white/10 rounded-lg animate-float-medium"></div>
        
        {/* Alt Kısımda Şekiller */}
        <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-orange-300/15 rounded-full animate-float-fast"></div>
        <div className="absolute bottom-40 right-1/3 w-32 h-32 bg-white/5 rounded-lg rotate-45 animate-pulse-medium"></div>
        
        {/* Parçacık Efektleri */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-twinkle"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-200/40 rounded-full animate-twinkle-delay-1"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-twinkle-delay-2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-orange-300/35 rounded-full animate-twinkle-delay-3"></div>
        <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-white/20 rounded-full animate-twinkle-delay-4"></div>
        <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-orange-200/30 rounded-full animate-twinkle-delay-5"></div>
      </div>
      
      {/* Loading durumu */}
      {authLoading && (
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto mb-6"></div>
            <div className="text-white text-xl font-semibold mb-2">Admin Girişi</div>
            <p className="text-white/70">Backend bağlantısı kontrol ediliyor...</p>
          </div>
        </div>
      )}
      
      {/* Normal form */}
      {!authLoading && (
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Girişi</h1>
              <p className="text-white/70">Yönetim paneline erişim için giriş yapın</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-100 text-sm">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    <span>Giriş Yapılıyor...</span>
                  </div>
                ) : (
                  "Giriş Yap"
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center space-x-3 text-white/70">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Bu sayfa sadece yetkili admin kullanıcıları içindir.</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Animasyon CSS'leri */}
      <style jsx="true">{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-medium {
          animation: pulse-medium 5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-twinkle-delay-1 {
          animation: twinkle 2s ease-in-out infinite 0.3s;
        }
        
        .animate-twinkle-delay-2 {
          animation: twinkle 2s ease-in-out infinite 0.6s;
        }
        
        .animate-twinkle-delay-3 {
          animation: twinkle 2s ease-in-out infinite 0.9s;
        }
        
        .animate-twinkle-delay-4 {
          animation: twinkle 2s ease-in-out infinite 1.2s;
        }
        
        .animate-twinkle-delay-5 {
          animation: twinkle 2s ease-in-out infinite 1.5s;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
