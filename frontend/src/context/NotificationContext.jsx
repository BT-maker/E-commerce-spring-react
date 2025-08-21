import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import webSocketService from '../services/webSocketService';
import { useAuth } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Bildirimleri getir
  const fetchNotifications = async () => {
    if (window.BACKEND_OFFLINE) return;
    
    setLoading(true);
    try {
      const response = await api.get('/notifications', { withCredentials: true });
      const notificationsData = Array.isArray(response.data) ? response.data : [];
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.read).length || 0);
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
    // Sadece kullanıcı giriş yapmışsa bildirimleri yükle
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      fetchNotifications();
    } else {
      console.log('Token bulunamadı, bildirimler yüklenmedi');
    }
  }, []);

  // WebSocket bildirimleri için useEffect
  useEffect(() => {
    if (user) {
      // Kullanıcı bildirimlerini dinle
      webSocketService.subscribe('/user/queue/notifications', (notification) => {
        console.log('Yeni bildirim:', notification);
        
        // Bildirimi listeye ekle
        const newNotification = {
          id: notification.id || Date.now().toString(),
          title: notification.title || 'Yeni Bildirim',
          message: notification.message || 'Bildirim mesajı',
          type: notification.type || 'SYSTEM',
          read: false,
          createdAt: notification.createdAt || new Date().toISOString(),
          ...notification
        };
        
        addNotification(newNotification);
      });

      // Admin ise admin bildirimlerini de dinle
      if (user.role === 'ADMIN') {
        webSocketService.subscribe('/topic/admin-notifications', (notification) => {
          console.log('Yeni admin bildirimi:', notification);
          
          // Bildirimi listeye ekle
          const newNotification = {
            id: notification.id || Date.now().toString(),
            title: notification.title || 'Yeni Admin Bildirimi',
            message: notification.message || 'Admin bildirimi',
            type: 'SELLER_REGISTRATION',
            read: false,
            createdAt: notification.createdAt || new Date().toISOString(),
            ...notification
          };
          
          addNotification(newNotification);
        });
      }

      return () => {
        webSocketService.unsubscribe('/user/queue/notifications');
        if (user.role === 'ADMIN') {
          webSocketService.unsubscribe('/topic/admin-notifications');
        }
      };
    }
  }, [user]);

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