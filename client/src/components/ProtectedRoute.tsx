import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const userInfo = token ? JSON.parse(localStorage.getItem('userInfo') || '{}') : null;
  const isAdmin = userInfo?.role === 'Admin' || userInfo?.role === 'SuperAdmin';

  if (!token || !isAdmin) {
    return <Navigate to="/user-login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;