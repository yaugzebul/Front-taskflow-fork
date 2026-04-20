"use client"

import *_React from "react"

// Mark components as client-only
const FieldGroup = _React.forwardRef((props, ref) => <div ref={ref} {...props} />)
FieldGroup.displayName = "FieldGroup"

const Field = _React.forwardRef((props, ref) => <div ref={ref} {...props} />)
Field.displayName = "Field"

const FieldLabel = _React.forwardRef((props, ref) => (
    <label ref={ref} {...props} />
))
FieldLabel.displayName = "FieldLabel"

const FieldDescription = _React.forwardRef((props, ref) => (
    <p ref={ref} {...props} />
))
FieldDescription.displayName = "FieldDescription"

const FieldError = _React.forwardRef((props, ref) => <p ref={ref} {...props} />)
FieldError.displayName = "FieldError"

export { FieldGroup, Field, FieldLabel, FieldDescription, FieldError }
