"use client"

import { NavLinks } from "@/components/layout/nav-links"
import type { NavItem } from "@/components/layout/nav"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Landmark, Menu } from "lucide-react"
import type { ReactNode } from "react"

type MobileNavigationProps = {
  title: string
  subtitle: string
  items: NavItem[]
  user?: ReactNode
}

export function MobileNavigation({
  title,
  subtitle,
  items,
  user,
}: MobileNavigationProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-10"
          aria-label="Open navigation"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-sidebar-border bg-sidebar text-sidebar-foreground w-72 p-0 sm:max-w-xs"
      >
        <SheetHeader className="border-sidebar-border border-b px-5 py-5">
          <SheetTitle className="text-sidebar-foreground flex items-center gap-3">
            <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-10 items-center justify-center rounded-xl">
              <Landmark className="size-5" aria-hidden />
            </span>
            <span>
              <span className="font-heading block text-xl leading-none">
                {title}
              </span>
              <span className="text-sidebar-foreground/65 mt-1 block text-xs font-normal">
                {subtitle}
              </span>
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="px-3 py-4">
          <NavLinks items={items} layoutId="civicfix-nav-mobile" dismissSheet />
        </div>
        {user ? (
          <div className="border-sidebar-border mt-auto border-t p-4">
            {user}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
