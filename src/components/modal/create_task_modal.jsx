"use client"

import * as React from "react"
import { toast } from "sonner"
import { ClipboardList, X } from "lucide-react"
import { createTask } from "@/services/api"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const colIdToStatus = {
    1: "À faire",
    2: "En cours",
    3: "Terminé",
};

export function CreateTaskModal({ projectId, onTaskCreated, children }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [status, setStatus] = React.useState("1") // Valeur par défaut est l'ID 1
    const [priority, setPriority] = React.useState("Moyenne")
    const [assignedTo, setAssignedTo] = React.useState("")
    const [estimatedTime, setEstimatedTime] = React.useState("")
    const [dueDate, setDueDate] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setStatus("1")
        setPriority("Moyenne")
        setAssignedTo("")
        setEstimatedTime("")
        setDueDate("")
    }

    const handleSubmit = async (event) => {
        if (event) event.preventDefault();

        if (!title) {
            toast.error("Le titre de la tâche est obligatoire.")
            return
        }
        if (!projectId) {
            toast.error("Impossible de créer la tâche : ID de projet manquant.")
            return
        }

        const taskData = {
            title,
            description,
            col_id: parseInt(status, 10),
            priority,
            assignedTo,
            timeEstimated: estimatedTime ? Number(estimatedTime) : null,
            dueDate: dueDate || null,
            project_id: projectId,
        }

        setIsSubmitting(true)
        try {
            const newTaskFromApi = await createTask(taskData);
            toast.success("Tâche créée avec succès !");
            
            // Enrichir la tâche avec le statut avant de la passer au parent
            const enrichedTask = {
                ...newTaskFromApi,
                status: colIdToStatus[newTaskFromApi.col_id] || "À faire",
            };

            if (onTaskCreated) {
                onTaskCreated(enrichedTask);
            }

            resetForm();
            setIsOpen(false);
        } catch (error) {
            toast.error(`Erreur lors de la création de la tâche : ${error.message}`);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-full max-w-xl border-none shadow-2xl rounded-2xl p-0 overflow-hidden">
                <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-50 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <ClipboardList className="text-slate-700" size={20} />
                        <h2 className="text-xl font-bold text-slate-800">Ajouter une tâche</h2>
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

                <form>
                    <div className="p-6 space-y-5">
                        <FieldGroup className="space-y-4">
                            <Field>
                                <FieldLabel className="text-slate-600 font-semibold">Titre *</FieldLabel>
                                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Intégrer la page contact" disabled={isSubmitting} />
                            </Field>

                            <Field>
                                <FieldLabel className="text-slate-600 font-semibold">Description</FieldLabel>
                                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez la tâche en détail..." className="min-h-[100px] resize-none" disabled={isSubmitting} />
                            </Field>

                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel className="text-slate-600 font-semibold">Statut</FieldLabel>
                                    <Select value={status} onValueChange={setStatus} disabled={isSubmitting}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">À faire</SelectItem>
                                            <SelectItem value="2">En cours</SelectItem>
                                            <SelectItem value="3">Terminé</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel className="text-slate-600 font-semibold">Priorité</FieldLabel>
                                    <Select value={priority} onValueChange={setPriority} disabled={isSubmitting}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Basse">Basse</SelectItem>
                                            <SelectItem value="Moyenne">Moyenne</SelectItem>
                                            <SelectItem value="Haute">Haute</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel className="text-slate-600 font-semibold">Assigné à</FieldLabel>
                                    <Input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Nom du membre" disabled={isSubmitting} />
                                </Field>
                                <Field>
                                    <FieldLabel className="text-slate-600 font-semibold">Temps estimé (h)</FieldLabel>
                                    <Input value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} placeholder="Ex: 4" type="number" disabled={isSubmitting} />
                                </Field>
                            </div>

                            <div className="w-1/2 pr-2">
                                <Field>
                                    <FieldLabel className="text-slate-600 font-semibold">Date limite</FieldLabel>
                                    <Input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" disabled={isSubmitting} />
                                </Field>
                            </div>
                        </FieldGroup>
                    </div>
                    
                    <div className="flex gap-4 p-6 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>Annuler</Button>
                        <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Création..." : "Créer la tâche"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
