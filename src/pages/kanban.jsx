// Dans votre composant de page (par exemple, une liste de tâches)
import React, { useState } from "react";
import { TaskCard } from "@/components/kanban/TaskCard";
import Sidebar from "@/components/Sidebar/Sidebar.jsx";
import KanbanHeader from "@/components/kanban/KanbanHeader.jsx";


const mockProjects = [
    { id: 1, name: "Refonte Site Web", status: "En cours", progress: 65, tasks: 12, lastUpdated: "2h" },
    { id: 2, name: "Application Mobile", status: "À faire", progress: 10, tasks: 45, lastUpdated: "1j" },
    { id: 3, name: "Campagne Marketing", status: "Terminé", progress: 100, tasks: 8, lastUpdated: "3j" },
];

const Kanban = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Filtrage des projets basé sur la barre de recherche
    const filteredProjects = mockProjects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Exemple de données de tâche
    const selectedTask = {
        title: "Développer la nouvelle fonctionnalité",
        priority: "Élevée",
        status: "À faire",
        description: "Implémenter la fonctionnalité X comme décrit dans le cahier des charges.",
        assignedTo: "Jane Doe",
        dueDate: "30 mars 2024",
        timeSpent: 0,
        timeEstimated: 16,
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            {/* --- SIDEBAR GAUCHE --- */}
            <Sidebar projects={ mockProjects } />

            {/* --- CONTENU PRINCIPAL --- */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">

                <KanbanHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isCreateModalOpen={ isCreateModalOpen }
                    setIsCreateModalOpen={ setIsCreateModalOpen }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                     <TaskCard task={selectedTask} />
                </div>
                </main>
        </div>
    );
}

export default Kanban;