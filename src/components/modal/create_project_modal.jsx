"use client"

import * as React from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"

import { createProject } from "../../services/projectService"

// Ajout de la prop onSuccess pour mettre à jour la liste dans le parent
export function CreateProjectModal({ isOpen, setIsOpen, onSuccess }) {
    const [projectName, setProjectName] = React.useState("")
    const [projectDescription, setProjectDescription] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        // Simple validation
        if (projectName.length < 3) {
            toast.error("Project name must be at least 3 characters.")
            return
        }

        // On adapte les clés au format attendu par la BDD (project_name, project_desc)
        const projectData = {
            project_name: projectName,
            project_desc: projectDescription,
        }

        setIsSubmitting(true)
        try {
            // Appel à l'API
            const newProjectResponse = await createProject(projectData)
            
            toast.success("Projet créé avec succès !")
            
            // Si le composant parent a fourni une fonction de callback, on l'appelle
            if (onSuccess) {
                // On s'assure de passer un objet bien formaté même si l'API ne renvoie qu'un message de succès ou un ID
                // On fusionne les données qu'on vient d'envoyer avec la réponse de l'API
                const projectForUI = {
                    ...projectData, // contient project_name et project_desc
                    project_date: new Date().toISOString(), // Date de création artificielle en attendant le rafraichissement
                    ...newProjectResponse, // Si l'API renvoie un id_project, il écrasera (ou s'ajoutera) ici
                };
                onSuccess(projectForUI)
            }

            // Reset form and close modal
            setProjectName("")
            setProjectDescription("")
            if (setIsOpen) setIsOpen(false)
        } catch (error) {
            toast.error("Erreur lors de la création du projet.")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {/* On enveloppe le Button dans un div pour éviter le warning React "button descendant of button" */}
                <div className="inline-block">
                    <Button variant="amber" className="gap-2 w-full justify-start md:justify-center md:w-auto pointer-events-none">
                        <Plus size={16} />
                        <span className="hidden sm:inline">Nouveau projet</span>
                        <span className="sm:hidden">Créer</span>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create a new project</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to start a new project.
                    </DialogDescription>
                </DialogHeader>
                <form id="create-project-form" onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="project-name">Project Name</FieldLabel>
                            <Input
                                id="project-name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="My awesome project"
                                autoComplete="off"
                                disabled={isSubmitting}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="project-description">
                                Description (Optional)
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    id="project-description"
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    placeholder="A short description of what this project is about."
                                    rows={4}
                                    className="min-h-20 resize-none"
                                    disabled={isSubmitting}
                                />
                                <InputGroupAddon align="block-end">
                                    <InputGroupText className="tabular-nums">
                                        {projectDescription.length}/200
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                    </FieldGroup>
                </form>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsOpen && setIsOpen(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" form="create-project-form" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}