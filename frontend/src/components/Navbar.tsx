import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MyApp</Link>
      </div>
      
      <div className="navbar-menu">
        {user ? (
          <>
            <div className="navbar-item">
              <Link to="/dashboard">Dashboard</Link>
            </div>
            <div className="navbar-item">
              <Link to="/todos">Todos</Link>
            </div>
            <div className="navbar-item">
              <Link to="/images">Images</Link>
            </div>
            <div className="navbar-item">
              <Link to="/notifications">Notifications</Link>
            </div>
            <div className="navbar-item">
              <button onClick={logout} className="navbar-button">Logout</button>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-item">
              <Link to="/login">Login</Link>
            </div>
            <div className="navbar-item">
              <Link to="/register">Register</Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;