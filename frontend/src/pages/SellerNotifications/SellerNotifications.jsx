import React, { useState, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle, Clock, Filter, Search } from 'lucide-react';
import PageTitle from '../../components/PageTitle/PageTitle';
import MetaTags from '../../components/MetaTags/MetaTags';

const SellerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - gerçek uygulamada API'den gelecek
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: "Yeni Sipariş Alındı",
        message: "Sony WH-1000XM5 kulaklık için yeni bir sipariş alındı. Sipariş #12345",
        type: "order",
        priority: "high",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 dakika önce
        orderId: "12345"
      },
      {
        id: 2,
        title: "Stok Uyarısı",
        message: "Nike Air Max ürününüzün stoku 5 adete düştü. Stok yenilemeyi düşünün.",
        type: "stock",
        priority: "medium",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 saat önce
        productId: "prod-123"
      },
      {
        id: 3,
        title: "Kampanya Onaylandı",
        message: "Black Friday kampanyanız onaylandı ve aktif edildi.",
        type: "campaign",
        priority: "low",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 gün önce
        campaignId: "camp-456"
      },
      {
        id: 4,
        title: "Ödeme Alındı",
        message: "Sipariş #12344 için ödeme alındı. Tutar: 1.299,99 ₺",
        type: "payment",
        priority: "high",
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 gün önce
        orderId: "12344",
        amount: 1299.99
      },
      {
        id: 5,
        title: "Ürün İnceleme",
        message: "Stanley Termos ürününüze 5 yıldız değerlendirme yapıldı.",
        type: "review",
        priority: "low",
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 gün önce
        productId: "prod-789",
        rating: 5
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type, priority) => {
    const iconClass = `w-5 h-5 ${
      priority === 'high' ? 'text-red-500' : 
      priority === 'medium' ? 'text-orange-500' : 'text-blue-500'
    }`;

    switch (type) {
      case 'order':
        return <Bell className={iconClass} />;
      case 'stock':
        return <AlertCircle className={iconClass} />;
      case 'campaign':
        return <CheckCircle className={iconClass} />;
      case 'payment':
        return <CheckCircle className={iconClass} />;
      case 'review':
        return <Info className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-orange-500 bg-orange-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} dakika önce`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} saat önce`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} gün önce`;
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'read' && notification.isRead);
    
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="p-6">
        <PageTitle title="Bildirimler" />
        <MetaTags 
          title="Bildirimler"
          description="Satıcı paneli bildirimleri"
          keywords="bildirimler, satıcı, panel"
        />
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageTitle title="Bildirimler" />
      <MetaTags 
        title="Bildirimler"
        description="Satıcı paneli bildirimleri"
        keywords="bildirimler, satıcı, panel"
      />
      
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bildirimler</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : 'Tüm bildirimler okundu'}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Tümünü Okundu İşaretle</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Bildirimlerde ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            
            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Tümü</option>
                <option value="unread">Okunmamış</option>
                <option value="read">Okunmuş</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchQuery ? 'Arama sonucu bulunamadı' : 'Bildirim bulunmuyor'}
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 'Farklı anahtar kelimeler deneyin' : 'Henüz bildiriminiz bulunmuyor'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                    notification.isRead 
                      ? 'bg-white border-gray-200' 
                      : `${getPriorityColor(notification.priority)} border-gray-200`
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${
                            notification.isRead ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className={`text-sm mb-2 ${
                          notification.isRead ? 'text-gray-600' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(notification.createdAt)}</span>
                          </div>
                          <span className="capitalize">{notification.type}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                            notification.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {notification.priority === 'high' ? 'Yüksek' :
                             notification.priority === 'medium' ? 'Orta' : 'Düşük'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Okundu işaretle"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Sil"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerNotifications;
