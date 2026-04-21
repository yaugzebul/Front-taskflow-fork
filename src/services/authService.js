// src/services/authService.js
// Ce fichier regroupe toutes les requêtes API concernant l'authentification

const API_URL = 'http://localhost:3000/api';

/**
 * Connecte un utilisateur
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe de l'utilisateur
 * @returns {Promise<Object>} Les données de l'utilisateur et/ou le token
 */
export const login = async (email, password) => {
    // Console log pour vérifier ce qui est envoyé EXACTEMENT au backend
    console.log("Envoi au backend :", { email: email, Mot_de_passe: password });
    
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Important: Inclure les credentials pour que les cookies HTTP-Only soient enregistrés par le navigateur
            credentials: 'include', 
            // On mappe les variables du front vers les noms de champs attendus par le back
            // CORRECTION: 'email' est en minuscules, 'Mot_de_passe' a une majuscule
            body: JSON.stringify({ 
                email: email, 
                Mot_de_passe: password 
            }),
        });

        if (!response.ok) {
            // On essaie de récupérer le message d'erreur du backend s'il y en a un
            let errorMessage = `Erreur HTTP: ${response.status}`;
            try {
                const errorData = await response.json();
                console.log("Données d'erreur reçues du backend :", errorData);
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData && errorData.error) {
                     errorMessage = errorData.error;
                }
            } catch (e) {
                // Le corps de la réponse n'est pas du JSON, on garde le message d'erreur générique
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        throw error;
    }
};