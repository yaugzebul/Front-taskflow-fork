import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexte/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si on est encore en train de vérifier la session au premier chargement (F5),
  // on ne fait rien (l'écran de chargement est géré par AuthProvider).
  // Cela évite d'être redirigé vers "/" alors qu'on est en fait connecté.
  if (isLoading) {
      return null; 
  }

  if (!isAuthenticated) {
    // Si l'utilisateur n'est vraiment pas authentifié après vérification, 
    // redirigez-le vers la page d'accueil (connexion)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;