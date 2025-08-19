import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import './VerifyAccount.css';

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
        <div className="verify-account-container">
            <div className="verify-account-card">
                <div className="verify-account-header">
                    <h1>Hesap Doğrulama</h1>
                    <p>Email adresinizi doğruluyoruz...</p>
                </div>

                <div className="verify-account-content">
                    {verificationStatus === 'loading' && (
                        <div className="verification-loading">
                            <Loader2 className="loading-icon" />
                            <p>Hesabınız doğrulanıyor...</p>
                        </div>
                    )}

                    {verificationStatus === 'success' && (
                        <div className="verification-success">
                            <CheckCircle className="success-icon" />
                            <h2>Doğrulama Başarılı!</h2>
                            <p>{message}</p>
                            <div className="verification-actions">
                                <button 
                                    onClick={handleLoginRedirect}
                                    className="btn-primary"
                                >
                                    Giriş Yap
                                </button>
                                <button 
                                    onClick={handleHomeRedirect}
                                    className="btn-secondary"
                                >
                                    Ana Sayfaya Git
                                </button>
                            </div>
                        </div>
                    )}

                    {verificationStatus === 'error' && (
                        <div className="verification-error">
                            <XCircle className="error-icon" />
                            <h2>Doğrulama Başarısız</h2>
                            <p>{message}</p>
                            <div className="verification-actions">
                                <button 
                                    onClick={handleLoginRedirect}
                                    className="btn-primary"
                                >
                                    Giriş Sayfasına Git
                                </button>
                                <button 
                                    onClick={handleHomeRedirect}
                                    className="btn-secondary"
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
