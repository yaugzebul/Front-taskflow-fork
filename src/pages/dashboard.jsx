import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ProjectCard from '../components/dashboard/ProjectCard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import EmptyProjectState from '../components/dashboard/EmptyProjectState';
import { fetchProjects } from '../services/projectService';
import { toast } from 'sonner';

const Dashboard = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les projets au montage du composant
    useEffect(() => {
        const loadProjects = async () => {
            try {
                setIsLoading(true);
                const data = await fetchProjects();
                
                // On s'assure que l'API renvoie bien un tableau, sinon on met un tableau vide par sécurité
                if (Array.isArray(data)) {
                    setProjects(data);
                } else if (data.projects && Array.isArray(data.projects)) {
                    // Au cas où l'API renverrait { projects: [...] }
                    setProjects(data.projects);
                } else {
                    setProjects([]);
                }
            } catch (err) {
                console.error("Erreur lors du chargement des projets:", err);
                setError("Impossible de charger les projets.");
                toast.error("Erreur lors du chargement des projets");
            } finally {
                setIsLoading(false);
            }
        };

        loadProjects();
    }, []);

    // Fonction pour ajouter un projet à la liste après sa création réussie
    const handleProjectCreated = (newProject) => {
        // Optionnel: si l'API ne renvoie pas tout de suite toutes les infos formatées, 
        // on peut s'assurer ici qu'on a bien un objet complet pour la carte.
        setProjects(prevProjects => [...prevProjects, newProject]);
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            
            {/* --- SIDEBAR GAUCHE --- */}
            <Sidebar projects={projects} />

            {/* --- CONTENU PRINCIPAL --- */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* --- HEADER DU DASHBOARD --- */}
                {/* On passe onProjectCreated ici pour que la modale puisse l'utiliser */}
                <DashboardHeader 
                    isCreateModalOpen={isCreateModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    onProjectCreated={handleProjectCreated}
                />

                {/* --- ZONE DÉFILANTE POUR LES PROJETS --- */}
                <div className="flex-1 overflow-y-auto p-8">
                    
                    {/* En-tête de section */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 font-raleway">Mes Projets Récents</h2>
                            <p className="text-sm text-slate-500 mt-1">Vous avez {projects.length} projets en cours.</p>
                        </div>
                    </div>

                    {/* Gestion des états de chargement et d'erreur */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg border border-red-200">
                            <p>{error}</p>
                        </div>
                    ) : (
                        /* Grille des projets */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <ProjectCard key={project.id_project || project.id} project={project} />
                                ))
                            ) : (
                                <EmptyProjectState searchQuery={""} />
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;