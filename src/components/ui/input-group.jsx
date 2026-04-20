"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"

// Base component for grouping inputs and addons
const InputGroup = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`relative flex items-center ${className || ""}`}
        {...props}
    />
))
InputGroup.displayName = "InputGroup"

// Addon for icons or text
const InputGroupAddon = React.forwardRef(
    ({ className, align, ...props }, ref) => (
        <div
            ref={ref}
            className={`absolute flex items-center justify-center h-full px-3 ${
                align === "block-end" ? "bottom-0 right-0" : "top-0 left-0"
            } ${className || ""}`}
            {...props}
        />
    )
)
InputGroupAddon.displayName = "InputGroupAddon"

// Text inside an addon
const InputGroupText = React.forwardRef(({ className, ...props }, ref) => (
    <span
        ref={ref}
        className={`text-sm text-slate-500 ${className || ""}`}
        {...props}
    />
))
InputGroupText.displayName = "InputGroupText"

// A textarea designed to work within an InputGroup
const InputGroupTextarea = React.forwardRef(({ className, ...props }, ref) => (
    <Textarea
        ref={ref}
        className={`w-full pr-12 ${className || ""}`} // Add padding to avoid text overlap
        {...props}
    />
))
InputGroupTextarea.displayName = "InputGroupTextarea"

export { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea }
