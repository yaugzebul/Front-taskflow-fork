import React from 'react';
import { FolderKanban, Clock, MoreVertical } from 'lucide-react';

const ProjectCard = ({ project }) => {
    // Déterminer la couleur du statut
    const statusColor = 
        project.status === 'Terminé' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
        project.status === 'En cours' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
        'bg-slate-50 text-slate-700 border-slate-200';

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300/50 transition-all p-6 flex flex-col group cursor-pointer relative overflow-hidden">
            {/* Effet visuel discret au survol */}
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>

            <div className="flex justify-between items-start mb-5 relative z-10">
                <div className={`px-2.5 py-1 rounded-md text-xs font-medium border ${statusColor}`}>
                    {project.status}
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical size={16} />
                </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-2 font-raleway group-hover:text-amber-600 transition-colors relative z-10 line-clamp-1">
                {project.name}
            </h3>
            
            <div className="flex items-center text-xs text-slate-500 mb-6 gap-4 relative z-10">
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <FolderKanban size={12} className="text-slate-400" />
                    {project.tasks} tâches
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <Clock size={12} className="text-slate-400" />
                    {project.lastUpdated}
                </span>
            </div>

            <div className="mt-auto relative z-10">
                <div className="flex justify-between text-xs text-slate-600 mb-2.5">
                    <span className="font-medium flex items-center gap-1">
                        Progression
                    </span>
                    <span className="font-bold text-slate-800">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                    <div 
                        className={`h-full rounded-full transition-all duration-700 ease-out ${project.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${project.progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;