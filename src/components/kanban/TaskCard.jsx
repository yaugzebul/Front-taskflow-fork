"use client"

import React, { useState } from 'react';
import {
    GripVertical,
    AlertCircle,
    Clock,
    Calendar
} from "lucide-react";
import { useSortable} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { TaskDetailModal } from "@/components/modal/task_detail_modal";

// La TaskCard accepte maintenant onTaskDeleted
export function TaskCard ({ id, task, onTaskDeleted }) {
    const { attributes, listeners, setNodeRef, transform, transition,isDragging } = useSortable({ id:id});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    }

    if (!task)
        return null;


    const {
        title,
        description,
        priority,
        timeSpent,
        timeEstimated,
        assignee,
        dueDate
    } = task;

    const progress = timeEstimated > 0 ? (timeSpent / timeEstimated) * 100 : 0;

    return (
        <div ref={setNodeRef} style={style}>
            <Card
                className="w-full max-w-[350px] rounded-3xl border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2">
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-50 rounded"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <GripVertical className="text-slate-300" size={18} />
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                            <AlertCircle size={16} className="text-slate-600" />
                            <span className="text-sm font-semibold">{priority}</span>
                        </div>
                    </div>
                    {/* ... (le reste du contenu de la carte) ... */}
                </CardContent>
            </Card>

            <TaskDetailModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                task={task}
                onTaskDeleted={onTaskDeleted} // On passe la fonction à la modale
            />
        </div>
    );
}
