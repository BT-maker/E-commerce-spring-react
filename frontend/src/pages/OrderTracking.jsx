import React, { useState } from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import MetaTags from '../components/MetaTags/MetaTags';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import './OrderTracking.css';

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
      case 'delivered': return '#10b981';
      case 'in_transit': return '#3b82f6';
      case 'preparing': return '#f59e0b';
      default: return '#6b7280';
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
    <div className="order-tracking-container">
      <PageTitle title="Sipariş Takibi" />
      <MetaTags 
        title="Sipariş Takibi"
        description="Siparişinizin durumunu takip edin. Sipariş numaranızı girerek güncel bilgilere ulaşın."
        keywords="sipariş takibi, kargo takip, sipariş durumu, shopping sipariş"
      />
      
      <div className="order-tracking-content">
        <h1 className="order-tracking-title">Sipariş Takibi</h1>
        
        {/* Arama Formu */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="tracking-form">
            <div className="search-input-group">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Sipariş numaranızı girin (örn: ORDER123)"
                className="tracking-input"
                disabled={loading}
              />
              <button type="submit" className="search-btn" disabled={loading}>
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <Search size={20} />
                )}
              </button>
            </div>
          </form>
          
          {error && <div className="error-message">{error}</div>}
          
          {/* Örnek Sipariş Numaraları */}
          <div className="example-orders">
            <p>Örnek sipariş numaraları:</p>
            <div className="example-buttons">
              <button onClick={() => setTrackingNumber('ORDER123')} className="example-btn">
                ORDER123 (Teslim Edildi)
              </button>
              <button onClick={() => setTrackingNumber('ORDER456')} className="example-btn">
                ORDER456 (Yolda)
              </button>
              <button onClick={() => setTrackingNumber('ORDER789')} className="example-btn">
                ORDER789 (Hazırlanıyor)
              </button>
            </div>
          </div>
        </div>

        {/* Sipariş Bilgileri */}
        {orderInfo && (
          <div className="order-info">
            <div className="order-header">
              <h2>Sipariş #{orderInfo.orderNumber}</h2>
              <div className="order-status" style={{ color: getStatusColor(orderInfo.status) }}>
                {React.createElement(getStatusIcon(orderInfo.status), { size: 24 })}
                <span>{orderInfo.statusText}</span>
              </div>
            </div>

            {/* Sipariş Detayları */}
            <div className="order-details">
              <div className="detail-section">
                <h3>Sipariş Özeti</h3>
                <div className="order-items">
                  {orderInfo.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                      <span>{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <strong>Toplam: {orderInfo.total}</strong>
                </div>
              </div>

              <div className="detail-section">
                <h3>Teslimat Bilgileri</h3>
                <p><strong>Tahmini Teslimat:</strong> {orderInfo.estimatedDelivery}</p>
                {orderInfo.actualDelivery && (
                  <p><strong>Gerçekleşen Teslimat:</strong> {orderInfo.actualDelivery}</p>
                )}
                <p><strong>Teslimat Adresi:</strong></p>
                <p className="shipping-address">{orderInfo.shippingAddress}</p>
              </div>
            </div>

            {/* Takip Adımları */}
            <div className="tracking-steps">
              <h3>Takip Adımları</h3>
              <div className="steps-container">
                {orderInfo.trackingSteps.map((step, index) => (
                  <div key={index} className={`tracking-step ${step.completed ? 'completed' : ''}`}>
                    <div className="step-icon">
                      {React.createElement(step.icon, { 
                        size: 24, 
                        color: step.completed ? '#10b981' : '#9ca3af' 
                      })}
                    </div>
                    <div className="step-content">
                      <h4>{step.step}</h4>
                      <p>{step.date}</p>
                    </div>
                    {index < orderInfo.trackingSteps.length - 1 && (
                      <div className={`step-connector ${step.completed ? 'completed' : ''}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking; 