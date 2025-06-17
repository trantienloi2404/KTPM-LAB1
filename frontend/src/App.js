import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Components
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TodoList from './components/todo/TodoList';
import Profile from './components/profile/Profile';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
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
  );
}

export default App; 