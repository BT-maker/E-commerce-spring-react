import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./Orders.css";
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/orders");
        if (res.status === 200 && Array.isArray(res.data)) {
          setOrders(res.data);
          setFilteredOrders(res.data);
        } else if (res.status === 401) {
          setError("Giriş yapmanız gerekiyor.");
        } else {
          setError("Siparişler alınamadı.");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Giriş yapmanız gerekiyor.");
        } else {
          setError("Siparişler alınamadı. Lütfen tekrar deneyin.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filtreleme işlemi
  useEffect(() => {
    let filtered = orders;

    // Durum filtresi
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'BEKLİYOR': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⏳' },
      'HAZIRLANIYOR': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🔧' },
      'KARGODA': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '📦' },
      'TESLİM EDİLDİ': { color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' },
      'İPTAL EDİLDİ': { color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' }
    };

    const config = statusConfig[status] || statusConfig['BEKLİYOR'];
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  const getOrderSummary = (order) => {
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueProducts = order.items.length;
    
    return {
      totalItems,
      uniqueProducts,
      date: new Date(order.createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: new Date(order.createdAt).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const generateTrackingNumber = (orderId) => {
    // Sipariş ID'sinden takip numarası oluştur
    const hash = orderId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `TRK${Math.abs(hash).toString().slice(0, 8).padStart(8, '0')}`;
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto mt-6 sm:mt-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Siparişlerim</h2>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="flex justify-between items-start mb-4">
                <Skeleton height={24} width={200} />
                <Skeleton height={20} width={100} />
              </div>
              <Skeleton height={16} width={150} className="mb-4" />
              <div className="space-y-2">
                <Skeleton height={40} />
                <Skeleton height={40} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-6 sm:mt-10 px-4">
      <PageTitle title="Siparişlerim" />
      <MetaTags 
        title="Siparişlerim"
        description="Geçmiş siparişlerinizi görüntüleyin. Sipariş durumlarını takip edin ve sipariş geçmişinizi inceleyin."
        keywords="siparişler, sipariş geçmişi, sipariş takibi"
      />
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-0">Siparişlerim</h2>
          
          {/* Filtreler */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Arama */}
            <div className="relative">
              <input
                type="text"
                placeholder="Sipariş ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Durum Filtresi */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="BEKLİYOR">Bekliyor</option>
              <option value="HAZIRLANIYOR">Hazırlanıyor</option>
              <option value="KARGODA">Kargoda</option>
              <option value="TESLİM EDİLDİ">Teslim Edildi</option>
              <option value="İPTAL EDİLDİ">İptal Edildi</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="text-center py-8">
            <div className="text-red-600 text-lg font-medium">{error}</div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {orders.length === 0 ? "Henüz siparişiniz yok" : "Aradığınız kriterlere uygun sipariş bulunamadı"}
            </h3>
            <p className="text-gray-500">
              {orders.length === 0 
                ? "İlk siparişinizi vermek için ürünlerimizi keşfedin!" 
                : "Farklı filtreler deneyebilirsiniz."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const summary = getOrderSummary(order);
              const isExpanded = expandedOrders.has(order.id);
              const trackingNumber = generateTrackingNumber(order.id);
              
              return (
                <div key={order.id} className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
                  {/* Sipariş Başlığı */}
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Sipariş #{order.id.slice(-8).toUpperCase()}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>📅 {summary.date}</span>
                        <span>🕒 {summary.time}</span>
                        <span>📦 {summary.totalItems} ürün</span>
                        <span>🛍️ {summary.uniqueProducts} farklı ürün</span>
                        <span>🚚 Takip: {trackingNumber}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {Number(order.totalPrice).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                      </div>
                    </div>
                  </div>

                  {/* Genişlet/Daralt Butonu */}
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          Detayları Gizle
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Detayları Göster
                        </>
                      )}
                    </button>
                  </div>

                  {/* Genişletilmiş İçerik */}
                  {isExpanded && (
                    <>
                      {/* Ürün Listesi */}
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Sipariş Edilen Ürünler</h4>
                        <div className="grid gap-4">
                          {order.items.map((item, idx) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                {item.product?.imageUrl1 || item.product?.imageUrl ? (
                  <img 
                    src={item.product.imageUrl1 || item.product.imageUrl} 
                                    alt={item.product.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <span className="text-gray-400 text-2xl">📦</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{item.product?.name || 'Ürün adı bulunamadı'}</h4>
                                <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-gray-800">
                                  {Number(item.price).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                                </div>
                                <div className="text-sm text-gray-600">
                                  Toplam: {(item.price * item.quantity).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sipariş Detayları */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Sipariş Detayları</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">🆔 Sipariş ID:</span>
                              <span className="font-mono font-medium">{order.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">🚚 Takip Numarası:</span>
                              <span className="font-mono font-medium">{trackingNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">📅 Sipariş Tarihi:</span>
                              <span className="font-medium">{summary.date}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">📊 Durum:</span>
                              <span className="font-medium">{order.status}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">📦 Toplam Ürün:</span>
                              <span className="font-medium">{summary.totalItems} adet</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">💰 Toplam Tutar:</span>
                              <span className="font-bold text-lg text-gray-800">
                                {Number(order.totalPrice).toLocaleString("tr-TR", {minimumFractionDigits:2})} ₺
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 