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

export function TaskCard ({ id, task }) {
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
                        {/* 4. On place les LISTENERS et ATTRIBUTES sur l'icône de drag uniquement */}
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-50 rounded"
                            onClick={(e) => e.stopPropagation()} // Empêche d'ouvrir la modale quand on veut juste draguer
                        >
                            <GripVertical className="text-slate-300" size={18} />
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-700">
                            <AlertCircle size={16} className="text-slate-600" />
                            <span className="text-sm font-semibold">{priority}</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-[17px] font-bold text-[#1e293b] truncate">
                            {title}
                        </h3>
                        <p className="text-[#94a3b8] text-sm leading-tight line-clamp-2">
                            {description}
                        </p>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-[#64748b] font-medium text-sm">
                            <Clock size={16} className="text-slate-400" />
                            <span>{timeSpent}h / {timeEstimated}h</span>
                        </div>
                        <Progress value={progress} className="h-[3px]" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#a3a3a3] flex-shrink-0" />
                            <span className="text-[#64748b] text-[15px] font-medium">
                                {assignee}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#94a3b8]">
                            <Calendar size={16} />
                            <span className="text-sm">{dueDate}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* La modale qui s'ouvrira au clic */}
            <TaskDetailModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                task={task}
            />
        </div>
    );
}