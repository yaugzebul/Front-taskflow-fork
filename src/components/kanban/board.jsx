"use client"

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
    DndContext,
    closestCorners,
    pointerWithin,
    rectIntersection,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragOverlay
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from './Column';
import { getTasksByProject, updateTaskStatus } from '@/services/api.js';
import { TaskCard } from "@/components/kanban/TaskCard";

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
    const [overId, setOverId] = useState(null);

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

    // Stratégie de collision personnalisée
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
    };

    const handleDragOver = (event) => {
        const { over } = event;
        if (over) {
            setOverId(over.id);
        }
    };

    const handleDragEnd = async (event) => {
        setActiveTask(null);
        setOverId(null);
        const { active, over } = event;

        if (!over) {
            console.log('No over target');
            return;
        }

        const activeContainer = active.data.current?.sortable?.containerId;

        // Déterminer le container de destination
        let overContainer;

        // Si on drop directement sur une colonne
        if (over.data.current?.type === 'COLUMN') {
            overContainer = over.data.current.columnId;
        }
        // Si on drop sur une tâche
        else if (over.data.current?.sortable?.containerId) {
            overContainer = over.data.current.sortable.containerId;
        }
        // Si over.id est directement une colonne (fallback)
        else if (Object.keys(columns).includes(over.id)) {
            overContainer = over.id;
        }
        else {
            overContainer = over.id;
        }

        console.log('Drag end:', {
            activeId: active.id,
            overId: over.id,
            activeContainer,
            overContainer,
            overType: over.data.current?.type,
            overData: over.data.current
        });

        if (!activeContainer || !overContainer) {
            console.log('Missing container:', { activeContainer, overContainer });
            return;
        }
        if (activeContainer === overContainer && active.id === over.id) {
            console.log('Same position, no change');
            return;
        }

        const previousColumns = JSON.parse(JSON.stringify(columns));

        if (activeContainer === overContainer && over.data.current?.type !== 'COLUMN') {
            // Réorganisation dans la même colonne
            const items = columns[activeContainer];
            const oldIndex = items.findIndex((t) => t.id === active.id);
            const newIndex = items.findIndex((t) => t.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                setColumns(prev => ({
                    ...prev,
                    [activeContainer]: arrayMove(items, oldIndex, newIndex)
                }));
            }
        } else if (activeContainer !== overContainer || over.data.current?.type === 'COLUMN') {
            // Déplacement vers une autre colonne
            const activeItems = [...columns[activeContainer]];
            const overItems = [...columns[overContainer]];
            const activeIndex = activeItems.findIndex((t) => t.id === active.id);

            if (activeIndex === -1) return;

            const [movedItem] = activeItems.splice(activeIndex, 1);
            movedItem.status = overContainer;
            movedItem.col_id = statusToColId[overContainer];

            // Si over.id est l'ID de la colonne (pas d'une tâche), ajouter à la fin
            const overIndex = overItems.findIndex((t) => t.id === over.id);
            if (overIndex >= 0) {
                overItems.splice(overIndex, 0, movedItem);
            } else {
                // Colonne vide ou drop sur la colonne elle-même
                overItems.push(movedItem);
            }

            console.log('Moving task:', { from: activeContainer, to: overContainer, task: movedItem.title });

            setColumns({
                ...columns,
                [activeContainer]: activeItems,
                [overContainer]: overItems
            });

            console.log('Updating task with:', { taskId: active.id, status: overContainer });
            try {
                await updateTaskStatus(active.id, overContainer);
                console.log('Task updated successfully');
            } catch (err) {
                console.error('Error updating task:', err);
                setColumns(previousColumns);
                alert("Erreur: Impossible de déplacer la tâche.");
            }
        }
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
            <div className="flex gap-6 p-10">
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
