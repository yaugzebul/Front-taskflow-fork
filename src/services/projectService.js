// src/services/projectService.js
// Ce fichier regroupe toutes les requêtes API concernant les projets

const API_URL = 'http://localhost:3000/api';

/**
 * Récupère la liste de tous les projets
 * @returns {Promise<Array>} Un tableau d'objets représentant les projets
 */
export const fetchProjects = async () => {
    const response = await fetch(`${API_URL}/projects`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // Important pour que le navigateur envoie le cookie HTTP-Only avec la requête GET
        credentials: 'include', 
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json(); // On suppose que le backend renvoie un tableau de projets
};

/**
 * Crée un nouveau projet
 * @param {Object} projectData Les données du projet (ex: { project_name, project_desc })
 * @returns {Promise<Object>} Le projet nouvellement créé
 */
export const createProject = async (projectData) => {
    const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // Important pour que le navigateur envoie le cookie HTTP-Only avec la requête POST
        credentials: 'include',
        body: JSON.stringify(projectData),
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json(); // On suppose que le backend renvoie le projet créé
};