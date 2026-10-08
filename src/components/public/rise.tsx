import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type RiseProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function Rise({ children, className, delay = 0 }: RiseProps) {
  return (
    <div
      className={cn("civic-rise", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
