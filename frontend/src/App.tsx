import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './pages/Dashboard';
import TodoPage from './pages/TodoPage';
import './styles/App.css';
import './styles/Todo.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TodoProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/todos" 
                element={
                  <ProtectedRoute>
                    <TodoPage />
                  </ProtectedRoute>
                } 
              />
              {/* Redirect root to dashboard if authenticated, otherwise to login */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* Add more routes here as you develop the app */}
            </Routes>
          </div>
        </Router>
      </TodoProvider>
    </AuthProvider>
  );
};

export default App;