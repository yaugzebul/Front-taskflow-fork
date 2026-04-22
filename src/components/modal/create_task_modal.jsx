"use client"

import * as React from "react"
import { toast } from "sonner"
import { ClipboardList, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"

export function CreateTaskModal() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [status, setStatus] = React.useState("")
    const [priority, setPriority] = React.useState("")
    const [assignedTo, setAssignedTo] = React.useState("")
    const [estimatedTime, setEstimatedTime] = React.useState("")
    const [dueDate, setDueDate] = React.useState("")

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setStatus("")
        setPriority("")
        setAssignedTo("")
        setEstimatedTime("")
        setDueDate("")
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (!title) {
            toast.error("Task title is required.")
            return
        }

        const taskData = {
            title,
            description,
            status,
            priority,
            assignedTo,
            estimatedTime: estimatedTime ? Number(estimatedTime) : null,
            dueDate,
        }

        console.log("New task created:", taskData)
        toast.success("Task created successfully!")

        resetForm()
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">Create Task</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-xl border-none shadow-2xl rounded-2xl p-0 overflow-hidden">
                <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="text-slate-700" size={20} />
                        <h2 className="text-xl font-bold text-slate-800">Add Task</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:bg-slate-50"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={20} />
                    </Button>
                </DialogHeader>

                <div className="p-6">
                    <form id="create-task-form" onSubmit={handleSubmit} className="space-y-5">
                        <FieldGroup className="space-y-4">
                            {/* Titre */}
                            <Field>
                                <FieldLabel className="text-slate-600 font-semibold">Title *</FieldLabel>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Integrate the contact page"
                                    className="bg-white border-slate-200 focus:ring-slate-200 h-11"
                                />
                            </Field>

                            {/* Description */}
                            <Field>
                                <FieldLabel className="text-slate-600 font-semibold">Description</FieldLabel>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the task in detail..."
                                    className="min-h-[100px] bg-white border-slate-200 resize-none"
                                />
                            </Field>

                            {/* Ligne 1: Statut et Priorité */}
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel className="text-slate-600 font-semibold">Status</FieldLabel>
                                    <Input value={status} onChange={(e) => setStatus(e.target.value)} className="bg-white border-slate-200 h-11" />
                                </Field>
                                <Field>
                                    <FieldLabel className="text-slate-600 font-semibold">Priority</FieldLabel>
                                    <Input value={priority} onChange={(e) => setPriority(e.target.value)} className="bg-white border-slate-200 h-11" />
                                </Field>
                            </div>

                            {/* Ligne 2: Assigné à et Temps estimé */}
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel className="text-slate-600 font-semibold">Assigned To</FieldLabel>
                                    <Input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="bg-white border-slate-200 h-11" />
                                </Field>
                                <Field>
                                    <FieldLabel className="text-slate-600 font-semibold">Estimated Time (h)</FieldLabel>
                                    <Input
                                        value={estimatedTime}
                                        onChange={(e) => setEstimatedTime(e.target.value)}
                                        placeholder="e.g., 4"
                                        type="number"
                                        className="bg-white border-slate-200 h-11"
                                    />
                                </Field>
                            </div>

                            {/* Date Limite */}
                            <div className="w-1/2 pr-2">
                                <Field>
                                    <FieldLabel className="text-slate-600 font-semibold">Due Date</FieldLabel>
                                    <Input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" className="bg-white border-slate-200 h-11" />
                                </Field>
                            </div>
                        </FieldGroup>
                    </form>
                </div>
                {/* Footer avec boutons */}
                <div className="flex gap-4 p-6 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="flex-1 py-6 border-slate-200 text-slate-600 font-bold rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-task-form"
                        className="flex-1 py-6 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-sm"
                    >
                        Create Task
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
