import React, { useState, useEffect, useContext } from 'react';
import { CheckCircle, X, Clock, Eye, AlertCircle } from 'lucide-react';
import categoryRequestApi from '../../services/categoryRequestApi';
import webSocketService from '../../services/webSocketService';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminCategoryRequests = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processingRequest, setProcessingRequest] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, [selectedStatus, currentPage]);

    // WebSocket bildirimleri için useEffect
    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            // Kategori istek bildirimlerini dinle
            webSocketService.subscribe('/user/queue/category-requests', (notification) => {
                console.log('Yeni kategori istek bildirimi:', notification);
                toast.success(notification.message);
                fetchRequests(); // Listeyi yenile
            });

            // Genel topic'i de dinle
            webSocketService.subscribe('/topic/category-requests', (notification) => {
                console.log('Genel kategori istek bildirimi:', notification);
                toast.success(notification.message);
                fetchRequests(); // Listeyi yenile
            });

            return () => {
                webSocketService.unsubscribe('/user/queue/category-requests');
                webSocketService.unsubscribe('/topic/category-requests');
            };
        }
    }, [user]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            let response;
            if (selectedStatus === 'ALL') {
                response = await categoryRequestApi.getAllRequests(currentPage, 10);
            } else {
                response = await categoryRequestApi.getRequestsByStatus(selectedStatus, currentPage, 10);
            }
            setRequests(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            console.error('İstekler alınamadı:', error);
            toast.error('İstekler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        setProcessingRequest(requestId);
        try {
            await categoryRequestApi.approveRequest(requestId);
            toast.success('İstek başarıyla onaylandı!');
            fetchRequests();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'İstek onaylanamadı';
            toast.error(errorMessage);
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Red sebebi gereklidir');
            return;
        }

        setProcessingRequest(selectedRequest.id);
        try {
            await categoryRequestApi.rejectRequest(selectedRequest.id, rejectionReason);
            toast.success('İstek başarıyla reddedildi!');
            setIsRejectModalOpen(false);
            setRejectionReason('');
            setSelectedRequest(null);
            fetchRequests();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'İstek reddedilemedi';
            toast.error(errorMessage);
        } finally {
            setProcessingRequest(null);
        }
    };

    const openDetailModal = (request) => {
        setSelectedRequest(request);
        setIsDetailModalOpen(true);
    };

    const openRejectModal = (request) => {
        setSelectedRequest(request);
        setIsRejectModalOpen(true);
    };

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Kategori İstek Yönetimi</h2>
                    <p className="text-sm text-gray-600">Satıcıların kategori isteklerini onaylayın veya reddedin</p>
                </div>
            </div>

            {/* Filtreler */}
            <div className="mb-6">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setSelectedStatus('ALL')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                            selectedStatus === 'ALL'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Tümü
                    </button>
                    <button
                        onClick={() => setSelectedStatus('PENDING')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                            selectedStatus === 'PENDING'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Bekleyen
                    </button>
                    <button
                        onClick={() => setSelectedStatus('APPROVED')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                            selectedStatus === 'APPROVED'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Onaylanan
                    </button>
                    <button
                        onClick={() => setSelectedStatus('REJECTED')}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                            selectedStatus === 'REJECTED'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Reddedilen
                    </button>
                </div>
            </div>

            {/* İstekler Listesi */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Yükleniyor...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">İstek Bulunamadı</h3>
                    <p className="text-gray-600">Seçilen durumda kategori isteği bulunmamaktadır.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
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
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p><strong>Satıcı:</strong> {request.seller?.firstName} {request.seller?.lastName}</p>
                                        <p><strong>Oluşturulma:</strong> {formatDate(request.createdAt)}</p>
                                        {request.processedAt && (
                                            <p><strong>İşlenme:</strong> {formatDate(request.processedAt)}</p>
                                        )}
                                        {request.admin && (
                                            <p><strong>İşleyen Admin:</strong> {request.admin.firstName} {request.admin.lastName}</p>
                                        )}
                                        {request.rejectionReason && (
                                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                                <p className="text-red-800 font-medium">Red Sebebi:</p>
                                                <p className="text-red-700">{request.rejectionReason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => openDetailModal(request)}
                                        className="p-2 text-gray-400 hover:text-gray-600"
                                        title="Detayları Görüntüle"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    {request.status === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(request.id)}
                                                disabled={processingRequest === request.id}
                                                className="p-2 text-green-600 hover:text-green-700 disabled:opacity-50"
                                                title="Onayla"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openRejectModal(request)}
                                                disabled={processingRequest === request.id}
                                                className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                                                title="Reddet"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sayfalama */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                    >
                        Önceki
                    </button>
                    <span className="text-sm text-gray-600">
                        Sayfa {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                    >
                        Sonraki
                    </button>
                </div>
            )}

            {/* Detay Modal */}
            {isDetailModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">İstek Detayları</h3>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kategori Adı</label>
                                <p className="mt-1 text-gray-900">{selectedRequest.categoryName}</p>
                            </div>
                            
                            {selectedRequest.description && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                                    <p className="mt-1 text-gray-900">{selectedRequest.description}</p>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Durum</label>
                                <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Satıcı</label>
                                <p className="mt-1 text-gray-900">
                                    {selectedRequest.seller?.firstName} {selectedRequest.seller?.lastName}
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Oluşturulma Tarihi</label>
                                <p className="mt-1 text-gray-900">{formatDate(selectedRequest.createdAt)}</p>
                            </div>
                            
                            {selectedRequest.processedAt && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">İşlenme Tarihi</label>
                                    <p className="mt-1 text-gray-900">{formatDate(selectedRequest.processedAt)}</p>
                                </div>
                            )}
                            
                            {selectedRequest.admin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">İşleyen Admin</label>
                                    <p className="mt-1 text-gray-900">
                                        {selectedRequest.admin.firstName} {selectedRequest.admin.lastName}
                                    </p>
                                </div>
                            )}
                            
                            {selectedRequest.rejectionReason && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Red Sebebi</label>
                                    <p className="mt-1 text-red-700">{selectedRequest.rejectionReason}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Red Modal */}
            {isRejectModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">İsteği Reddet</h3>
                            <button
                                onClick={() => setIsRejectModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-gray-600 mb-4">
                                <strong>{selectedRequest.categoryName}</strong> kategorisi isteğini reddetmek üzeresiniz.
                            </p>
                            
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Red Sebebi *
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Red sebebini açıklayın..."
                                required
                            />
                        </div>
                        
                        <div className="flex items-center justify-end space-x-3">
                            <button
                                onClick={() => setIsRejectModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectionReason.trim() || processingRequest === selectedRequest.id}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {processingRequest === selectedRequest.id ? 'Reddediliyor...' : 'Reddet'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategoryRequests;
