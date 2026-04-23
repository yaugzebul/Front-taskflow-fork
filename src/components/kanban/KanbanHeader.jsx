import React from 'react';
import { Search } from 'lucide-react';
import { CreateTaskModal } from '../modal/create_task_modal';

// Le header reçoit maintenant projectId et onTaskCreated
const KanbanHeader = ({ projectId, onTaskCreated }) => {
    return (
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
            <h1 className="text-2xl font-raleway font-bold text-slate-800 tracking-tight">
                Vue d'ensemble
            </h1>
            <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* On passe les nouvelles props à la modale */}
                <CreateTaskModal
                    projectId={projectId}
                    onTaskCreated={onTaskCreated}
                />
            </div>
        </header>
    );
};

export default KanbanHeader;