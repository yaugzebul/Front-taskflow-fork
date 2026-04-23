import React from 'react';
import { CreateProjectModal } from '../modal/create_project_modal';
import { AddMemberModal } from '../modal/add_member_modal'; // IMPORT TEMPORAIRE POUR TESTER

const DashboardHeader = ({ 
    isCreateModalOpen, 
    setIsCreateModalOpen,
    onProjectCreated
}) => {
    return (
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
            
            <h1 className="text-2xl font-raleway font-bold text-slate-800 tracking-tight">
                Vue d'ensemble
            </h1>

            <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* BOUTON TEMPORAIRE POUR VISUALISER LA MODALE ADD MEMBER */}
                <AddMemberModal projectId="TEST-123" />

                {/* Bouton Créer Projet */}
                <CreateProjectModal 
                    isOpen={isCreateModalOpen} 
                    setIsOpen={setIsCreateModalOpen} 
                    onSuccess={onProjectCreated}
                />
            </div>
        </header>
    );
};

export default DashboardHeader;