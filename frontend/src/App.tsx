import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './pages/Dashboard';
import TodoPage from './pages/TodoPage';
import NotificationPage from './pages/NotificationPage';
import './styles/App.css';
import './styles/Todo.css';
import './styles/Notification.css';
// Import Font Awesome icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faBell, 
  faCheck, 
  faTrash, 
  faTimes, 
  faPlus, 
  faMinus,
  faPaperPlane,
  faCalendarDay,
  faClock,
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faHeading,
  faCommentAlt,
  faFlagCheckered,
  faCodeBranch,
  faArrowDown,
  faArrowUp,
  faEquals,
  faSpinner,
  faEnvelope,
  faEnvelopeOpenText,
  faCheckDouble,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

// Add icons to the library
library.add(
  faBell, 
  faCheck, 
  faTrash, 
  faTimes, 
  faPlus, 
  faMinus,
  faPaperPlane,
  faCalendarDay,
  faClock,
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faHeading,
  faCommentAlt,
  faFlagCheckered,
  faCodeBranch,
  faArrowDown,
  faArrowUp,
  faEquals,
  faSpinner,
  faEnvelope,
  faEnvelopeOpenText,
  faCheckDouble,
  faArrowLeft
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TodoProvider>
        <NotificationProvider>
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
                <Route 
                  path="/notifications" 
                  element={
                    <ProtectedRoute>
                      <NotificationPage />
                    </ProtectedRoute>
                  } 
                />
                {/* Redirect root to dashboard if authenticated, otherwise to login */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </TodoProvider>
    </AuthProvider>
  );
};

export default App;