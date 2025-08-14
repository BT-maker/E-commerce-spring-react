import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaStore, FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';
import api from '../../services/api';
import './SellerLogin.css';

const SellerLogin = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // SHA-256 hash fonksiyonu
    const hashPassword = async (password) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        //hashPassword(form.password).then(hashedPassword => {
        try {
            console.log('Seller login denemesi:', form.email);
            
            const response = await api.post('/auth/seller/signin', {
                email: form.email,
                password: form.password
            });

            console.log('Login response data:', response.data);
            
            console.log('Seller login başarılı, seller-panel\'e yönlendiriliyor');
            login(response.data);
            navigate('/seller-panel');
        } catch (err) {
            console.log('Login hatası:', err);
            if (err.response?.status === 403) {
                setError('Bu hesap satıcı hesabı değil. Lütfen doğru giriş sayfasını kullanın.');
            } else {
                setError(err.response?.data?.message || 'Bağlantı hatası. Lütfen tekrar deneyin.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="trendyol-login-container">
            {/* Sol Panel - Görsel */}
            <div className="login-visual-panel ">
                <div className="visual-content">
                    <div className="logo-section ">
                        <FaStore className="store-logo" />
                    </div>
                    <div className="hero-text">
                        <h2>Mağazanızı Yönetin</h2>
                        <p>Ürünlerinizi satın, satışlarınızı takip edin ve müşterilerinizle bağlantı kurun.</p>
                    </div>
                    <div className="features">
                        <div className="feature-item">
                            <div className="feature-icon">📊</div>
                            <div className="feature-text">
                                <h4>Detaylı Analitik</h4>
                                <p>Satış performansınızı takip edin</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🚀</div>
                            <div className="feature-text">
                                <h4>Kolay Yönetim</h4>
                                <p>Ürünlerinizi kolayca yönetin</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">💰</div>
                            <div className="feature-text">
                                <h4>Gelir Takibi</h4>
                                <p>Kazançlarınızı anlık görün</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sağ Panel - Login Form */}
            <div className="login-form-panel">
                <div className="form-container">
                    <div className="form-header">
                        <h2>Hoş Geldiniz</h2>
                        <p>Mağaza hesabınıza giriş yapın</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">E-posta Adresi</label>
                            <div className="input-wrapper">
                                
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="ornek@magaza.com"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Şifre</label>
                            <div className="input-wrapper">
                                
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Şifrenizi girin"
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="password-toggle"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="loading-spinner"></div>
                            ) : (
                                'Giriş Yap'
                            )}
                        </button>
                    </form>

                    <div className="form-footer">
                        <div className="divider">
                            <span>veya</span>
                        </div>
                        
                        <div className="alternative-actions">
                            <p className="register-link">
                                Henüz hesabınız yok mu?{' '}
                                <Link to="/seller/register" className="link-button">
                                    Satıcı Olarak Kayıt Ol
                                </Link>
                            </p>
                            <p className="customer-link">
                                Müşteri misiniz?{' '}
                                <Link to="/login" className="link-button">
                                    Müşteri Girişi
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin; 