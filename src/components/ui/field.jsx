"use client"

import * as React from "react"

// Mark components as client-only
const FieldGroup = React.forwardRef((props, ref) => <div ref={ref} {...props} />)
FieldGroup.displayName = "FieldGroup"

const Field = React.forwardRef((props, ref) => <div ref={ref} {...props} />)
Field.displayName = "Field"

const FieldLabel = React.forwardRef((props, ref) => (
    <label ref={ref} {...props} />
))
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef((props, ref) => (
    <p ref={ref} {...props} />
))
FieldDescription.displayName = "FieldDescription"

const FieldError = React.forwardRef((props, ref) => <p ref={ref} {...props} />)
FieldError.displayName = "FieldError"

export { FieldGroup, Field, FieldLabel, FieldDescription, FieldError }