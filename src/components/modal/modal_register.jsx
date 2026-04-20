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

    function handleSubmit(event) {
        event.preventDefault()
        // Simple validation
        if (firstName.length < 2) {
            toast.error("First name is required.")
            return
        }
        if (lastName.length < 2) {
            toast.error("Last name is required.")
            return
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("Please enter a valid email address.")
            return
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.")
            return
        }

        const formData = { firstName, lastName, email, password }
        console.log("Creating account:", formData)

        toast.success("Account created successfully!")
        setIsOpen(false)
        // Reset fields
        setFirstName("")
        setLastName("")
        setEmail("")
        setPassword("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Sign Up</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[480px] border-none shadow-2xl rounded-2xl p-4">
                <div className="pt-6 space-y-6">
                    {/* Header: Logo + Fermer */}
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-slate-800 p-2 rounded-lg text-white">
                                <Layers size={24} />
                            </div>
                            <span className="text-2xl font-bold text-slate-800 tracking-tight">
                                Task<span className="text-yellow-500">Flow</span>
                            </span>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </Button>
                    </div>

                    {/* Titres */}
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold text-slate-900">Create your account</h1>
                        <p className="text-slate-500 text-sm">
                            Start managing tasks in minutes. Free forever.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FieldGroup className="space-y-4">
                            {/* Prénom & Nom sur une ligne */}
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel className="text-slate-700 font-bold mb-1.5">First Name</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <InputGroupText><User size={18} className="text-slate-400" /></InputGroupText>
                                        </InputGroupAddon>
                                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" className="bg-slate-50/50" />
                                    </InputGroup>
                                </Field>
                                <Field>
                                    <FieldLabel className="text-slate-700 font-bold mb-1.5">Last Name</FieldLabel>
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
                                <FieldLabel className="text-slate-700 font-bold mb-1.5">Email Address</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText><Mail size={18} className="text-slate-400" /></InputGroupText>
                                    </InputGroupAddon>
                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="jane@company.com" className="bg-slate-50/50" />
                                </InputGroup>
                            </Field>

                            {/* Password */}
                            <Field>
                                <FieldLabel className="text-slate-700 font-bold mb-1.5">Password</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <InputGroupText><Lock size={18} className="text-slate-400" /></InputGroupText>
                                    </InputGroupAddon>
                                    <Input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="Create a strong password" className="bg-slate-50/50" />
                                    <InputGroupAddon align="block-end">
                                        <InputGroupText onClick={() => setShowPassword(!showPassword)} className="cursor-pointer hover:text-slate-600 transition-colors">
                                            <Eye size={18} className="text-slate-400" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Field>
                        </FieldGroup>

                        <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-6 text-base shadow-sm transition-all">
                            Create Account
                        </Button>
                    </form>

                    {/* Separator */}
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-slate-400 font-medium tracking-tighter">or continue with</span>
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
                            Already have an account?{" "}
                            <a href="#" className="text-sky-500 font-bold hover:underline">Log in</a>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
