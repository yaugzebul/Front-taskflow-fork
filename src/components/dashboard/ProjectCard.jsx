import React from 'react';
import { FolderKanban, Clock, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
    // Par défaut, s'il n'y a pas de statut venant du back, on met "En cours"
    const status = project.status || 'En cours';
    
    // Déterminer la couleur du statut
    const statusColor = 
        status === 'Terminé' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
        status === 'En cours' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
        'bg-slate-50 text-slate-700 border-slate-200';

    // Formatage de la date (si présente)
    const formattedDate = project.project_date 
        ? new Date(project.project_date).toLocaleDateString('fr-FR', { 
            day: 'numeric', month: 'short', year: 'numeric' 
          })
        : 'Date inconnue';

    // Valeurs par défaut si non fournies par l'API
    const progress = project.progress || 0;
    const taskCount = project.tasks || 0;

    return (
        // On enveloppe la carte d'un lien vers la page Kanban du projet
        <Link to={`/kanban/${project.id_project}`} className="block">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300/50 transition-all p-6 flex flex-col h-full group cursor-pointer relative overflow-hidden">
                {/* Effet visuel discret au survol */}
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>

                <div className="flex justify-between items-start mb-5 relative z-10">
                    <div className={`px-2.5 py-1 rounded-md text-xs font-medium border ${statusColor}`}>
                        {status}
                    </div>
                    {/* onClick={(e) => e.preventDefault()} empêche la navigation quand on clique sur le bouton "..." */}
                    <button 
                        onClick={(e) => { e.preventDefault(); /* Action du bouton ... à définir */ }} 
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2 font-raleway group-hover:text-amber-600 transition-colors relative z-10 line-clamp-1">
                    {project.project_name}
                </h3>
                
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">
                    {project.project_desc}
                </p>
                
                <div className="flex items-center text-xs text-slate-500 mb-6 gap-4 relative z-10">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <FolderKanban size={12} className="text-slate-400" />
                        {taskCount} tâches
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <Clock size={12} className="text-slate-400" />
                        {formattedDate}
                    </span>
                </div>

                <div className="mt-auto relative z-10">
                    <div className="flex justify-between text-xs text-slate-600 mb-2.5">
                        <span className="font-medium flex items-center gap-1">
                            Progression
                        </span>
                        <span className="font-bold text-slate-800">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                        <div 
                            className={`h-full rounded-full transition-all duration-700 ease-out ${progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProjectCard;