import { MobileNavigation } from "@/components/layout/mobile-navigation"
import type { NavItem } from "@/components/layout/nav"
import { Sidebar } from "@/components/layout/sidebar"
import { Suspense, type ReactNode } from "react"

type AppShellProps = {
  items: NavItem[]
  children: ReactNode
  title?: string
  subtitle?: string
  user?: ReactNode
}

export function AppShell({
  items,
  children,
  title = "CivicFix",
  subtitle = "City services",
  user,
}: AppShellProps) {
  return (
    <div className="bg-background flex min-h-svh">
      <a
        href="#main-content"
        className="focus:bg-card sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:px-3 focus:py-2 focus:shadow-sm"
      >
        Skip to content
      </a>
      <Suspense
        fallback={
          <div
            className="border-sidebar-border bg-sidebar hidden w-72 shrink-0 border-r lg:block"
            aria-hidden
          />
        }
      >
        <Sidebar
          className="hidden lg:flex"
          title={title}
          subtitle={subtitle}
          items={items}
          user={user}
        />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-card/90 sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 backdrop-blur lg:hidden">
          <Suspense fallback={<div className="size-10" aria-hidden />}>
            <MobileNavigation
              title={title}
              subtitle={subtitle}
              items={items}
              user={user}
            />
          </Suspense>
          <p className="font-heading text-lg leading-none">{title}</p>
        </header>
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
