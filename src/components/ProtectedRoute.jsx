import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexte/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas authentifié, redirigez-le vers la page d'accueil (connexion)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
