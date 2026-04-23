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
    body: JSON.stringify({ id_col: newColId }),
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
