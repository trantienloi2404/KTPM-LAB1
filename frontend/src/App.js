import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Alert, AlertTitle } from '@mui/material';

// Components
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TodoList from './components/todo/TodoList';
import Profile from './components/profile/Profile';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <>
      {/* Demo Mode Notice */}
      <Alert severity="info" sx={{ borderRadius: 0 }}>
        <AlertTitle>Demo Mode Active</AlertTitle>
        Authentication has been bypassed for presentation purposes. Set DEMO_MODE to false in PrivateRoute.js to re-enable.
      </Alert>
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <PrivateRoute>
                <TodoList />
              </PrivateRoute>
            }
          />
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App; 