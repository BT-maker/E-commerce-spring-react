import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { hashPassword, validatePasswordStrength, getPasswordStrengthText, getPasswordStrengthColor } from '../../utils/passwordUtils';
import { Lock, Eye, EyeOff, Loader2, Shield, CheckCircle, XCircle, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';


const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setTokenValid(false);
      toast.error('Geçersiz şifre sıfırlama bağlantısı');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handlePasswordChange = (password) => {
    setNewPassword(password);
    const strength = validatePasswordStrength(password);
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      toast.error('Lütfen yeni şifrenizi girin');
      return;
    }

    if (!confirmPassword.trim()) {
      toast.error('Lütfen şifrenizi tekrar girin');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    if (!passwordStrength?.isValid) {
      toast.error('Şifre gereksinimlerini karşılamıyor');
      return;
    }

    setLoading(true);

    try {
      // Şifreyi SHA-256 ile hash'le
      const hashedPassword = await hashPassword(newPassword);
      console.log('Şifre hash\'lendi, uzunluk:', hashedPassword.length);

      const response = await api.post('/auth/reset-password', {
        token,
        newPassword: hashedPassword // Hash'lenmiş şifreyi gönder
      });

      if (response.data.success) {
        toast.success('Şifreniz başarıyla güncellendi!');
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Şifre güncelleme başarısız');
      }
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      toast.error(error.response?.data?.message || 'Şifre sıfırlama işlemi başarısız');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-orange-100 p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-orange-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Geçersiz Bağlantı</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Lütfen yeni bir şifre sıfırlama talebinde bulunun.
            </p>
            
            <div className="space-y-3">
              <Link 
                to="/forgot-password" 
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <KeyRound className="w-5 h-5" />
                Yeni Şifre Sıfırlama Talebi
              </Link>
              
              <Link 
                to="/login" 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Giriş Sayfasına Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Yeni Şifre Belirleyin</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Güvenli bir şifre seçin ve hesabınıza erişiminizi geri kazanın
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Yeni Şifre */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                Yeni Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Yeni şifrenizi girin"
                  required
                  disabled={loading}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              
              {/* Şifre Güçlülük Göstergesi */}
              {newPassword && passwordStrength && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Şifre Güçlülüğü:</span>
                    <span className={`font-medium ${getPasswordStrengthColor(passwordStrength.score)}`}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score < 2 ? 'bg-red-500' :
                        passwordStrength.score < 3 ? 'bg-orange-400' :
                        passwordStrength.score < 4 ? 'bg-orange-500' :
                        passwordStrength.score < 5 ? 'bg-orange-600' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                    <div className={`flex items-center ${passwordStrength.length ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.length ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      En az 6 karakter
                    </div>
                    <div className={`flex items-center ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.hasUpperCase ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      Büyük harf
                    </div>
                    <div className={`flex items-center ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.hasLowerCase ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      Küçük harf
                    </div>
                    <div className={`flex items-center ${passwordStrength.hasNumbers ? 'text-green-600' : 'text-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.hasNumbers ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      Rakam
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Şifre Tekrarı */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Şifre Tekrarı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  required
                  disabled={loading}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              
              {/* Şifre Eşleşme Kontrolü */}
              {confirmPassword && (
                <div className={`flex items-center gap-2 text-xs ${
                  newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                }`}>
                  {newPassword === confirmPassword ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {newPassword === confirmPassword ? 'Şifreler eşleşiyor' : 'Şifreler eşleşmiyor'}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || !passwordStrength?.isValid}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Şifremi Güncelle
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
