import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  NotificationsActive as NotificationIcon,
  Delete as DeleteIcon,
  CheckCircle as ReadIcon,
} from '@mui/icons-material';
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
} from '../../store/slices/notificationSlice';

const NotificationList = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No notifications yet
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        maxHeight: 400,
        overflow: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <List>
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <ListItem
              sx={{
                backgroundColor: notification.read ? 'transparent' : 'action.hover',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
              secondaryAction={
                <Box>
                  {!notification.read && (
                    <IconButton
                      edge="end"
                      aria-label="mark as read"
                      onClick={() => handleMarkAsRead(notification.id)}
                      sx={{ mr: 1 }}
                    >
                      <ReadIcon color="primary" />
                    </IconButton>
                  )}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(notification.id)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              }
            >
              <ListItemIcon>
                <NotificationIcon color={notification.read ? 'disabled' : 'primary'} />
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block' }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      {new Date(notification.createdAt).toLocaleString()}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < notifications.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default NotificationList; 