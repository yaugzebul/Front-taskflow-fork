"use client"

import * as React from "react"
import { toast } from "sonner"
import {
    User,
    Mail,
    Lock,
    Eye,
    X,
    Layers
} from "lucide-react"
import { registerUser } from "@/services/api" // Import du service d'inscription

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from "@/components/ui/input-group"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"

export function RegisterModal() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        // Validation du mot de passe avec la regex exacte du backend
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

        if (!firstName || firstName.length < 2) {
            toast.error("Le prénom est obligatoire et doit faire au moins 2 caractères.")
            return
        }
        if (!lastName || lastName.length < 2) {
            toast.error("Le nom est obligatoire et doit faire au moins 2 caractères.")
            return
        }
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Veuillez entrer une adresse e-mail valide.")
            return
        }
        if (!password || !passwordRegex.test(password)) {
            toast.error("Le mot de passe doit contenir entre 8 et 20 caractères, incluant au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial (@$!%*?&).")
            return
        }

        try {
            // Correction des noms de clés pour correspondre à ce que le backend attend
            const userData = { 
                Prenom: firstName, 
                Nom: lastName, 
                email: email, 
                Mot_de_passe: password 
            };
            await registerUser(userData); // Appel au service d'inscription
            toast.success("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
            setIsOpen(false);
            // Reset fields
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            toast.error(`Erreur lors de l'inscription : ${error.message}`);
            console.error("Échec de l'inscription:", error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {/* Le déclencheur est maintenant un paragraphe avec un bouton stylisé comme un lien */}
                <p className="text-center text-sm text-tf-text-light pt-4">
                    Pas encore de compte ?{' '}
                    <button type="button" className="text-amber-300 hover:text-amber-200 font-medium hover:underline transition-all">
                        S'inscrire
                    </button>
                </p>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[480px] border-none shadow-2xl rounded-2xl p-4 bg-tf-dark-bg text-white">
                <div className="pt-6 space-y-6">
                    {/* Header: Logo + Fermer */}
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-slate-800 p-2 rounded-lg text-white">
                                <Layers size={24} />
                            </div>
                            <span className="text-2xl font-bold text-slate-100 tracking-tight">
                                Task<span className="text-amber-400">Flow</span>
                            </span>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </Button>
                    </div>

                    {/* Titres */}
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold text-slate-100">Créer votre compte</h1>
                        <p className="text-slate-400 text-sm">
                            Commencez à gérer vos tâches en quelques minutes.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FieldGroup className="space-y-4">
                            {/* Prénom & Nom sur une ligne */}
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel className="text-slate-300 font-bold mb-1.5">Prénom</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <InputGroupText><User size={18} className="text-slate-400" /></InputGroupText>
                                        </InputGroupAddon>
                                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" className="bg-slate-50/50" />
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel className="text-slate-300 font-bold mb-1.5">Nom</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <InputGroupText><User size={18} className="text-slate-400" /></InputGroupText>
                                        </InputGroupAddon>
                                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="bg-slate-50/50" />
                                    </InputGroup>
                                </Field>
                            </div>

                            {/* Email */}
                            <Field>
                                <FieldLabel className="text-slate-300 font-bold mb-1.5">Adresse e-mail</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText><Mail size={18} className="text-slate-400" /></InputGroupText>
                                    </InputGroupAddon>
                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="jane@company.com" className="bg-slate-50/50" />
                                    </InputGroup>
                            </Field>

                            {/* Password */}
                            <Field>
                                <FieldLabel className="text-slate-300 font-bold mb-1.5">Mot de passe</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText><Lock size={18} className="text-slate-400" /></InputGroupText>
                                    </InputGroupAddon>
                                    <Input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="8+ caractères" className="bg-slate-50/50" />
                                    <InputGroupAddon align="block-end">
                                        <InputGroupText onClick={() => setShowPassword(!showPassword)} className="cursor-pointer hover:text-slate-600 transition-colors">
                                            <Eye size={18} className="text-slate-400" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Field>
                        </FieldGroup>

                        <Button type="submit" variant="amber" className="w-full py-6 text-base">
                            Créer le compte
                        </Button>
                    </form>

                    {/* Separator */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-slate-400 font-medium tracking-tighter">ou continuer avec</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="border-slate-200 py-6 font-bold flex gap-2">
                            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" /> Google
                        </Button>
                        <Button variant="outline" className="border-slate-200 py-6 font-bold flex gap-2 text-slate-800">
                            <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5" /> GitHub
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-2">
                        <p className="text-sm text-slate-400 font-medium">
                            Déjà un compte ?{" "}
                            <a href="#" className="text-sky-500 font-bold hover:underline">Se connecter</a>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
