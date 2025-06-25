import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      
      <div className="dashboard-welcome">
        <h2>Welcome, {user?.username}!</h2>
        <p>You are now authenticated and can access protected resources.</p>
      </div>
      
      <div className="dashboard-content">
        <h3>Your Account</h3>
        <div className="account-info">
          <p><strong>Username:</strong> {user?.username}</p>
          {/* You could add more user details here */}
        </div>
        
        <h3>Available Services</h3>
        <div className="services-grid">
          <div className="service-card">
            <h4>Todo Tasks</h4>
            <p>Manage your tasks and to-do lists</p>
            <a href="/todos" className="service-link">Go to Tasks</a>
          </div>
          
          <div className="service-card">
            <h4>Notifications</h4>
            <p>View your recent notifications</p>
            <a href="/notifications" className="service-link">Go to Notifications</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;