import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import './ForgotPassword.css';

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
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="success-icon">✅</div>
          <h1>E-posta Gönderildi!</h1>
          <p>
            <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
          </p>
          <p>
            E-postanızı kontrol edin ve gelen bağlantıya tıklayarak şifrenizi sıfırlayın.
          </p>
          <div className="warning-box">
            <strong>⚠️ Önemli:</strong>
            <ul>
              <li>E-posta spam klasörünüzü de kontrol edin</li>
              <li>Bağlantı 24 saat geçerlidir</li>
              <li>Bağlantıyı kimseyle paylaşmayın</li>
            </ul>
          </div>
          <div className="button-group">
            <button 
              onClick={() => setEmailSent(false)}
              className="secondary-button"
            >
              Başka E-posta Gir
            </button>
            <Link to="/login" className="primary-button">
              Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="header">
          <h1>Şifremi Unuttum</h1>
          <p>E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">E-posta Adresi</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Gönderiliyor...
              </>
            ) : (
              'Şifre Sıfırlama Bağlantısı Gönder'
            )}
          </button>
        </form>

        <div className="links">
          <Link to="/login" className="back-link">
            ← Giriş sayfasına dön
          </Link>
          <Link to="/register" className="register-link">
            Hesabınız yok mu? Kayıt olun
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
