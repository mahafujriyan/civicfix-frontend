import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

const tones = {
  default: "bg-primary/12 text-primary",
  warning: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  success: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
  danger: "bg-destructive/10 text-destructive",
} as const

export type StatCardTone = keyof typeof tones

type StatCardProps = {
  label: string
  value: ReactNode
  hint?: string
  icon?: LucideIcon
  tone?: StatCardTone
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  return (
    <article className="civic-rise bg-card ring-foreground/10 rounded-2xl p-5 shadow-sm ring-1">
      <div className="flex items-start justify-between gap-3">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        {Icon ? (
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-xl",
              tones[tone],
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>
        ) : null}
      </div>
      <p className="font-heading text-foreground mt-4 text-3xl tracking-tight">
        {value}
      </p>
      {hint ? (
        <p className="text-muted-foreground mt-1 text-sm">{hint}</p>
      ) : null}
    </article>
  )
}
