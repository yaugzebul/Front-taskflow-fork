"use client"

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from '@dnd-kit/core'; // Import useDroppable
import { TaskCard } from "@/components/kanban/TaskCard.jsx";

export function Column({ id, tasks, onTaskDeleted }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            type: 'COLUMN',
            columnId: id
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`bg-slate-100/50 p-4 rounded-2xl w-80 min-h-[500px] flex flex-col gap-3 transition-colors ${
                isOver ? 'bg-slate-200/70 ring-2 ring-blue-400' : ''
            }`}
        >
            <h2 className="font-bold text-slate-700 mb-1 px-2">{id}</h2>
            <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 flex flex-col gap-3">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            id={task.id}
                            task={task}
                            onTaskDeleted={onTaskDeleted}
                        />
                    ))}
                    {tasks.length === 0 && (
                        <div className="flex-1 min-h-[200px] border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400">
                            Déposer une tâche ici
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}
