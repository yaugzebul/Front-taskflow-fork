import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings, ChevronDown, ChevronRight, LogOut } from 'lucide-react'; 
import { useAuth } from '../../contexte/AuthContext'; 

const Sidebar = ({ projects = [] }) => {
    const [isProjectsOpen, setIsProjectsOpen] = useState(true);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirige vers la page d'accueil après déconnexion
    };

    return (
        <aside className="w-64 h-screen bg-tf-dark-bg text-tf-text-light flex flex-col border-r border-slate-700/50 sticky top-0">
            {/* --- EN-TÊTE SIDEBAR --- */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
                <img src="/images/logo-taskflow.svg" alt="TaskFlow Logo" className="w-32" />
            </div>

            {/* --- NAVIGATION PRINCIPALE --- */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                
                {/* Section Dashboard */}
                <div className="space-y-1">
                    <Link 
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-800/50 hover:bg-slate-800 transition-colors"
                    >
                        <LayoutDashboard size={18} className="text-amber-400" />
                        Dashboard
                    </Link>
                </div>

                {/* Section Projets (Dépliant) */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-3 py-2 text-sm font-bold text-tf-text-accent uppercase tracking-wider">
                        <span>Mes Projets</span>
                        <button 
                            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                            className="p-1 hover:bg-slate-800 rounded-md transition-colors"
                        >
                            {isProjectsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                    </div>

                    {isProjectsOpen && (
                        <div className="space-y-1">
                            {projects.map((project, index) => {
                                // Sécurisation des données pour éviter les erreurs d'affichage et de warning React
                                const projectId = project.id_project || project.id || `project-${index}`;
                                const projectName = project.project_name || project.name || 'Nouveau Projet';
                                
                                return (
                                    <Link
                                        key={projectId}
                                        to={`/kanban/${projectId}`}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors pl-8"
                                    >
                                        <FolderKanban size={16} />
                                        <span className="truncate">{projectName}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* --- PIED DE SIDEBAR (Compte & Déconnexion) --- */}
            <div className="p-4 border-t border-slate-700/50 space-y-2">
                <Link 
                    to="/account"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <Settings size={18} />
                    Mon Compte
                </Link>
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                    <LogOut size={18} />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
