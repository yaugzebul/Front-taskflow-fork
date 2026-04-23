"use client"

import * as React from "react"
import { toast } from "sonner"
import { UserPlus, Mail } from "lucide-react"

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

export function AddMemberModal({ isOpen, setIsOpen, projectId, onMemberAdded }) {
    const [email, setEmail] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        // Validation simple de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Veuillez entrer une adresse e-mail valide.")
            return
        }

        setIsSubmitting(true)
        try {
            // Placeholder pour le futur appel API
            // const response = await fetch(`/api/projects/${projectId}/members`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email: email })
            // });
            
            console.log("-----------------------------------------");
            console.log(`[SIMULATION API POST /api/projects/${projectId || 'ID_PROJET'}/members]`);
            console.log(`Données envoyées :`, { email: email });
            console.log("-----------------------------------------");
            
            // Simulation d'un délai réseau
            await new Promise(resolve => setTimeout(resolve, 800));

            toast.success(`Invitation envoyée à ${email} avec succès !`)
            
            if (onMemberAdded) {
                // Simulation du retour API (l'utilisateur ajouté)
                onMemberAdded({ email: email, status: "pending" })
            }

            // Reset form and close modal
            setEmail("")
            if (setIsOpen) setIsOpen(false)
        } catch (error) {
            toast.error("Erreur lors de l'envoi de l'invitation.")
            console.error("Erreur ajout membre:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="inline-block cursor-pointer">
                    <Button variant="outline" className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50">
                        <UserPlus size={16} className="text-amber-500" />
                        <span className="hidden sm:inline">Inviter</span>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-raleway text-xl text-slate-800">Inviter un membre</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Entrez l'adresse e-mail de la personne que vous souhaitez inviter sur ce projet.
                    </DialogDescription>
                </DialogHeader>
                <form id="add-member-form" onSubmit={handleSubmit} className="py-4">
                    <div className="space-y-2">
                        <label htmlFor="member-email" className="text-sm font-medium text-slate-700">
                            Adresse e-mail
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                id="member-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="collegue@entreprise.com"
                                autoComplete="off"
                                disabled={isSubmitting}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                </form>
                <DialogFooter className="mt-2 flex gap-3 sm:justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsOpen && setIsOpen(false)} disabled={isSubmitting}>
                        Annuler
                    </Button>
                    <Button type="submit" form="add-member-form" variant="amber" disabled={isSubmitting}>
                        {isSubmitting ? "Envoi..." : "Envoyer l'invitation"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}