import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import NotificationItem from './NotificationItem';
import NotificationForm from './NotificationForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faPlus, 
  faCheckDouble, 
  faArrowLeft,
  faExclamationCircle,
  faBell,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

interface NotificationListProps {
  onClose: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAllAsRead,
    fetchNotifications
  } = useNotifications();
  const [showForm, setShowForm] = useState(false);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>{showForm ? 'Create Notification' : 'Notifications'}</h3>
        <div className="notification-actions">
          {!showForm && (
            <>
              <button 
                className="add-notification-btn"
                onClick={() => setShowForm(true)}
                title="Create notification"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read-btn"
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faCheckDouble} />
                  Mark all
                </button>
              )}
            </>
          )}
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      
      {showForm ? (
        <div className="dropdown-form-container">
          <NotificationForm 
            onSuccess={() => {
              setShowForm(false);
              fetchNotifications();
            }} 
            onCancel={() => setShowForm(false)}
          />
          <button 
            className="back-to-list-btn"
            onClick={() => setShowForm(false)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to notifications
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="notification-error">
              <FontAwesomeIcon icon={faExclamationCircle} />
              {error}
            </div>
          )}
          
          <div className="notification-list">
            {loading && notifications.length === 0 ? (
              <div className="notification-loading">
                <div className="loading-spinner"></div>
                <div>Loading...</div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <FontAwesomeIcon icon={faBell} className="empty-icon" />
                <p>No notifications</p>
                <button 
                  className="create-first-notification-btn"
                  onClick={() => setShowForm(true)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Create notification
                </button>
              </div>
            ) : (
              notifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationList;