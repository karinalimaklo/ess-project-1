import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import currentUser from '../currentUser';

const ProtectedRoute = ({ adminOnly = false }) => {

  if (currentUser.status === 'Excluído') {
    return <Navigate to="/conta-excluida" replace />;
  }

  if (currentUser.status === 'Suspenso') {
    const now = new Date();
    const suspendedUntil = new Date(currentUser.suspendedUntil);
    if (now < suspendedUntil) {
      return <Navigate to="/conta-suspensa" replace />;
    }
  }
  if (adminOnly && currentUser.isAdmin !== true) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
