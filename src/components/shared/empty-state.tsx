import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type EmptyStateProps = {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="border-border bg-card/70 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center">
      {Icon ? (
        <span className="bg-accent text-accent-foreground mb-4 flex size-12 items-center justify-center rounded-2xl">
          <Icon className="size-5" aria-hidden />
        </span>
      ) : null}
      <h2 className="font-heading text-2xl tracking-tight">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
