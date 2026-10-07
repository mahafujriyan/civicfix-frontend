import { NavLinks } from "@/components/layout/nav-links"
import type { NavItem } from "@/components/layout/nav"
import { cn } from "@/lib/utils"
import { Landmark } from "lucide-react"
import type { ReactNode } from "react"

type SidebarProps = {
  title: string
  subtitle: string
  items: NavItem[]
  user?: ReactNode
  className?: string
}

export function Sidebar({
  title,
  subtitle,
  items,
  user,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "border-sidebar-border bg-sidebar text-sidebar-foreground sticky top-0 h-svh w-72 shrink-0 flex-col border-r",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-10 items-center justify-center rounded-xl">
          <Landmark className="size-5" aria-hidden />
        </span>
        <div>
          <p className="font-heading text-xl leading-none tracking-tight">
            {title}
          </p>
          <p className="text-sidebar-foreground/65 mt-1 text-xs">{subtitle}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3">
        <NavLinks items={items} layoutId="civicfix-nav-desktop" />
      </div>
      {user ? (
        <div className="border-sidebar-border border-t p-4">{user}</div>
      ) : null}
    </aside>
  )
}
