import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null); // { user: object, token: string }
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedAuth = localStorage.getItem('auth');
            if (storedAuth) {
                setAuth(JSON.parse(storedAuth));
            }
        } catch (error) {
            console.error("Failed to parse auth data from localStorage", error);
            localStorage.removeItem('auth');
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Met à jour l'état d'authentification et le stocke dans le localStorage.
     * @param {object} authData - L'objet { user, token } reçu de l'API.
     */
    const setAuthData = (authData) => {
        if (authData && authData.user && authData.token) {
            setAuth(authData);
            localStorage.setItem('auth', JSON.stringify(authData));
        } else {
            console.error("setAuthData a été appelé avec des données invalides.");
        }
    };

    /**
     * Déconnecte l'utilisateur.
     */
    const logout = () => {
        setAuth(null);
        localStorage.removeItem('auth');
    };

    const value = {
        user: auth?.user,
        token: auth?.token,
        isAuthenticated: !!auth,
        isLoading,
        setAuthData, // Expose la nouvelle fonction
        logout,
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-tf-dark-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
    }
    return context;
};
