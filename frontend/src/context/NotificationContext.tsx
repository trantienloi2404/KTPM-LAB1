import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { notificationApi, Notification, NotificationStats } from '../api/notificationApi';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats | null;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  fetchUnreadNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  stats: null,
  loading: false,
  error: null,
  fetchNotifications: async () => {},
  fetchUnreadNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {},
});

interface NotificationProviderProps {
  children: ReactNode;
  pollingInterval?: number; // in milliseconds
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  children,
  pollingInterval = 30000 // Default to 30 seconds
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  // Fetch all notifications for the current user
  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await notificationApi.getNotifications(user.id.toString());
      setNotifications(data as Notification[]);
      setUnreadCount((data as Notification[]).filter((notification: Notification) => !notification.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch only unread notifications for the current user
  const fetchUnreadNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await notificationApi.getUnreadNotifications(user.id.toString()) as Notification[];
      // Update unread count without replacing all notifications
      setUnreadCount(data.length);
      
      // Merge unread notifications with existing ones
      setNotifications(prev => {
        const existingIds = new Set(prev.map((n: Notification) => n.id));
        const newNotifications = data.filter((n: Notification) => !existingIds.has(n.id));
        return [...newNotifications, ...prev];
      });
    } catch (err) {
      console.error('Error fetching unread notifications:', err);
      setError('Failed to fetch unread notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch notification statistics
  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const data = await notificationApi.getStats(user.id.toString());
      setStats(data);
      setUnreadCount(data.unread);
    } catch (err) {
      console.error('Error fetching notification stats:', err);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedNotification = await notificationApi.markAsRead(id);
      
      // Update notifications in state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, isRead: true, readAt: new Date() } : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          unread: Math.max(0, stats.unread - 1),
          read: stats.read + 1
        });
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read for the current user
  const markAllAsRead = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await notificationApi.markAllAsRead(user.id.toString());
      
      // Update all notifications in state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true, readAt: new Date() }))
      );
      
      // Update unread count
      setUnreadCount(0);
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          unread: 0,
          read: stats.total
        });
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await notificationApi.deleteNotification(id);
      
      // Remove notification from state
      const notification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      // Update unread count if needed
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          total: Math.max(0, stats.total - 1),
          unread: notification && !notification.isRead ? Math.max(0, stats.unread - 1) : stats.unread,
          read: notification && notification.isRead ? Math.max(0, stats.read - 1) : stats.read
        });
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load of notifications and stats
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchStats();
    }
  }, [user]);

  // Set up polling for new notifications
  useEffect(() => {
    if (!user) return;
    
    const pollInterval = setInterval(() => {
      fetchUnreadNotifications();
      fetchStats();
    }, pollingInterval);
    
    return () => clearInterval(pollInterval);
  }, [user, pollingInterval]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        stats,
        loading,
        error,
        fetchNotifications,
        fetchUnreadNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);