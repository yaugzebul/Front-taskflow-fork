import React from 'react';
import { Search } from 'lucide-react';
import { CreateProjectModal } from '../modal/create_project_modal';

const DashboardHeader = ({ 
    searchQuery, 
    setSearchQuery, 
    isCreateModalOpen, 
    setIsCreateModalOpen 
}) => {
    return (
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-sm">
            
            <h1 className="text-2xl font-raleway font-bold text-slate-800 tracking-tight">
                Vue d'ensemble
            </h1>

            <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Barre de recherche */}
                <div className="relative w-full sm:w-64 md:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Bouton Créer Projet */}
                <CreateProjectModal 
                    isOpen={isCreateModalOpen} 
                    setIsOpen={setIsCreateModalOpen} 
                />
            </div>
        </header>
    );
};

export default DashboardHeader;