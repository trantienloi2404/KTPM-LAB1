import React, { useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import NotificationItem from '../components/NotificationItem';
import NotificationForm from '../components/NotificationForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faMinus, 
  faCalendarDay, 
  faExclamationCircle, 
  faSpinner,
  faBell,
  faEnvelopeOpenText,
  faEnvelope,
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';

const NotificationPage: React.FC = () => {
  const { 
    notifications, 
    stats,
    loading, 
    error, 
    fetchNotifications, 
    markAllAsRead 
  } = useNotifications();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const toggleForm = () => {
    setShowForm(prev => !prev);
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, typeof notifications>);

  if (!user) {
    return (
      <div className="notification-page">
        <h2>Please login to view your notifications</h2>
      </div>
    );
  }

  return (
    <div className="notification-page">
      <div className="notification-page-header">
        <div className="notification-title">
          <h1>Your Notifications</h1>
          <button 
            className="toggle-form-btn"
            onClick={toggleForm}
            title={showForm ? "Hide form" : "Create notification"}
          >
            <FontAwesomeIcon icon={showForm ? faMinus : faPlus} />
          </button>
        </div>
        
        {stats && (
          <div className="notification-stats">
            <span className="stat-item">
              <FontAwesomeIcon icon={faBell} />
              Total: {stats.total}
            </span>
            <span className="stat-item unread">
              <FontAwesomeIcon icon={faEnvelope} />
              Unread: {stats.unread}
            </span>
            <span className="stat-item read">
              <FontAwesomeIcon icon={faEnvelopeOpenText} />
              Read: {stats.read}
            </span>
          </div>
        )}
        
        {stats && stats.unread > 0 && (
          <button 
            className="mark-all-read-btn"
            onClick={handleMarkAllAsRead}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faCheckDouble} />
            Mark all as read
          </button>
        )}
      </div>

      {showForm && (
        <NotificationForm 
          onSuccess={() => {
            setShowForm(false);
            fetchNotifications();
          }} 
          onCancel={() => setShowForm(false)}
        />
      )}

      {error && (
        <div className="notification-error">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {error}
        </div>
      )}
      
      {loading && notifications.length === 0 ? (
        <div className="notification-loading">
          <div className="loading-spinner"></div>
          <div>Loading notifications...</div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="notification-empty">
          <FontAwesomeIcon icon={faBell} className="empty-icon" />
          <p>You don't have any notifications yet.</p>
          {!showForm && (
            <button 
              className="create-first-notification-btn"
              onClick={() => setShowForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              Create your first notification
            </button>
          )}
        </div>
      ) : (
        Object.entries(groupedNotifications).map(([date, notificationsForDate]) => (
          <div key={date} className="notification-group">
            <h3 className="notification-date-header">
              <FontAwesomeIcon icon={faCalendarDay} />
              {date}
            </h3>
            <div className="notification-list">
              {notificationsForDate.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPage;