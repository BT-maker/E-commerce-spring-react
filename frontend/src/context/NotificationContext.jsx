import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import webSocketService from '../services/webSocketService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast'; // Import react-hot-toast

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

  // Yeni bildirim ekle ve toast göster
  const addNotification = (notification) => {
    const newNotification = {
        id: notification.id || Date.now(),
        title: notification.title || 'Bildirim',
        message: notification.message,
        type: notification.type || 'info',
        read: false,
        createdAt: new Date().toISOString(),
    };

    // Show toast notification
    switch (newNotification.type) {
        case 'success':
            toast.success(newNotification.message);
            break;
        case 'error':
            toast.error(newNotification.message);
            break;
        case 'warning':
            toast(newNotification.message, { icon: '⚠️' });
            break;
        case 'info':
        default:
            toast(newNotification.message, { icon: 'ℹ️' });
            break;
    }

    setNotifications(prev => [newNotification, ...prev]);
    if (!newNotification.read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      fetchNotifications();
    }
  }, []);

  useEffect(() => {
    if (user) {
      webSocketService.subscribe('/user/queue/notifications', (notification) => {
        addNotification(notification);
      });

      if (user.role === 'ADMIN') {
        webSocketService.subscribe('/topic/admin-notifications', (notification) => {
          addNotification(notification);
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