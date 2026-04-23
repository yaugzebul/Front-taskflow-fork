"use client"

import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import {
    DndContext,
    closestCorners,
    pointerWithin,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragOverlay
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from './column';
import { getTasksByProject, updateTaskStatus } from '@/services/api.js';
import { TaskCard } from "@/components/kanban/TaskCard.jsx";

const colIdToStatus = {
    1: "À faire",
    2: "En cours",
    3: "Terminé",
};

const statusToColId = {
    "À faire": 1,
    "En cours": 2,
    "Terminé": 3,
};

const INITIAL_COLUMNS = {
    "À faire": [],
    "En cours": [],
    "Terminé": [],
};

export const Board = forwardRef(({ projectId }, ref) => {
    const [columns, setColumns] = useState(INITIAL_COLUMNS);
    const [activeTask, setActiveTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ref pour mémoriser la colonne de départ lors d'un drag
    const activeTaskOriginalColumn = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Stratégie de collision personnalisée pour permettre le drop sur une colonne vide
    const customCollisionDetection = (args) => {
        // D'abord, détecter avec closestCorners pour les tâches
        const closestCornerCollisions = closestCorners(args);

        if (closestCornerCollisions.length > 0) {
            return closestCornerCollisions;
        }

        // Si aucune tâche n'est détectée, utiliser pointerWithin pour les colonnes
        return pointerWithin(args);
    };

    const fetchTasks = async () => {
        if (!projectId) {
            setIsLoading(false);
            setColumns(INITIAL_COLUMNS);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const data = await getTasksByProject(projectId);
            const newColumns = { "À faire": [], "En cours": [], "Terminé": [] };
            if (data && Array.isArray(data.tasks)) {
                data.tasks.forEach(task => {
                    const status = colIdToStatus[task.id_col];
                    if (status && newColumns[status]) {
                        newColumns[status].push({
                            id: task.id_task,
                            title: task.task_title,
                            description: task.task_desc,
                            timeSpent: task.reel_time,
                            timeEstimated: task.planned_time,
                            dueDate: task.task_due_date,
                            status: status,
                            col_id: task.id_col,
                        });
                    }
                });
            }
            setColumns(newColumns);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    useImperativeHandle(ref, () => ({
        addTask(newTaskFromApi) {
            const formattedNewTask = {
                id: newTaskFromApi.id_task,
                title: newTaskFromApi.task_title,
                description: newTaskFromApi.task_desc,
                timeSpent: newTaskFromApi.reel_time,
                timeEstimated: newTaskFromApi.planned_time,
                dueDate: newTaskFromApi.task_due_date,
                status: colIdToStatus[newTaskFromApi.id_col] || "À faire",
                col_id: newTaskFromApi.id_col,
            };
            const status = formattedNewTask.status;
            setColumns((prevColumns) => ({
                ...prevColumns,
                [status]: [...prevColumns[status], formattedNewTask],
            }));
        },
        refreshTasks() {
            fetchTasks();
        }
    }));

    const handleTaskDeleted = (deletedTaskId, status) => {
        setColumns((prev) => ({
            ...prev,
            [status]: prev[status].filter(task => task.id !== deletedTaskId)
        }));
    };
    
    const findTaskById = (id) => {
        for (const column of Object.values(columns)) {
            const task = column.find(t => t.id === id);
            if (task) return task;
        }
        return null;
    };

    const handleDragStart = (event) => {
        const { active } = event;
        const task = findTaskById(active.id);
        setActiveTask(task);
        // On mémorise la colonne de départ pour la MAJ API
        activeTaskOriginalColumn.current = task ? task.status : null;
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // On utilise la fonction générique
        const activeContainer = findTaskById(activeId)?.status;
        
        let overContainer;
        // Si over est une colonne
        if (over.data.current?.type === 'COLUMN') {
            overContainer = over.data.current.columnId;
        } else {
            // Si over est une tâche
            overContainer = findTaskById(overId)?.status;
        }

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setColumns((prev) => {
            // Copie profonde des tableaux (Résout l'erreur de mutation React)
            const activeItems = [...prev[activeContainer]];
            const overItems = [...prev[overContainer]];

            const activeIndex = activeItems.findIndex((item) => item.id === activeId);
            const overIndex = over.data.current?.type === 'COLUMN' ? overItems.length : overItems.findIndex((item) => item.id === overId);

            let newIndex;
            if (over.data.current?.type === 'COLUMN') {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            // On retire de l'ancienne colonne et on met à jour les propriétés de la tâche
            const [movedItem] = activeItems.splice(activeIndex, 1);
            const newMovedItem = { ...movedItem, status: overContainer, col_id: statusToColId[overContainer] };
            
            // On insère dans la nouvelle colonne
            overItems.splice(newIndex, 0, newMovedItem);

            return {
                ...prev,
                [activeContainer]: activeItems,
                [overContainer]: overItems,
            };
        });
    };

    const handleDragEnd = async (event) => {
        setActiveTask(null);
        const { active, over } = event;

        if (!over) {
            activeTaskOriginalColumn.current = null;
            return;
        }

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findTaskById(activeId)?.status;
        
        let overContainer;
        // CORRECTION MAJEURE ICI : gestion robuste du drop
        if (over.data.current?.type === 'COLUMN') {
            overContainer = over.data.current.columnId;
        } else {
            overContainer = findTaskById(overId)?.status;
        }

        // Fallback ultime : si on drop sur l'ID de la colonne direct (le conteneur sortable)
        if (!overContainer && Object.keys(columns).includes(String(over.id))) {
            overContainer = String(over.id);
        }

        if (!activeContainer || !overContainer) {
            activeTaskOriginalColumn.current = null;
            return;
        }

        // Réorganisation au sein de la même colonne
        if (activeContainer === overContainer) {
            const activeItems = columns[activeContainer];
            const oldIndex = activeItems.findIndex((item) => item.id === activeId);
            const newIndex = activeItems.findIndex((item) => item.id === overId);
            
            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                setColumns((prev) => ({
                    ...prev,
                    [activeContainer]: arrayMove(activeItems, oldIndex, newIndex),
                }));
            }
        } else {
            // S'il y a eu drop direct (sans onDragOver intermédiaire, ex: click rapide)
            // on effectue le déplacement physique
            setColumns((prev) => {
                const activeItems = [...prev[activeContainer]];
                const overItems = [...prev[overContainer]];

                const activeIndex = activeItems.findIndex((item) => item.id === activeId);
                if(activeIndex === -1) return prev;

                const [movedItem] = activeItems.splice(activeIndex, 1);
                movedItem.status = overContainer;
                movedItem.col_id = statusToColId[overContainer];

                let newIndex;
                if (over.data.current?.type === 'COLUMN' || Object.keys(columns).includes(String(over.id))) {
                    newIndex = overItems.length;
                } else {
                    const overIndex = overItems.findIndex((item) => item.id === overId);
                    newIndex = overIndex >= 0 ? overIndex : overItems.length;
                }

                overItems.splice(newIndex, 0, movedItem);

                return {
                    ...prev,
                    [activeContainer]: activeItems,
                    [overContainer]: overItems,
                };
            });
        }

        // Si la colonne finale est différente de celle du début du drag -> API
        if (activeTaskOriginalColumn.current && activeTaskOriginalColumn.current !== overContainer) {
            // L'erreur 500 avec "Le statut '1' ne correspond à aucune colonne." montre que le backend
            // s'attend à recevoir l'ID de la colonne (1, 2, ou 3) MAIS il s'attend très probablement
            // à ce qu'il soit envoyé sous un nom de variable précis.
            // Puisque tu avais { status: newColId } avant dans l'API, le backend lit req.body.status
            // et vérifie probablement si ça vaut '1', '2', ou '3'.

            const newColId = statusToColId[overContainer];
            
            try {
                // Appel API
                await updateTaskStatus(activeId, newColId);
            } catch (err) {
                console.error(err);
                alert("Erreur: Impossible de déplacer la tâche sur le serveur.");
                
                // On s'assure d'attendre la fin de la récupération
                await fetchTasks();
            }
        }
        
        activeTaskOriginalColumn.current = null;
    };

    if (isLoading) return <div className="p-10 text-center text-lg">Chargement des tâches...</div>;
    if (error) return <div className="p-10 text-center text-red-500">Erreur: {error}</div>;
    if (!projectId) return <div className="p-10 text-center text-lg">Veuillez sélectionner un projet.</div>;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={customCollisionDetection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6 p-10 h-full overflow-x-auto">
                {Object.keys(columns).map((columnId) => (
                    <Column
                        key={columnId}
                        id={columnId}
                        tasks={columns[columnId]}
                        onTaskDeleted={(taskId) => handleTaskDeleted(taskId, columnId)}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} id={activeTask.id} /> : null}
            </DragOverlay>
        </DndContext>
    );
});
Board.displayName = "Board";