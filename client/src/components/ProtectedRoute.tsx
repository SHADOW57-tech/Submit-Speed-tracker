import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const stored = localStorage.getItem('userInfo') || localStorage.getItem('adminInfo');
  const userInfo = token && stored ? JSON.parse(stored) : null;
  const role = userInfo?.role?.toString().toLowerCase();
  const isAdmin = role === 'admin' || role === 'owner';

  if (!token || !isAdmin) {
    return <Navigate to="/user-login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;