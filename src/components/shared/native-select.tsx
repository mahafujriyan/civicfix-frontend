import { cn } from "@/lib/utils"
import type { ComponentProps, ReactNode } from "react"

export function NativeSelect({
  className,
  ...props
}: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "border-input bg-card h-10 w-full rounded-lg border px-3 text-sm",
        className,
      )}
      {...props}
    />
  )
}

export function FilterField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex min-w-36 flex-1 flex-col gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  )
}

export function FilterSubmit() {
  return (
    <button
      type="submit"
      className="bg-primary text-primary-foreground h-10 rounded-lg px-4 text-sm font-medium"
    >
      Apply
    </button>
  )
}
