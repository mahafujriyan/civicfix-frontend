import { Landmark } from "lucide-react"
import type { ReactNode } from "react"

type AuthFrameProps = {
  children: ReactNode
}

export function AuthFrame({ children }: AuthFrameProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
      <section className="bg-sidebar text-sidebar-foreground relative hidden overflow-hidden px-12 py-14 lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, oklch(0.74 0.11 175 / 0.35), transparent 32%), radial-gradient(circle at 80% 0%, oklch(0.62 0.12 75 / 0.22), transparent 28%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-11 items-center justify-center rounded-2xl">
            <Landmark className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-heading text-2xl leading-none">CivicFix</p>
            <p className="text-sidebar-foreground/70 mt-1 text-sm">
              City complaint services
            </p>
          </div>
        </div>
        <div className="relative max-w-md">
          <p className="text-sidebar-primary text-sm font-medium tracking-[0.16em] uppercase">
            Public service
          </p>
          <h1 className="font-heading mt-4 text-5xl leading-[1.05] tracking-tight">
            Every street issue gets a record, a status, and a person.
          </h1>
          <p className="text-sidebar-foreground/75 mt-5 text-base leading-7">
            Citizens file complaints. Staff move them forward. Admins keep the
            departments, categories, and assignments in order.
          </p>
        </div>
        <p className="text-sidebar-foreground/60 relative text-sm">
          Signed in with the CivicFix city API.
        </p>
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl">
              <Landmark className="size-5" aria-hidden />
            </span>
            <p className="font-heading text-2xl">CivicFix</p>
          </div>
          {children}
        </div>
      </section>
    </div>
  )
}
