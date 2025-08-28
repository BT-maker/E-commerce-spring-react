import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Package, Tag, AlertCircle, ShoppingCart, Star, Settings, Trash2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import './NotificationBell.css';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const dropdownRef = useRef(null);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bildirim tipine göre ikon ve renk getir
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_STATUS':
        return { icon: Package, color: 'text-[#ff6000]', bgColor: 'bg-[rgba(255,96,0,0.1)]' };
      case 'PROMOTION':
        return { icon: Tag, color: 'text-[#ff6000]', bgColor: 'bg-[rgba(255,96,0,0.1)]' };
      case 'SYSTEM':
        return { icon: Settings, color: 'text-[#ff6000]', bgColor: 'bg-[rgba(255,96,0,0.1)]' };
      case 'REVIEW':
        return { icon: Star, color: 'text-[#ff6000]', bgColor: 'bg-[rgba(255,96,0,0.1)]' };
      case 'CART':
        return { icon: ShoppingCart, color: 'text-[#ff6000]', bgColor: 'bg-[rgba(255,96,0,0.1)]' };
      case 'SELLER_REGISTRATION':
        return { icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
      default:
        return { icon: Bell, color: 'text-[#ff6000]', bgColor: 'bg-[rgba(255,96,0,0.1)]' };
    }
  };

  // Bildirimleri filtrele
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    return notification.type === activeFilter;
  });

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    // Bildirim tipine göre yönlendirme yapılabilir
    setIsOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return 'Az önce';
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInDays < 7) return `${diffInDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  const getUnreadCountByType = (type) => {
    return notifications.filter(n => !n.read && (type === 'all' ? true : n.type === type)).length;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-primary hover:text-[#ff6000] transition-colors duration-200"
        aria-label="Bildirimler"
      >
        <Bell size={20} className={`transition-transform duration-200 ${isOpen ? 'rotate-12' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-slideDown">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-text-primary">Bildirimler</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#ff6000] hover:text-[#ea580c] flex items-center gap-1 transition-colors"
                >
                  <Check size={14} />
                  Tümünü okundu işaretle
                </button>
              )}
            </div>

            {/* Filtreler */}
            <div className="flex gap-1 pb-1">
              {[
                { key: 'all', label: 'Tümü', count: notifications.length },
                { key: 'unread', label: 'Okunmamış', count: getUnreadCountByType('all') },
                { key: 'ORDER_STATUS', label: 'Sipariş', count: getUnreadCountByType('ORDER_STATUS') },
                { key: 'PROMOTION', label: 'Kampanya', count: getUnreadCountByType('PROMOTION') },
                { key: 'SYSTEM', label: 'Sistem', count: getUnreadCountByType('SYSTEM') }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-1.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeFilter === filter.key
                      ? 'bg-[#ff6000] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span className="ml-1 bg-white dark:bg-gray-800 text-[#ff6000] rounded-full px-1 text-xs">
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bildirimler Listesi */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">
                <Bell size={32} className="mx-auto mb-3 opacity-50" />
                <p className="font-medium">Bildirim bulunamadı</p>
                <p className="text-sm mt-1">
                  {activeFilter === 'all' ? 'Henüz bildiriminiz yok' : 'Bu kategoride bildirim yok'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const { icon: Icon, color, bgColor } = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                                      className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${
                    !notification.read ? 'bg-[rgba(255,96,0,0.05)] dark:bg-[rgba(255,96,0,0.1)]' : ''
                  }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* İkon */}
                      <div className={`p-2 rounded-full ${bgColor} dark:bg-gray-700 flex-shrink-0`}>
                        <Icon size={16} className={color} />
                      </div>

                      {/* İçerik */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className={`text-sm font-medium truncate ${
                            !notification.read ? 'text-text-primary' : 'text-text-secondary'
                          }`}>
                            {notification.title}
                          </p>
                                              {!notification.read && (
                      <div className="w-2 h-2 bg-[#ff6000] rounded-full ml-2 mt-1 flex-shrink-0"></div>
                    )}
                        </div>
                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-text-secondary mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  {unreadCount} okunmamış bildirim
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-[#ff6000] hover:text-[#ea580c] transition-colors"
                >
                  Tümünü Görüntüle
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 