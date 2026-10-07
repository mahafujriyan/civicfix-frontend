import { Badge } from "@/components/ui/badge"
import { cn, humanizeToken } from "@/lib/utils"

const priorityStyles: Record<string, string> = {
  LOW: "border-border bg-muted text-muted-foreground",
  MEDIUM: "border-sky-500/30 bg-sky-500/15 text-sky-800 dark:text-sky-200",
  HIGH: "border-amber-500/30 bg-amber-500/15 text-amber-800 dark:text-amber-200",
  URGENT: "border-destructive/30 bg-destructive/10 text-destructive",
}

type PriorityBadgeProps = {
  priority: string
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const key = priority
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_")

  return (
    <Badge
      variant="outline"
      className={cn("h-6 px-2.5", priorityStyles[key], className)}
    >
      {humanizeToken(key)}
    </Badge>
  )
}
