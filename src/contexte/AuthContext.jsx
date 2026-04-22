import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkAuth, logout as logoutService } from '../services/authService';

// 1. Création du contexte
const AuthContext = createContext(null);

// 2. Création du fournisseur (Provider)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // État de chargement initial

    // Vérifier la session au chargement de l'application
    useEffect(() => {
        const verifySession = async () => {
            try {
                // On appelle la route GET /me
                const data = await checkAuth();
                
                // Si succès, on met à jour l'utilisateur (ton backend renvoie { user: { ... } })
                if (data && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                // Si erreur (ex: 401 Unauthorized), cela veut dire qu'il n'y a pas de session valide
                setUser(null);
            } finally {
                // Quoi qu'il arrive, on a fini de charger
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);

    // Fonction pour connecter l'utilisateur (mise à jour de l'état global après le fetch login)
    const login = (userData) => {
        setUser(userData);
    };

    // Fonction pour déconnecter l'utilisateur
    const logout = async () => {
        try {
            // Appel à l'API pour détruire le cookie côté serveur
            await logoutService();
        } catch (error) {
            console.error("Erreur lors du logout côté serveur", error);
        } finally {
            // Dans tous les cas, on nettoie l'état côté client
            setUser(null);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading, // On expose isLoading pour pouvoir afficher un spinner si besoin
        login,
        logout,
    };

    // Pendant la vérification initiale de la session, on peut afficher un écran vide ou un spinner
    // pour éviter les clignotements (redirigé vers login puis tout de suite vers dashboard)
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-tf-dark-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
            </div>
        );
    }

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