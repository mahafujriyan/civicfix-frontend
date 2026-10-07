import type { ReactNode } from "react"

type ErrorStateProps = {
  title?: string
  description?: string
  action?: ReactNode
}

export function ErrorState({
  title = "Something went wrong",
  description = "The request could not be completed. Try again in a moment.",
  action,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="border-destructive/30 bg-destructive/5 rounded-2xl border px-6 py-10 text-center"
    >
      <h2 className="font-heading text-destructive text-2xl tracking-tight">
        {title}
      </h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
