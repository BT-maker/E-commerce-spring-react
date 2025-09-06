import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaStore, FaEye, FaEyeSlash, FaLock, FaEnvelope, FaChartLine, FaRocket, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../services/api';

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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex relative overflow-hidden">
            {/* Animasyonlu Arka Plan Elementleri */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Yüzen Geometrik Şekiller */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-orange-200/20 rounded-full animate-float-slow"></div>
                <div className="absolute top-40 right-32 w-24 h-24 bg-orange-300/30 rounded-lg rotate-45 animate-float-medium"></div>
                <div className="absolute bottom-32 left-40 w-40 h-40 bg-orange-100/30 rounded-full animate-float-fast"></div>
                <div className="absolute bottom-20 right-20 w-28 h-28 bg-orange-400/25 rounded-lg rotate-12 animate-float-slow"></div>
                
                {/* Orta Kısımda Büyük Şekiller */}
                <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-orange-200/20 to-orange-300/20 rounded-full animate-pulse-slow"></div>
                <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-orange-200/15 rounded-lg rotate-45 animate-spin-slow"></div>
                
                {/* Üst Kısımda Küçük Şekiller */}
                <div className="absolute top-10 left-1/2 w-16 h-16 bg-orange-300/30 rounded-full animate-bounce-slow"></div>
                <div className="absolute top-32 right-10 w-20 h-20 bg-orange-200/20 rounded-lg animate-float-medium"></div>
                
                {/* Alt Kısımda Şekiller */}
                <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-orange-300/25 rounded-full animate-float-fast"></div>
                <div className="absolute bottom-40 right-1/3 w-32 h-32 bg-orange-100/20 rounded-lg rotate-45 animate-pulse-medium"></div>
                
                {/* Parçacık Efektleri */}
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-orange-400/40 rounded-full animate-twinkle"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-300/50 rounded-full animate-twinkle-delay-1"></div>
                <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-orange-200/35 rounded-full animate-twinkle-delay-2"></div>
                <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-orange-400/45 rounded-full animate-twinkle-delay-3"></div>
                <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-orange-300/30 rounded-full animate-twinkle-delay-4"></div>
                <div className="absolute top-2/3 right-1/5 w-1.5 h-1.5 bg-orange-200/40 rounded-full animate-twinkle-delay-5"></div>
            </div>
            
            {/* Sol Panel - Görsel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <FaStore className="text-4xl text-orange-200" />
                            <h1 className="text-3xl font-bold">Seller Panel</h1>
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Mağazanızı Yönetin</h2>
                        <p className="text-xl text-orange-100 mb-8">
                            Ürünlerinizi satın, satışlarınızı takip edin ve müşterilerinizle bağlantı kurun.
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-orange-400 bg-opacity-30 rounded-lg flex items-center justify-center">
                                <FaChartLine className="text-2xl text-orange-200" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-1">Detaylı Analitik</h4>
                                <p className="text-orange-100">Satış performansınızı takip edin</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-orange-400 bg-opacity-30 rounded-lg flex items-center justify-center">
                                <FaRocket className="text-2xl text-orange-200" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-1">Kolay Yönetim</h4>
                                <p className="text-orange-100">Ürünlerinizi kolayca yönetin</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-orange-400 bg-opacity-30 rounded-lg flex items-center justify-center">
                                <FaMoneyBillWave className="text-2xl text-orange-200" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-1">Gelir Takibi</h4>
                                <p className="text-orange-100">Kazançlarınızı anlık görün</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Dekoratif elementler */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-orange-400 bg-opacity-20 rounded-full"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-300 bg-opacity-30 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-orange-400 bg-opacity-10 rounded-full"></div>
            </div>

            {/* Sağ Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative z-10">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <FaStore className="text-3xl text-orange-500" />
                            <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz</h1>
                        </div>
                        <p className="text-gray-600">Mağaza hesabınıza giriş yapın</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
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
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="ornek@magaza.com"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Şifre
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Şifrenizi girin"
                                        className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Giriş Yapılıyor...
                                    </div>
                                ) : (
                                    'Giriş Yap'
                                )}
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">veya</span>
                                </div>
                            </div>
                            
                            <div className="mt-6 space-y-4 text-center">
                                <p className="text-sm text-gray-600">
                                    Henüz hesabınız yok mu?{' '}
                                    <Link to="/seller/register" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
                                        Satıcı Olarak Kayıt Ol
                                    </Link>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Müşteri misiniz?{' '}
                                    <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
                                        Müşteri Girişi
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
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

export default SellerLogin; 