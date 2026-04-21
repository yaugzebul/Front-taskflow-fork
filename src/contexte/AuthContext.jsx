import React, { createContext, useState, useContext } from 'react';

// 1. Création du contexte
const AuthContext = createContext(null);

// 2. Création du fournisseur (Provider)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // ou récupérer depuis le localStorage

    // Fonction pour connecter l'utilisateur
    const login = (userData) => {
        setUser(userData);
        // Optionnel : stocker dans le localStorage pour la persistance
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Fonction pour déconnecter l'utilisateur
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};
