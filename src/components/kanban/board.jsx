"use client"

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
    DndContext,
    closestCorners,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from './Column';
import { getTasksByProject, updateTaskStatus } from '@/services/api.js';

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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const findContainer = (id) => {
        if (id in columns) {
            return id;
        }
        return Object.keys(columns).find((key) => columns[key].find((item) => item.id === id));
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        let overContainer = findContainer(overId);

        if (!overContainer && over.data.current?.type === 'COLUMN') {
            overContainer = over.id;
        }

        if (!activeContainer || !overContainer || activeId === overId) {
            return;
        }

        const previousColumns = JSON.parse(JSON.stringify(columns));

        if (activeContainer === overContainer) {
            const activeItems = columns[activeContainer];
            const oldIndex = activeItems.findIndex((item) => item.id === activeId);
            const newIndex = activeItems.findIndex((item) => item.id === overId);
            if (oldIndex !== -1 && newIndex !== -1) {
                setColumns((prev) => ({
                    ...prev,
                    [activeContainer]: arrayMove(activeItems, oldIndex, newIndex),
                }));
            }
        } else {
            const newStatus = overContainer;
            const newColId = statusToColId[newStatus];
            
            setColumns((prev) => {
                const newPrev = { ...prev };
                const activeItems = newPrev[activeContainer];
                const overItems = newPrev[overContainer];
                const activeIndex = activeItems.findIndex((item) => item.id === activeId);
                
                const [movedItem] = activeItems.splice(activeIndex, 1);
                movedItem.status = newStatus;
                movedItem.col_id = newColId;

                let overIndex = overItems.findIndex((item) => item.id === overId);
                if (overIndex === -1) {
                    overIndex = overItems.length;
                }
                
                overItems.splice(overIndex, 0, movedItem);

                return newPrev;
            });

            try {
                await updateTaskStatus(activeId, newColId);
            } catch (err) {
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
            collisionDetection={closestCorners}
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
        </DndContext>
    );
});
Board.displayName = "Board";
