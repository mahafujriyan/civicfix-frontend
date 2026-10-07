import { Badge } from "@/components/ui/badge"
import { cn, humanizeToken } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  SUBMITTED:
    "border-amber-500/30 bg-amber-500/15 text-amber-800 dark:text-amber-200",
  UNDER_REVIEW:
    "border-sky-500/30 bg-sky-500/15 text-sky-800 dark:text-sky-200",
  ASSIGNED: "border-primary/30 bg-primary/10 text-primary",
  IN_PROGRESS: "border-sky-600/30 bg-sky-600/15 text-sky-900 dark:text-sky-100",
  RESOLVED:
    "border-emerald-500/30 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  CLOSED: "border-border bg-muted text-muted-foreground",
  REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",
  CANCELLED: "border-border bg-muted text-muted-foreground",
}

type StatusBadgeProps = {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_")

  return (
    <Badge
      variant="outline"
      className={cn("h-6 px-2.5", statusStyles[key], className)}
    >
      {humanizeToken(key)}
    </Badge>
  )
}
