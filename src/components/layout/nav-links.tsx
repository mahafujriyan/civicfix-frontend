"use client"

import { isNavItemActive, type NavItem } from "@/components/layout/nav"
import { SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type NavLinksProps = {
  items: NavItem[]
  layoutId: string
  dismissSheet?: boolean
}

export function NavLinks({
  items,
  layoutId,
  dismissSheet = false,
}: NavLinksProps) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  return (
    <nav aria-label="Primary">
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const active = isNavItemActive(pathname, item)
          const Icon = item.icon
          const link = (
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "text-sidebar-foreground/75 hover:text-sidebar-foreground focus-visible:ring-sidebar-ring relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2",
                active && "text-sidebar-accent-foreground",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={reduceMotion ? undefined : layoutId}
                  className="bg-sidebar-accent absolute inset-0 rounded-lg"
                  transition={{ type: "spring", bounce: 0.16, duration: 0.4 }}
                />
              ) : null}
              <Icon className="relative size-4" aria-hidden />
              <span className="relative">{item.label}</span>
            </Link>
          )

          return (
            <li key={item.href}>
              {dismissSheet ? <SheetClose asChild>{link}</SheetClose> : link}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
