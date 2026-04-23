// src/services/api.js

const BASE_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
    try {
        const authData = localStorage.getItem('auth');
        if (authData) {
            const { token } = JSON.parse(authData);
            return token;
        }
    } catch (error) {
        console.error("Could not parse auth token from localStorage", error);
    }
    return null;
};

const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include', // Ajout de l'option pour inclure les cookies
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Le serveur a répondu avec le statut : ${response.status}` }));
        throw new Error(errorData.message || `Une erreur inconnue est survenue.`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// --- Authentification ---
export const loginUser = (credentials) => apiFetch('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials), // Envoi direct de l'objet credentials
});

// Correction de l'endpoint pour l'inscription
export const registerUser = (userData) => apiFetch('/api/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
});


// --- Tâches (Tasks) ---
export const getTasksByProject = (projectId) => apiFetch(`/api/taches/projet/${projectId}`);
export const createTask = (taskData) => apiFetch('/api/taches', {
    method: 'POST',
    body: JSON.stringify(taskData),
});
export const updateTaskStatus = (taskId, newColId) => apiFetch(`/api/taches/${taskId}`, {
    method: 'PUT',
    // CORRECTION ICI : Le backend attend 'id_col' ou 'status' mais apparemment pas au format qu'on lui donnait.
    // L'erreur dit "Le statut '1' ne correspond à aucune colonne".
    // Cela signifie que le backend s'attend probablement à ce qu'on lui envoie le *texte* ("À faire")
    // OU qu'il s'attend bien à un ID mais que le champ s'appelle 'status'.
    // D'après le code précédent `body: JSON.stringify({ status: newStatus })`, le backend lisait `req.body.status`.
    // Modifions pour envoyer l'ID sous le nom `status`, OU `id_col` si on a modifié le back.
    // L'erreur dit "Le statut '1'...", donc le backend lit bien la valeur 1, mais essaie de la valider comme une chaîne de caractères (ex: "À faire").
    // IL FAUT LUI ENVOYER LE TEXTE.
    body: JSON.stringify({ status: newColId === 1 ? "À faire" : newColId === 2 ? "En cours" : "Terminé" }),
});
export const deleteTask = (taskId) => apiFetch(`/api/taches/${taskId}`, {
    method: 'DELETE',
});

// --- Projets ---
export const getProjects = () => apiFetch('/api/projects'); // Correction de la route
export const createProject = (projectData) => apiFetch('/api/projects', { // Correction de la route
    method: 'POST',
    body: JSON.stringify(projectData),
});