"use client"

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from '@dnd-kit/core'; 
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
            
            {/* SortableContext enveloppe TOUTE la zone de dépôt, même vide */}
            <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 flex flex-col gap-3 min-h-[200px]">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            id={task.id}
                            task={task}
                            onTaskDeleted={onTaskDeleted}
                        />
                    ))}
                    {/* Placeholder invisible mais droppable si la colonne est vide */}
                    {tasks.length === 0 && (
                        <div className="flex-1 rounded-xl flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 pointer-events-none">
                            Déposer ici
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}