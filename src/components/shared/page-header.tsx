import type { ReactNode } from "react"

type PageHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-primary text-sm font-medium tracking-wide uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-heading text-foreground text-3xl tracking-tight sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground mt-2 text-base">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  )
}
