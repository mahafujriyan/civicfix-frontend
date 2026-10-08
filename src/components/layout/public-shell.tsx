import { PublicHeader, publicLinks } from "@/components/layout/public-header"
import { Landmark } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

const desks = [
  { href: "/login", label: "Citizen desk" },
  { href: "/login", label: "Staff desk" },
  { href: "/login", label: "Admin desk" },
]

type PublicShellProps = {
  children: ReactNode
}

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="bg-background flex min-h-svh flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <footer className="bg-sidebar text-sidebar-foreground mt-8">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2">
              <Landmark className="size-4" aria-hidden />
              <span className="font-heading text-2xl">CivicFix</span>
            </p>
            <p className="text-sidebar-foreground/70 mt-3 max-w-xs text-sm leading-6">
              City complaint records, staff assignments, and service payments.
              The API remains the record of what happened.
            </p>
          </div>
          <div>
            <p className="text-sidebar-primary text-xs font-medium tracking-[0.16em] uppercase">
              Explore
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {publicLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sidebar-primary text-xs font-medium tracking-[0.16em] uppercase">
              Desks
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {desks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sidebar-primary text-xs font-medium tracking-[0.16em] uppercase">
              Account
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <Link
                  href="/register"
                  className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
                >
                  Create a citizen account
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/unauthorized"
                  className="text-sidebar-foreground/80 hover:text-sidebar-foreground"
                >
                  Wrong role
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-sidebar-border text-sidebar-foreground/60 border-t px-4 py-4 text-xs sm:px-6">
          <p className="mx-auto w-full max-w-6xl">
            CivicFix frontend. Authorization stays on the city API.
          </p>
        </div>
      </footer>
    </div>
  )
}
