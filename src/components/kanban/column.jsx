"use client"

import React from 'react';
import { SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import { TaskCard} from "@/components/kanban/TaskCard.jsx";

export function Column({ id, tasks }) { // Renommé 'task' en 'tasks'
    return (
        <div className="bg-slate-100/50 p-4 rounded-2xl w-80 min-h-[500px]">
            <h2 className="font-bold text-slate-700 mb-4 px-2">{id}</h2>
            <div className="flex flex-col gap-3">
                <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} id={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}