import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import store from './store';
import theme from './theme';
import App from './App';

// Demo Mode: Setup axios interceptors for API calls
const DEMO_MODE = true;
const DEMO_USER_ID = 1;

// Configure base URLs for different environments
// In Docker, API calls should go through nginx proxy (same origin)
// In development, we can use REACT_APP_API_URL if set
const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const TODO_API_URL = `${API_BASE_URL}/api/todos`;
const AUTH_API_URL = `${API_BASE_URL}/api/auth`;

// Set axios defaults - empty baseURL means same origin (for Docker nginx proxy)
if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

if (DEMO_MODE) {
  // Add demo userId to todo service requests
  axios.interceptors.request.use((config) => {
    const fullUrl = (config.baseURL || '') + (config.url || '');
    if (fullUrl.includes('/api/todos') || config.url?.includes('/api/todos')) {
      const separator = config.url?.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}userId=${DEMO_USER_ID}`;
    }
    return config;
  });

  // Handle requests gracefully in demo mode
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const fullUrl = (error.config?.baseURL || '') + (error.config?.url || '');
      if ((fullUrl.includes('/api/auth') || error.config?.url?.includes('/api/auth')) && DEMO_MODE) {
        // Return a mock successful response for auth requests
        return Promise.resolve({
          data: {
            success: true,
            token: 'demo-token',
            user: { id: DEMO_USER_ID, username: 'Demo User', email: 'demo@example.com' }
          }
        });
      }
      
      // For todo requests that fail, return empty data
      if ((fullUrl.includes('/api/todos') || error.config?.url?.includes('/api/todos')) && DEMO_MODE) {
        return Promise.resolve({
          data: {
            success: true,
            data: [],
            message: 'Demo mode - no todos yet'
          }
        });
      }
      
      return Promise.reject(error);
    }
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
); 