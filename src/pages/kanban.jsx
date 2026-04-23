import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar/Sidebar.jsx";
import KanbanHeader from "@/components/kanban/KanbanHeader.jsx";
import { Board } from "@/components/kanban/board.jsx";
import { getProjects } from "@/services/api.js";

const Kanban = () => {
    const { projectId } = useParams();
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer le rafraîchissement

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects for sidebar:", error);
            }
        };
        fetchProjects();
    }, []);

    const handleTaskCreated = () => {
        // Incrémenter la clé pour forcer le useEffect du Board à se redéclencher
        setRefreshKey(oldKey => oldKey + 1);
    };

    const filteredProjects = projects.filter(p =>
        p.project_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
            <Sidebar projects={filteredProjects} />

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <KanbanHeader
                    projectId={projectId}
                    onTaskCreated={handleTaskCreated}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <div className="flex-1 overflow-auto">
                    <Board projectId={projectId} refreshKey={refreshKey} />
                </div>
            </main>
        </div>
    );
}

export default Kanban;