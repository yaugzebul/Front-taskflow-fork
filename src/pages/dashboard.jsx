import React, { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ProjectCard from '../components/dashboard/ProjectCard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import EmptyProjectState from '../components/dashboard/EmptyProjectState';

// Données fictives pour le développement
const mockProjects = [
    { id: 1, name: "Refonte Site Web", status: "En cours", progress: 65, tasks: 12, lastUpdated: "2h" },
    { id: 2, name: "Application Mobile", status: "À faire", progress: 10, tasks: 45, lastUpdated: "1j" },
    { id: 3, name: "Campagne Marketing", status: "Terminé", progress: 100, tasks: 8, lastUpdated: "3j" },
];

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Filtrage des projets basé sur la barre de recherche
    const filteredProjects = mockProjects.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            
            {/* --- SIDEBAR GAUCHE --- */}
            <Sidebar projects={mockProjects} />

            {/* --- CONTENU PRINCIPAL --- */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* --- HEADER DU DASHBOARD --- */}
                <DashboardHeader 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isCreateModalOpen={isCreateModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                />

                {/* --- ZONE DÉFILANTE POUR LES PROJETS --- */}
                <div className="flex-1 overflow-y-auto p-8">
                    
                    {/* En-tête de section */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 font-raleway">Mes Projets Récents</h2>
                            <p className="text-sm text-slate-500 mt-1">Vous avez {mockProjects.length} projets en cours.</p>
                        </div>
                    </div>

                    {/* Grille des projets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))
                        ) : (
                            <EmptyProjectState searchQuery={searchQuery} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;