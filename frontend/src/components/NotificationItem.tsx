import React from 'react';
import { Notification } from '../api/notificationApi';
import { useNotifications } from '../context/NotificationContext';
import { formatDate } from '../utils/dateUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faTrash, 
  faClock, 
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notification.id);
  };

  const getPriorityClass = () => {
    switch (notification.priority) {
      case 'high':
        return 'priority-high';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-normal';
    }
  };

  return (
    <div 
      className={`notification-item ${!notification.isRead ? 'unread' : ''} ${getPriorityClass()}`}
      onClick={handleMarkAsRead}
    >
      <div className="notification-content">
        <h4 className="notification-title">{notification.title}</h4>
        <p className="notification-message">{notification.message}</p>
        <div className="notification-meta">
          <span className="notification-time">
            <FontAwesomeIcon icon={faClock} />
            {formatDate(notification.createdAt)}
          </span>
          {notification.isRead && (
            <span className="notification-read-status">
              <FontAwesomeIcon icon={faCheckCircle} />
              Read
            </span>
          )}
        </div>
      </div>
      <div className="notification-actions">
        {!notification.isRead && (
          <button 
            className="mark-read-btn"
            onClick={handleMarkAsRead}
            title="Mark as read"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        )}
        <button 
          className="delete-btn"
          onClick={handleDelete}
          title="Delete notification"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;