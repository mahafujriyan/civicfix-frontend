"use client"

import { isNavItemActive, type NavItem } from "@/components/layout/nav"
import { SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

type NavLinksProps = {
  items: NavItem[]
  dismissSheet?: boolean
}

export function NavLinks({ items, dismissSheet = false }: NavLinksProps) {
  const pathname = usePathname()

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
                active && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
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
