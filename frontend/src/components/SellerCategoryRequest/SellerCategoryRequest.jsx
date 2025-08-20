import React, { useState, useEffect, useContext } from 'react';
import { Plus, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import categoryRequestApi from '../../services/categoryRequestApi';
import webSocketService from '../../services/webSocketService';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SellerCategoryRequest = () => {
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        categoryName: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [requests, setRequests] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Bekleyen istek sayısını ve istekleri getir
    useEffect(() => {
        fetchPendingCount();
        fetchRequests();
    }, []);

    // WebSocket bildirimleri için useEffect
    useEffect(() => {
        if (user && user.role === 'SELLER') {
            // Kategori istek bildirimlerini dinle
            webSocketService.subscribe('/user/queue/category-requests', (notification) => {
                console.log('Kategori istek bildirimi:', notification);
                toast.success(notification.message);
                fetchPendingCount(); // Sayıları güncelle
                fetchRequests(); // Listeyi yenile
            });

            return () => {
                webSocketService.unsubscribe('/user/queue/category-requests');
            };
        }
    }, [user]);

    const fetchPendingCount = async () => {
        try {
            const count = await categoryRequestApi.getPendingRequestCount();
            setPendingCount(count);
        } catch (error) {
            console.error('Bekleyen istek sayısı alınamadı:', error);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await categoryRequestApi.getSellerRequests(0, 10);
            setRequests(response.content || []);
        } catch (error) {
            console.error('İstekler alınamadı:', error);
        }
    };

    // Kategori adı değiştiğinde önerileri getir
    const handleCategoryNameChange = async (value) => {
        setFormData(prev => ({ ...prev, categoryName: value }));
        
        if (value.length > 2) {
            try {
                const suggestions = await categoryRequestApi.getSimilarCategorySuggestions(value);
                setSuggestions(suggestions);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Öneriler alınamadı:', error);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Öneri seçildiğinde
    const handleSuggestionClick = (suggestion) => {
        setFormData(prev => ({ ...prev, categoryName: suggestion }));
        setShowSuggestions(false);
    };

    // Form gönderimi
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.categoryName.trim()) {
            toast.error('Kategori adı gereklidir');
            return;
        }

        setLoading(true);
        try {
            await categoryRequestApi.createRequest(
                formData.categoryName.trim(),
                formData.description.trim()
            );
            
            toast.success('Kategori isteği başarıyla gönderildi!');
            setIsModalOpen(false);
            setFormData({ categoryName: '', description: '' });
            fetchPendingCount();
            fetchRequests();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'İstek gönderilemedi';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // İstek durumuna göre badge rengi
    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Beklemede
                </span>;
            case 'APPROVED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Onaylandı
                </span>;
            case 'REJECTED':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <X className="w-3 h-3 mr-1" />
                    Reddedildi
                </span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Kategori İstekleri</h2>
                    <p className="text-sm text-gray-600">Yeni kategori istekleri oluşturun ve takip edin</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={pendingCount >= 2}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                        pendingCount >= 2
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni İstek
                </button>
            </div>

            {/* Bekleyen İstek Uyarısı */}
            {pendingCount >= 2 && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex">
                        <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
                        <div>
                            <h3 className="text-sm font-medium text-yellow-800">
                                Maksimum İstek Limiti
                            </h3>
                            <p className="text-sm text-yellow-700 mt-1">
                                Şu anda {pendingCount}/2 bekleyen isteğiniz bulunmaktadır. 
                                Yeni istek gönderebilmek için mevcut isteklerinizin işlenmesini bekleyin.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* İstekler Listesi */}
            <div className="space-y-4">
                {requests.length === 0 ? (
                    <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz İstek Yok</h3>
                        <p className="text-gray-600">İlk kategori isteğinizi oluşturmak için "Yeni İstek" butonuna tıklayın.</p>
                    </div>
                ) : (
                    requests.map((request) => (
                        <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {request.categoryName}
                                        </h3>
                                        {getStatusBadge(request.status)}
                                    </div>
                                    {request.description && (
                                        <p className="text-gray-600 mb-2">{request.description}</p>
                                    )}
                                    <div className="text-sm text-gray-500">
                                        <p>Oluşturulma: {new Date(request.createdAt).toLocaleDateString('tr-TR')}</p>
                                        {request.processedAt && (
                                            <p>İşlenme: {new Date(request.processedAt).toLocaleDateString('tr-TR')}</p>
                                        )}
                                        {request.rejectionReason && (
                                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                                <p className="text-red-800 font-medium">Red Sebebi:</p>
                                                <p className="text-red-700">{request.rejectionReason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Yeni Kategori İsteği</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori Adı *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.categoryName}
                                        onChange={(e) => handleCategoryNameChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Örn: Elektronik"
                                        required
                                    />
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                            {suggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Benzer kategoriler varsa öneriler gösterilecektir.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Açıklama
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Kategori hakkında açıklama (opsiyonel)"
                                />
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {loading ? 'Gönderiliyor...' : 'İstek Gönder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerCategoryRequest;
