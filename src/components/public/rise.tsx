import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type RiseProps = {
  children: ReactNode
  className?: string
  delay?: number
  immediate?: boolean
}

export function Rise({
  children,
  className,
  delay = 0,
  immediate = false,
}: RiseProps) {
  return (
    <div
      className={cn(immediate ? "civic-now" : "civic-rise", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
