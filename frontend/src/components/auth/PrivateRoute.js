import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // DEMO MODE: Bypass authentication for presentation
  const DEMO_MODE = true; // Set to false to re-enable authentication

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // In demo mode, always allow access
  if (DEMO_MODE) {
    return children;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 