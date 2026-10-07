import { Label } from "@/components/ui/label"
import type { ReactNode } from "react"

type FormFieldProps = {
  label: string
  htmlFor: string
  children: ReactNode
  error?: string
  hint?: string
  required?: boolean
}

export function FormField({
  label,
  htmlFor,
  children,
  error,
  hint,
  required = false,
}: FormFieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined
  const errorId = error ? `${htmlFor}-error` : undefined

  return (
    <div
      className="flex flex-col gap-2"
      data-invalid={error ? true : undefined}
    >
      <Label htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        ) : null}
        {required ? <span className="sr-only">required</span> : null}
      </Label>
      {children}
      {hint ? (
        <p id={hintId} className="text-muted-foreground text-sm">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </div>
  )
}
