import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaStore, FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser, FaBuilding } from 'react-icons/fa';
import './SellerRegister.css';

const SellerRegister = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password2: '',
        storeName: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowPassword2(!showPassword2);
        }
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

        if (form.password !== form.password2) {
            setError('Şifreler eşleşmiyor');
            setLoading(false);
            return;
        }

        try {
            const hashedPassword = await hashPassword(form.password);
            
            const response = await fetch('http://localhost:8082/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: form.firstName + " " + form.lastName,
                    email: form.email,
                    password: hashedPassword,
                    roleId: 3, // SELLER role ID
                    userType: 'SELLER',
                    storeName: form.storeName
                })
            });

            if (response.ok) {
                setError('');
                navigate('/seller/login');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Kayıt başarısız');
            }
        } catch (err) {
            console.log('Register hatası:', err);
            setError('Bağlantı hatası. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="trendyol-register-container">
            {/* Sol Panel - Görsel */}
            <div className="register-visual-panel">
                <div className="visual-content">
                    <div className="logo-section">
                        <FaStore className="store-logo" />
                        <h1>Seller Panel</h1>
                    </div>
                    <div className="hero-text">
                        <h2>Mağazanızı Oluşturun</h2>
                        <p>E-ticaret dünyasına adım atın ve ürünlerinizi milyonlarca müşteriye ulaştırın.</p>
                    </div>
                    <div className="features">
                        <div className="feature-item">
                            <div className="feature-icon">🚀</div>
                            <div className="feature-text">
                                <h4>Hızlı Başlangıç</h4>
                                <p>5 dakikada mağazanızı açın</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">📈</div>
                            <div className="feature-text">
                                <h4>Büyüme Fırsatı</h4>
                                <p>Satışlarınızı katlayın</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🛡️</div>
                            <div className="feature-text">
                                <h4>Güvenli Altyapı</h4>
                                <p>Güvenli ödeme sistemleri</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sağ Panel - Register Form */}
            <div className="register-form-panel">
                <div className="form-container">
                    <div className="form-header">
                        <h2>Satıcı Hesabı Oluşturun</h2>
                        <p>Mağazanızı yönetmek için hesap oluşturun</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">Ad</label>
                                <div className="input-wrapper">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Adınız"
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Soyad</label>
                                <div className="input-wrapper">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Soyadınız"
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="storeName">Mağaza Adı</label>
                            <div className="input-wrapper">
                                <FaBuilding className="input-icon" />
                                <input
                                    type="text"
                                    id="storeName"
                                    name="storeName"
                                    value={form.storeName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Mağaza adınız"
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">E-posta Adresi</label>
                            <div className="input-wrapper">
                                <FaEnvelope className="input-icon" />
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
                                <FaLock className="input-icon" />
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
                                    onClick={() => togglePasswordVisibility('password')}
                                    className="password-toggle"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password2">Şifre Tekrar</label>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input
                                    type={showPassword2 ? "text" : "password"}
                                    id="password2"
                                    name="password2"
                                    value={form.password2}
                                    onChange={handleChange}
                                    required
                                    placeholder="Şifrenizi tekrar girin"
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('password2')}
                                    className="password-toggle"
                                >
                                    {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button 
                            type="submit" 
                            className="register-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="loading-spinner"></div>
                            ) : (
                                'Hesap Oluştur'
                            )}
                        </button>
                    </form>

                    <div className="form-footer">
                        <div className="divider">
                            <span>veya</span>
                        </div>
                        
                        <div className="alternative-actions">
                            <p className="login-link">
                                Zaten hesabınız var mı?{' '}
                                <Link to="/seller/login" className="link-button">
                                    Satıcı Girişi
                                </Link>
                            </p>
                            <p className="customer-link">
                                Müşteri misiniz?{' '}
                                <Link to="/register" className="link-button">
                                    Müşteri Kayıt
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerRegister; 