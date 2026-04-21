import React, { useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar.jsx";
import KanbanHeader from "@/components/kanban/KanbanHeader.jsx";
import { Board } from "@/components/kanban/board.jsx"; // Import du composant Board

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

                <div className="flex-1 overflow-auto"> {/* Ajout d'un conteneur scrollable pour le board */}
                    <Board /> {/* Rendu du composant Board */}
                </div>
            </main>
        </div>
    );
}

export default Kanban;