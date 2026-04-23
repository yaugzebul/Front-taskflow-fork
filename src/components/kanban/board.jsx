"use client"

import React, { useState, useEffect } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column } from './Column';
import { getTasksByProject, updateTaskStatus } from '../../services/api';

export function Board({ projectId, refreshKey }) {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!projectId) {
            setIsLoading(false);
            setTasks([]);
            return;
        }

        const fetchTasks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getTasksByProject(projectId);
                setTasks(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [projectId, refreshKey]);

    const handleTaskDeleted = (deletedTaskId) => {
        // Met à jour l'état local pour retirer la tâche supprimée instantanément
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== deletedTaskId));
    };

    // ... (handleDragEnd reste identique)

    if (isLoading) {
        return <div className="p-10 text-center text-lg">Chargement des tâches...</div>;
    }
    if (error) {
        return <div className="p-10 text-center text-red-500">Erreur: {error}</div>;
    }
    if (!projectId) {
        return <div className="p-10 text-center text-lg">Veuillez sélectionner un projet pour voir les tâches.</div>;
    }

    return (
        <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6 p-10">
                <Column id="À faire" tasks={tasks.filter((t) => t.status === 'À faire')} onTaskDeleted={handleTaskDeleted} />
                <Column id="En cours" tasks={tasks.filter((t) => t.status === 'En cours')} onTaskDeleted={handleTaskDeleted} />
                <Column id="Terminé" tasks={tasks.filter((t) => t.status === 'Terminé')} onTaskDeleted={handleTaskDeleted} />
            </div>
        </DndContext>
    )
}
