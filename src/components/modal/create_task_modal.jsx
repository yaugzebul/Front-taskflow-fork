"use client"

import * as React from "react"
import { toast } from "sonner"
import { ClipboardList, X } from "lucide-react"
import { createTask } from "@/services/api" // Import du service

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

// La modale accepte maintenant des props pour communiquer avec son parent
export function CreateTaskModal({ projectId, onTaskCreated }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    // ... autres états ...

    const resetForm = () => {
        setTitle("")
        setDescription("")
        // ... reset autres états ...
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

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
            status: 'À faire', // Statut par défaut
            priority: 'Moyenne', // Priorité par défaut
            id_projet: projectId, // Lier la tâche au projet actuel
            // ... autres champs ...
        }

        try {
            const newTask = await createTask(taskData);
            toast.success("Tâche créée avec succès !");
            
            // Appeler la fonction de rappel pour mettre à jour la liste des tâches dans le Board
            if (onTaskCreated) {
                onTaskCreated(newTask);
            }

            resetForm();
            setIsOpen(false);
        } catch (error) {
            toast.error(`Erreur lors de la création de la tâche : ${error.message}`);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">Créer une Tâche</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-xl ...">
                <DialogHeader className="...">
                    {/* ... */}
                </DialogHeader>

                <div className="p-6">
                    <form id="create-task-form" onSubmit={handleSubmit} className="space-y-5">
                        {/* ... (champs du formulaire comme avant) ... */}
                        <Field>
                            <FieldLabel>Titre *</FieldLabel>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Field>
                        <Field>
                            <FieldLabel>Description</FieldLabel>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Field>
                        {/* ... autres champs ... */}
                    </form>
                </div>
                
                <div className="flex gap-4 p-6 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
                    <Button type="submit" form="create-task-form">Créer la tâche</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
