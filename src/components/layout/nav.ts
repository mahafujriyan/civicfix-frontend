import type { LucideIcon } from "lucide-react"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.exact || item.href === "/") {
    return pathname === item.href
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}
