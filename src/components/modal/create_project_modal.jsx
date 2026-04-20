"use client"

import * as React from "react"
import { toast } from "sonner"

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

export function CreateProjectModal() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [projectName, setProjectName] = React.useState("")
    const [projectDescription, setProjectDescription] = React.useState("")

    function handleSubmit(event) {
        event.preventDefault()

        // Simple validation
        if (projectName.length < 3) {
            toast.error("Project name must be at least 3 characters.")
            return
        }

        const projectData = {
            name: projectName,
            description: projectDescription,
        }

        // TODO: Replace with your actual API call
        toast("You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(projectData, null, 2)}</code>
        </pre>
            ),
            position: "bottom-right",
        })

        // Reset form and close modal
        setProjectName("")
        setProjectDescription("")
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Create Project</Button>
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
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" form="create-project-form">
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
