import type { ReactNode } from "react"

type FilterBarProps = {
  children: ReactNode
  action?: string
  label?: string
}

export function FilterBar({
  children,
  action,
  label = "Filters",
}: FilterBarProps) {
  return (
    <form
      method="get"
      action={action}
      role="search"
      aria-label={label}
      className="bg-card ring-foreground/10 flex flex-col gap-3 rounded-2xl p-4 ring-1 sm:flex-row sm:items-end"
    >
      {children}
    </form>
  )
}
