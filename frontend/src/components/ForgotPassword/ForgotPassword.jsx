import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaClock, FaUserPlus } from 'react-icons/fa';
import api from '../../services/api';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Lütfen e-posta adresinizi girin');
      return;
    }

    // Basit email validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Lütfen geçerli bir e-posta adresi girin');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        setEmailSent(true);
        toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi');
      } else {
        toast.error(response.data.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      toast.error(error.response?.data?.message || 'Şifre sıfırlama işlemi başarısız');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-4xl text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">E-posta Gönderildi!</h1>
              <p className="text-gray-600">
                <strong className="text-orange-600">{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
              </p>
            </div>

            {/* Instructions */}
            <div className="mb-6">
              <p className="text-gray-700 text-center mb-4">
                E-postanızı kontrol edin ve gelen bağlantıya tıklayarak şifrenizi sıfırlayın.
              </p>
              
              {/* Warning Box */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FaExclamationTriangle className="text-orange-500 text-lg mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">Önemli Bilgiler:</h4>
                    <ul className="space-y-1 text-sm text-orange-700">
                      <li className="flex items-center space-x-2">
                        <FaShieldAlt className="text-orange-500" />
                        <span>E-posta spam klasörünüzü de kontrol edin</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FaClock className="text-orange-500" />
                        <span>Bağlantı 24 saat geçerlidir</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <FaShieldAlt className="text-orange-500" />
                        <span>Bağlantıyı kimseyle paylaşmayın</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => setEmailSent(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
              >
                Başka E-posta Gir
              </button>
              <Link 
                to="/login" 
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-center block shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Giriş Sayfasına Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-3xl text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Şifremi Unuttum</h1>
            <p className="text-gray-600">
              E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Gönderiliyor...
                </div>
              ) : (
                'Şifre Sıfırlama Bağlantısı Gönder'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 space-y-4">
            <Link 
              to="/login" 
              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors duration-200"
            >
              <FaArrowLeft className="text-sm" />
              <span>Giriş sayfasına dön</span>
            </Link>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya</span>
              </div>
            </div>
            
            <Link 
              to="/register" 
              className="flex items-center justify-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors duration-200 font-medium"
            >
              <FaUserPlus className="text-sm" />
              <span>Hesabınız yok mu? Kayıt olun</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
