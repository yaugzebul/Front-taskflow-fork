"use client"

import * as React from "react"
import { toast } from "sonner"
import { createProject } from "@/services/api" // Utilisation du service API centralisé

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

export function CreateProjectModal({ onProjectCreated, children }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [projectName, setProjectName] = React.useState("")
    const [projectDescription, setProjectDescription] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        if (projectName.length < 3) {
            toast.error("Le nom du projet doit faire au moins 3 caractères.")
            return
        }

        const projectData = {
            project_name: projectName,
            project_desc: projectDescription,
        }

        setIsSubmitting(true)
        try {
            await createProject(projectData)
            toast.success("Projet créé avec succès !")
            
            if (onProjectCreated) {
                onProjectCreated()
            }

            setProjectName("")
            setProjectDescription("")
            setIsOpen(false)
        } catch (error) {
            toast.error(`Erreur lors de la création du projet: ${error.message}`)
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Créer un nouveau projet</DialogTitle>
                    <DialogDescription>
                        Remplissez les détails ci-dessous pour démarrer un nouveau projet.
                    </DialogDescription>
                </DialogHeader>
                <form id="create-project-form" onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="project-name">Nom du projet</FieldLabel>
                            <Input
                                id="project-name"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Mon projet génial"
                                autoComplete="off"
                                disabled={isSubmitting}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="project-description">
                                Description (Optionnel)
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupTextarea
                                    id="project-description"
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    placeholder="Une courte description de ce projet."
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
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                        Annuler
                    </Button>
                    <Button type="submit" form="create-project-form" disabled={isSubmitting}>
                        {isSubmitting ? "Création..." : "Créer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
