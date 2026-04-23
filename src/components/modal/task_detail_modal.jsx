"use client"

import * as React from "react"
import { Calendar, Clock, Flag, Trash2, User, X } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexte/AuthContext" // Import du hook d'authentification
import { deleteTask } from "@/services/api" // Import du service API

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

export function TaskDetailModal({ isOpen, onOpenChange, task, onTaskDeleted }) {
    const { user } = useAuth(); // Récupère l'utilisateur connecté
    const isProjectAdmin = user?.id_role === 1; // Vérifie si l'utilisateur est admin (id_role = 1)

    if (!task) {
        return null
    }

    const progressPercentage =
        task.timeEstimated > 0 ? (task.timeSpent / task.timeEstimated) * 100 : 0

    const handleDelete = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
            return;
        }

        try {
            await deleteTask(task.id); // Appel au service API pour supprimer la tâche
            toast.success("Tâche supprimée avec succès !");
            onOpenChange(false); // Ferme la modale
            if (onTaskDeleted) {
                onTaskDeleted(task.id); // Notifie le parent de la suppression
            }
        } catch (error) {
            toast.error(`Erreur lors de la suppression de la tâche : ${error.message}`);
            console.error("Failed to delete task:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-full max-w-2xl border-none shadow-lg p-0">
                <DialogHeader className="space-y-4 p-6 pb-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-3">
                            <DialogTitle className="text-2xl font-semibold text-slate-900">
                                {task.title}
                            </DialogTitle>
                            <div className="flex gap-2">
                                <Badge
                                    variant="secondary"
                                    className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 flex gap-1 items-center"
                                >
                                    <Flag size={14} /> {task.priority}
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 flex gap-1 items-center"
                                >
                                    <div className="h-2 w-2 rounded-full bg-slate-500" />{" "}
                                    {task.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button variant="secondary" size="sm" className="h-8">
                                Modifier
                            </Button>
                            {isProjectAdmin && ( // Affiche le bouton de suppression seulement si l'utilisateur est admin
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-red-500"
                                    onClick={handleDelete}
                                >
                                    <Trash2 size={18} />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400"
                                onClick={() => onOpenChange(false)}
                            >
                                <X size={18} />
                            </Button>
                        </div>
                    </div>

                    {/* Onglets (Tabs) */}
                    <div className="border-b">
                        <button className="px-4 py-2 text-sm font-medium border-b-2 border-slate-900 -mb-[1px]">
                            Détails
                        </button>
                    </div>
                </DialogHeader>

                <div className="space-y-8 px-6 pb-6 pt-2">
                    {/* Description */}
                    <section className="space-y-2">
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Description
                        </h4>
                        <p className="text-slate-600 italic">
                            &ldquo; {task.description} &rdquo;
                        </p>
                    </section>

                    {/* Grid de détails */}
                    <div className="grid grid-cols-2 gap-y-8">
                        {/* Assigné à */}
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <User size={14} /> Assigné à
                            </h4>
                            <div className="flex items-center gap-2 text-slate-700">
                                <div className="h-8 w-8 rounded-full bg-slate-200" />
                                <span className="font-medium text-sm">{task.assignedTo}</span>
                            </div>
                        </div>

                        {/* Priorité */}
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Flag size={14} /> Priorité
                            </h4>
                            <Badge
                                variant="secondary"
                                className="bg-slate-200 text-slate-600 font-medium"
                            >
                                {task.priority}
                            </Badge>
                        </div>

                        {/* Statut */}
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Statut
                            </h4>
                            <Badge
                                variant="secondary"
                                className="bg-slate-200 text-slate-600 font-medium flex w-fit gap-1 items-center"
                            >
                                <div className="h-2 w-2 rounded-full bg-slate-500" />{" "}
                                {task.status}
                            </Badge>
                        </div>

                        {/* Date Limite */}
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Calendar size={14} /> Date limite
                            </h4>
                            <span className="text-slate-700 font-medium text-sm">
                                {task.dueDate}
                            </span>
                        </div>
                    </div>

                    {/* Suivi du temps */}
                    <div className="bg-slate-50 rounded-lg p-5 space-y-4">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <Clock size={14} /> Suivi du temps
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium text-slate-600">
                                    Progression
                                </span>
                                <span className="text-sm font-bold text-slate-900">
                                    {task.timeSpent}h / {task.timeEstimated}h estimées
                                </span>
                            </div>

                            <Progress
                                value={progressPercentage}
                                className="h-2 bg-slate-200"
                            />

                            <p className="text-xs text-slate-400">
                                {Math.round(progressPercentage)}% du temps estimé consommé
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
