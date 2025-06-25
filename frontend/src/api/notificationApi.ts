import axios from 'axios';

// Create axios instance with credentials
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors for debugging
api.interceptors.request.use(request => {
  console.log('Notification API Request:', request.method, request.url, request.data);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Notification API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('Notification API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  priority: 'low' | 'normal' | 'high';
  data?: any;
  readAt?: Date | string | null;
  createdAt: Date | string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  userId?: string;
  priority?: 'low' | 'normal' | 'high';
  data?: any;
}

export const notificationApi = {
  // Get all notifications for the current user
  getNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      console.log(`Fetching notifications for user: ${userId}`);
      const response = await api.get(`/notifications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Get unread notifications for the current user
  getUnreadNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      const response = await api.get(`/notifications/user/${userId}/unread`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  },

  // Create a new notification
  createNotification: async (notification: CreateNotificationDto): Promise<Notification> => {
    try {
      console.log('Creating notification:', notification);
      
      // Ensure data field is properly formatted
      const formattedNotification = {
        ...notification,
        data: notification.data || undefined,
      };
      
      const response = await api.post('/notifications', formattedNotification);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Mark a notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userId: string): Promise<{ message: string }> => {
    try {
      const response = await api.patch(`/notifications/user/${userId}/read-all`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Get notification statistics for a user
  getStats: async (userId: string): Promise<NotificationStats> => {
    try {
      const response = await api.get(`/notifications/stats/${userId}`);
      return response.data as NotificationStats;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      return { total: 0, unread: 0, read: 0 };
    }
  }
};