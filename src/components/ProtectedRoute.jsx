import React from 'react';
import { Navigate } from 'react-router-dom';
import { Auth } from '../lib/api.js';

const ProtectedRoute = ({ children }) => {
  if (!Auth.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;