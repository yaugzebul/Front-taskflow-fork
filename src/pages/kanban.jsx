import React, { useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar.jsx";
import KanbanHeader from "@/components/kanban/KanbanHeader.jsx";
import { Board } from "@/components/kanban/board.jsx";

// Ce que la Sidebar attend
const mockProjects = [
    { id_project: 1, project_name: "Refonte Site Web", status: "En cours", progress: 65, tasks: 12, lastUpdated: "2h" },
    { id_project: 2, project_name: "Application Mobile", status: "À faire", progress: 10, tasks: 45, lastUpdated: "1j" },
    { id_project: 3, project_name: "Campagne Marketing", status: "Terminé", progress: 100, tasks: 8, lastUpdated: "3j" },
];

const Kanban = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Filtrage des projets basé sur la barre de recherche
    const filteredProjects = mockProjects.filter(p =>
        p.project_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            <Sidebar projects={ filteredProjects } /> {/* Utilisation des projets filtrés */}

            <main className="flex-1 flex flex-col h-full overflow-hidden">

                <KanbanHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isCreateModalOpen={ isCreateModalOpen }
                    setIsCreateModalOpen={ setIsCreateModalOpen }
                />

                <div className="flex-1 overflow-auto"> {/* Ajout d'un conteneur scrollable pour le board */}
                    <Board />
                </div>
            </main>
        </div>
    );
}

export default Kanban;