"use client"

import React, { useState, useEffect } from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column } from './Column';

export function Board() {
    const [tasks, setTasks] = useState([]); // Initialiser avec un tableau vide
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Utilisation de la variable d'environnement pour l'URL de base
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/taches`,{
                    method:'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTasks(data);
            } catch (e) {
                setError(e.message);
                console.error("Failed to fetch tasks:", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // Fonction asynchrone pour mettre à jour la BDD
    const updateTaskStatusAPI = async (taskId, newStatus, previousTasksState) => {
        try {
            // Ajout de l'ID de la tâche à la fin de l'URL
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/taches${taskId}`, {
                method: 'PUT', // ou PATCH, selon ce que votre backend attend
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de la tâche dans la base de données");
            }
            
            console.log(`Tâche ${taskId} mise à jour avec succès au statut : ${newStatus}`);
            // La mise à jour UI a déjà été faite (optimistic update), rien de plus à faire
        } catch (error) {
            console.error("Échec de l'appel API :", error);
            // En cas d'échec de l'API, on restaure l'état précédent des tâches pour que l'UI reste cohérente avec la BDD
            setTasks(previousTasksState);
            alert("Erreur de connexion. Le déplacement de la tâche a été annulé.");
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return; // Dropped outside any droppable area

        const activeId = active.id;
        const overId = over.id;
        // Sécuriser l'accès aux propriétés de dnd-kit
        const activeContainerId = active.data.current?.sortable?.containerId;
        const overContainerId = over.data.current?.sortable?.containerId;

        if (!activeContainerId || !overContainerId) return;
        if (activeId === overId && activeContainerId === overContainerId) return; // Dropped on itself

        // Sauvegarder l'état actuel des tâches au cas où l'appel API échouerait (Optimistic Update)
        const previousTasksState = [...tasks];

        setTasks((prevTasks) => {
            const activeTask = prevTasks.find(task => task.id === activeId);
            if (!activeTask) return prevTasks;

            // Cas 1: Déplacement entre différentes colonnes
            if (activeContainerId !== overContainerId) {
                const updatedTasks = prevTasks.map(task =>
                    task.id === activeId ? { ...task, status: overContainerId } : task
                );
                return updatedTasks;
            } else {
                // Cas 2: Réorganisation au sein de la même colonne
                const tasksInColumn = prevTasks.filter(task => task.status === activeContainerId);
                const oldIndex = tasksInColumn.findIndex(task => task.id === activeId);
                const newIndex = tasksInColumn.findIndex(task => task.id === overId);

                const newTasksInColumn = arrayMove(tasksInColumn, oldIndex, newIndex);

                // Reconstruire le tableau complet des tâches
                const otherTasks = prevTasks.filter(task => task.status !== activeContainerId);
                return [...otherTasks, ...newTasksInColumn];
            }
        });

        // Si la tâche a changé de colonne, on déclenche l'appel API en arrière-plan
        if (activeContainerId !== overContainerId) {
            updateTaskStatusAPI(activeId, overContainerId, previousTasksState);
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center text-lg">Loading tasks...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6 p-10">
                <Column id="À faire" tasks={tasks.filter((t) => t.status === 'À faire')} />
                <Column id="En cours" tasks={tasks.filter((t) => t.status === 'En cours')} />
                <Column id="Terminé" tasks={tasks.filter((t) => t.status === 'Terminé')} />
                {/* Ajoutez d'autres colonnes si nécessaire */}
            </div>
        </DndContext>
    )
}
