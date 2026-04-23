import React from 'react';
import { Plus } from 'lucide-react';
import { CreateProjectModal } from '../modal/create_project_modal';
import { Button } from '@/components/ui/button';
import { AddMemberModal } from '../modal/add_member_modal'; // IMPORT TEMPORAIRE POUR TESTER

const DashboardHeader = ({ onProjectCreated }) => {
    return (
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
            
            <h1 className="text-2xl font-raleway font-bold text-slate-800 tracking-tight">
                Vue d'ensemble
            </h1>

            <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* BOUTON TEMPORAIRE POUR VISUALISER LA MODALE ADD MEMBER */}
                <AddMemberModal projectId="TEST-123" />

                {/* La modale enveloppe maintenant le bouton qui sert de déclencheur */}
                <CreateProjectModal onProjectCreated={onProjectCreated}>
                    <Button variant="amber" className="gap-2 w-full justify-start md:justify-center md:w-auto">
                        <Plus size={16} />
                        <span className="hidden sm:inline">Nouveau projet</span>
                        <span className="sm:hidden">Créer</span>
                    </Button>
                </CreateProjectModal>
            </div>
        </header>
    );
};

export default DashboardHeader;