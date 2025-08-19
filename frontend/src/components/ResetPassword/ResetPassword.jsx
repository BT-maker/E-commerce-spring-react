import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setTokenValid(false);
      toast.error('Geçersiz şifre sıfırlama bağlantısı');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const validatePassword = (password) => {
    // En az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
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

    if (!validatePassword(newPassword)) {
      toast.error('Şifre en az 8 karakter olmalı ve büyük harf, küçük harf ve rakam içermelidir');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
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
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="error-icon">❌</div>
          <h1>Geçersiz Bağlantı</h1>
          <p>Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.</p>
          <p>Lütfen yeni bir şifre sıfırlama talebinde bulunun.</p>
          <div className="button-group">
            <Link to="/forgot-password" className="primary-button">
              Yeni Şifre Sıfırlama Talebi
            </Link>
            <Link to="/login" className="secondary-button">
              Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="header">
          <h1>Yeni Şifre Belirleyin</h1>
          <p>Güvenli bir şifre seçin ve hesabınıza erişiminizi geri kazanın</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="newPassword">Yeni Şifre</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Yeni şifrenizi girin"
              required
              disabled={loading}
            />
            <div className="password-requirements">
              <small>Şifre gereksinimleri:</small>
              <ul>
                <li className={newPassword.length >= 8 ? 'valid' : 'invalid'}>
                  En az 8 karakter
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'valid' : 'invalid'}>
                  En az 1 büyük harf
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'valid' : 'invalid'}>
                  En az 1 küçük harf
                </li>
                <li className={/\d/.test(newPassword) ? 'valid' : 'invalid'}>
                  En az 1 rakam
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Şifre Tekrarı</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifrenizi tekrar girin"
              required
              disabled={loading}
            />
            {confirmPassword && (
              <div className={`password-match ${newPassword === confirmPassword ? 'valid' : 'invalid'}`}>
                {newPassword === confirmPassword ? '✓ Şifreler eşleşiyor' : '✗ Şifreler eşleşmiyor'}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || !validatePassword(newPassword)}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Güncelleniyor...
              </>
            ) : (
              'Şifremi Güncelle'
            )}
          </button>
        </form>

        <div className="links">
          <Link to="/login" className="back-link">
            ← Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
