import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyAccount = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (!token) {
            setVerificationStatus('error');
            setMessage('Geçersiz doğrulama linki. Token bulunamadı.');
            return;
        }

        verifyAccount(token);
    }, [searchParams]);

    const verifyAccount = async (token) => {
        try {
            const response = await fetch(`http://localhost:8082/api/auth/verify-account?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setVerificationStatus('success');
                setMessage('Hesabınız başarıyla doğrulandı! Artık giriş yapabilirsiniz.');
            } else {
                const errorData = await response.json();
                setVerificationStatus('error');
                setMessage(errorData.message || 'Hesap doğrulama işlemi başarısız oldu.');
            }
        } catch (error) {
            console.error('Hesap doğrulama hatası:', error);
            setVerificationStatus('error');
            setMessage('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleHomeRedirect = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Hesap Doğrulama</h1>
                    <p className="text-gray-600">Email adresinizi doğruluyoruz...</p>
                </div>

                <div className="space-y-6">
                    {verificationStatus === 'loading' && (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                            </div>
                            <p className="text-gray-700 font-medium">Hesabınız doğrulanıyor...</p>
                        </div>
                    )}

                    {verificationStatus === 'success' && (
                        <div className="text-center space-y-6">
                            <div className="flex justify-center">
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-gray-900">Doğrulama Başarılı!</h2>
                                <p className="text-gray-600">{message}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={handleLoginRedirect}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Giriş Yap
                                </button>
                                <button 
                                    onClick={handleHomeRedirect}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Ana Sayfaya Git
                                </button>
                            </div>
                        </div>
                    )}

                    {verificationStatus === 'error' && (
                        <div className="text-center space-y-6">
                            <div className="flex justify-center">
                                <XCircle className="w-16 h-16 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-gray-900">Doğrulama Başarısız</h2>
                                <p className="text-gray-600">{message}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={handleLoginRedirect}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Giriş Sayfasına Git
                                </button>
                                <button 
                                    onClick={handleHomeRedirect}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    Ana Sayfaya Git
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyAccount;
