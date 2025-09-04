import React, { useState } from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, Loader2, MapPin, Calendar, CreditCard } from 'lucide-react';

const OrderTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Örnek sipariş durumları
  const orderStatuses = {
    'ORDER123': {
      orderNumber: 'ORDER123',
      status: 'delivered',
      statusText: 'Teslim Edildi',
      estimatedDelivery: '2024-01-15',
      actualDelivery: '2024-01-14',
      items: [
        { name: 'iPhone 15 Pro', quantity: 1, price: '45,999 ₺' },
        { name: 'AirPods Pro', quantity: 1, price: '7,999 ₺' }
      ],
      total: '53,998 ₺',
      shippingAddress: 'Levent Mahallesi, Büyükdere Caddesi No:123, Şişli/İstanbul',
      trackingSteps: [
        { step: 'Sipariş Alındı', date: '2024-01-10 14:30', completed: true, icon: CheckCircle },
        { step: 'Hazırlanıyor', date: '2024-01-11 09:15', completed: true, icon: Package },
        { step: 'Kargoya Verildi', date: '2024-01-12 16:45', completed: true, icon: Truck },
        { step: 'Yolda', date: '2024-01-13 08:30', completed: true, icon: Truck },
        { step: 'Teslim Edildi', date: '2024-01-14 11:20', completed: true, icon: CheckCircle }
      ]
    },
    'ORDER456': {
      orderNumber: 'ORDER456',
      status: 'in_transit',
      statusText: 'Yolda',
      estimatedDelivery: '2024-01-18',
      items: [
        { name: 'Samsung Galaxy S24', quantity: 1, price: '32,999 ₺' }
      ],
      total: '32,999 ₺',
      shippingAddress: 'Kadıköy Mahallesi, Moda Caddesi No:45, Kadıköy/İstanbul',
      trackingSteps: [
        { step: 'Sipariş Alındı', date: '2024-01-12 10:15', completed: true, icon: CheckCircle },
        { step: 'Hazırlanıyor', date: '2024-01-13 14:30', completed: true, icon: Package },
        { step: 'Kargoya Verildi', date: '2024-01-14 09:45', completed: true, icon: Truck },
        { step: 'Yolda', date: '2024-01-15 08:20', completed: true, icon: Truck },
        { step: 'Teslim Edilecek', date: '2024-01-18', completed: false, icon: Clock }
      ]
    },
    'ORDER789': {
      orderNumber: 'ORDER789',
      status: 'preparing',
      statusText: 'Hazırlanıyor',
      estimatedDelivery: '2024-01-20',
      items: [
        { name: 'MacBook Air M2', quantity: 1, price: '42,999 ₺' },
        { name: 'Magic Mouse', quantity: 1, price: '1,299 ₺' }
      ],
      total: '44,298 ₺',
      shippingAddress: 'Beşiktaş Mahallesi, Barbaros Bulvarı No:67, Beşiktaş/İstanbul',
      trackingSteps: [
        { step: 'Sipariş Alındı', date: '2024-01-15 16:45', completed: true, icon: CheckCircle },
        { step: 'Hazırlanıyor', date: '2024-01-16 11:30', completed: true, icon: Package },
        { step: 'Kargoya Verilecek', date: '2024-01-17', completed: false, icon: Clock },
        { step: 'Yolda', date: '2024-01-18', completed: false, icon: Clock },
        { step: 'Teslim Edilecek', date: '2024-01-20', completed: false, icon: Clock }
      ]
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Lütfen sipariş numarasını girin.');
      return;
    }

    setLoading(true);
    setError('');
    setOrderInfo(null);

    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      const order = orderStatuses[trackingNumber.toUpperCase()];
      if (order) {
        setOrderInfo(order);
      } else {
        setError('Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol edin.');
      }
      setLoading(false);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'in_transit': return 'text-blue-600';
      case 'preparing': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100';
      case 'in_transit': return 'bg-blue-100';
      case 'preparing': return 'bg-orange-100';
      default: return 'bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'in_transit': return Truck;
      case 'preparing': return Package;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen ">
      <PageTitle title="Sipariş Takibi" />
      <MetaTags 
        title="Sipariş Takibi"
        description="Siparişinizin durumunu takip edin. Sipariş numaranızı girerek güncel bilgilere ulaşın."
        keywords="sipariş takibi, kargo takip, sipariş durumu, shopping sipariş"
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sipariş Takibi</h1>
          <p className="text-xl text-gray-600">Siparişinizin durumunu takip edin ve güncel bilgilere ulaşın</p>
        </div>
        
        {/* Arama Formu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Sipariş numaranızı girin (örn: ORDER123)"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={loading}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <button 
                type="submit" 
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Aranıyor...</span>
                  </>
                ) : (
                  <span>Ara</span>
                )}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}
          
          {/* Örnek Sipariş Numaraları */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Örnek sipariş numaraları:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => setTrackingNumber('ORDER123')} 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
              >
                ORDER123 (Teslim Edildi)
              </button>
              <button 
                onClick={() => setTrackingNumber('ORDER456')} 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
              >
                ORDER456 (Yolda)
              </button>
              <button 
                onClick={() => setTrackingNumber('ORDER789')} 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
              >
                ORDER789 (Hazırlanıyor)
              </button>
            </div>
          </div>
        </div>

        {/* Sipariş Bilgileri */}
        {orderInfo && (
          <div className="space-y-8">
            {/* Sipariş Başlığı ve Durum */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Sipariş #{orderInfo.orderNumber}</h2>
                  <p className="text-gray-600 mt-1">Sipariş detayları ve takip bilgileri</p>
                </div>
                <div className={`mt-4 md:mt-0 flex items-center space-x-3 px-4 py-2 rounded-lg ${getStatusBgColor(orderInfo.status)}`}>
                  {React.createElement(getStatusIcon(orderInfo.status), { 
                    size: 24, 
                    className: getStatusColor(orderInfo.status)
                  })}
                  <span className={`font-semibold ${getStatusColor(orderInfo.status)}`}>
                    {orderInfo.statusText}
                  </span>
                </div>
              </div>

              {/* Sipariş Detayları Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sipariş Özeti */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <h3 className="text-xl font-semibold text-gray-900">Sipariş Özeti</h3>
                  </div>
                  <div className="space-y-3">
                    {orderInfo.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-600">x{item.quantity}</span>
                          <span className="font-semibold text-gray-900">{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Toplam</span>
                      <span className="text-xl font-bold text-orange-600">{orderInfo.total}</span>
                    </div>
                  </div>
                </div>

                {/* Teslimat Bilgileri */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <h3 className="text-xl font-semibold text-gray-900">Teslimat Bilgileri</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Tahmini Teslimat</p>
                        <p className="font-medium text-gray-900">{orderInfo.estimatedDelivery}</p>
                      </div>
                    </div>
                    {orderInfo.actualDelivery && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Gerçekleşen Teslimat</p>
                          <p className="font-medium text-gray-900">{orderInfo.actualDelivery}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Teslimat Adresi</p>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">
                        {orderInfo.shippingAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Takip Adımları */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Takip Adımları</h3>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {/* Bağlantı çizgisi */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-8">
                    {orderInfo.trackingSteps.map((step, index) => (
                      <div key={index} className="relative flex items-start space-x-6">
                        {/* İkon */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {React.createElement(step.icon, { size: 20 })}
                        </div>
                        
                        {/* İçerik */}
                        <div className="flex-1 min-w-0">
                          <div className={`p-6 rounded-xl ${
                            step.completed 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-gray-50 border border-gray-200'
                          }`}>
                            <h4 className={`font-semibold mb-2 ${
                              step.completed ? 'text-green-900' : 'text-gray-700'
                            }`}>
                              {step.step}
                            </h4>
                            <p className={`text-sm ${
                              step.completed ? 'text-green-700' : 'text-gray-500'
                            }`}>
                              {step.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking; 