import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">TodoApp</Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
            <Link to="/todos" className="nav-item">Tasks</Link>
            <Link to="/notifications" className="nav-item">Notifications</Link>
            <div className="nav-item notification-nav-item">
              <NotificationBell />
            </div>
            <div className="nav-item user-info">
              <span className="username">{user.username}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/register" className="nav-item">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;