import React from 'react';
import { Plus } from 'lucide-react';
import { CreateTaskModal } from '../modal/create_task_modal';
import { Button } from '@/components/ui/button';

const KanbanHeader = ({ projectId, onTaskCreated, searchQuery, setSearchQuery }) => {
    return (
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
            <h1 className="text-2xl font-raleway font-bold text-slate-800 tracking-tight">
                Tâches du projet
            </h1>
            <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* La modale enveloppe maintenant le bouton qui sert de déclencheur */}
                <CreateTaskModal projectId={projectId} onTaskCreated={onTaskCreated}>
                    <Button variant="secondary" className="gap-2">
                        <Plus size={16} />
                        Créer une Tâche
                    </Button>
                </CreateTaskModal>
            </div>
        </header>
    );
};

export default KanbanHeader;