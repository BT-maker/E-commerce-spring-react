import api from './api';

/**
 * CategoryRequest API servisi
 */
class CategoryRequestApiService {
    
    /**
     * Yeni kategori isteği oluşturur
     */
    async createRequest(categoryName, description) {
        const response = await api.post('/category-requests', {
            categoryName,
            description
        });
        return response.data;
    }
    
    /**
     * Satıcının isteklerini getirir
     */
    async getSellerRequests(page = 0, size = 10) {
        const response = await api.get(`/category-requests/seller?page=${page}&size=${size}`);
        return response.data;
    }
    
    /**
     * Tüm istekleri getirir (admin için)
     */
    async getAllRequests(page = 0, size = 10) {
        const response = await api.get(`/category-requests/admin?page=${page}&size=${size}`);
        return response.data;
    }
    
    /**
     * Bekleyen istekleri getirir (admin için)
     */
    async getPendingRequests() {
        const response = await api.get('/category-requests/admin/pending');
        return response.data;
    }
    
    /**
     * Belirli durumdaki istekleri getirir (admin için)
     */
    async getRequestsByStatus(status, page = 0, size = 10) {
        const response = await api.get(`/category-requests/admin/status/${status}?page=${page}&size=${size}`);
        return response.data;
    }
    
    /**
     * İsteği ID'ye göre getirir
     */
    async getRequestById(requestId) {
        const response = await api.get(`/category-requests/${requestId}`);
        return response.data;
    }
    
    /**
     * İsteği onaylar (admin için)
     */
    async approveRequest(requestId) {
        const response = await api.put(`/category-requests/${requestId}/approve`);
        return response.data;
    }
    
    /**
     * İsteği reddeder (admin için)
     */
    async rejectRequest(requestId, rejectionReason) {
        const response = await api.put(`/category-requests/${requestId}/reject`, {
            rejectionReason
        });
        return response.data;
    }
    
    /**
     * Satıcının bekleyen istek sayısını getirir
     */
    async getPendingRequestCount() {
        const response = await api.get('/category-requests/seller/pending-count');
        return response.data;
    }
    
    /**
     * Kategori adı zaten istek edilmiş mi kontrol eder
     */
    async isCategoryNameAlreadyRequested(categoryName) {
        const response = await api.get(`/category-requests/check-name?categoryName=${encodeURIComponent(categoryName)}`);
        return response.data;
    }
    
    /**
     * Benzer kategori önerileri getirir
     */
    async getSimilarCategorySuggestions(categoryName) {
        const response = await api.get(`/category-requests/suggestions?categoryName=${encodeURIComponent(categoryName)}`);
        return response.data;
    }
    
    /**
     * İsteği siler (admin için)
     */
    async deleteRequest(requestId) {
        await api.delete(`/category-requests/${requestId}`);
    }
}

export default new CategoryRequestApiService();
