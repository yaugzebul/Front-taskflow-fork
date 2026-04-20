// Dans votre composant de page (par exemple, une liste de tâches)
import { TaskDetailModal } from "@/components/modal/task_detail_modal";
import { useState } from "react";

// Renommé en Kanban et exporté par défaut pour correspondre à App.jsx
const Kanban = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        <div>
            {/* Ce bouton est un exemple pour montrer comment ouvrir la modale */}
            <button onClick={() => setIsModalOpen(true)}>
                Voir les détails de la tâche
            </button>

            {/* La modale elle-même */}
            <TaskDetailModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                task={selectedTask}
            />
        </div>
    );
}

export default Kanban;