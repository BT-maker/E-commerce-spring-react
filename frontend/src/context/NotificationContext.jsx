import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Bildirimleri getir
  const fetchNotifications = async () => {
    if (window.BACKEND_OFFLINE) return;
    
    setLoading(true);
    try {
      const response = await api.get('/notifications', { withCredentials: true });
      setNotifications(response.data || []);
      setUnreadCount(response.data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.log('Bildirimler alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  // Bildirimi okundu olarak işaretle
  const markAsRead = async (notificationId) => {
    if (window.BACKEND_OFFLINE) return;
    
    try {
      await api.put(`/notifications/${notificationId}/read`, {}, { withCredentials: true });
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.log('Bildirim güncellenemedi:', error);
    }
  };

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsRead = async () => {
    if (window.BACKEND_OFFLINE) return;
    
    try {
      await api.put('/notifications/read-all', {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.log('Bildirimler güncellenemedi:', error);
    }
  };

  // Yeni bildirim ekle (local state için)
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 