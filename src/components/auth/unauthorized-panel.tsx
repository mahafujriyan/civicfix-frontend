"use client"

import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"
import { homeForRole } from "@/lib/auth/roles"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export function UnauthorizedPanel() {
  const currentUser = useCurrentUser()
  const destination = currentUser.data
    ? homeForRole(currentUser.data.role)
    : "/login"

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-lg flex-col items-start justify-center gap-5 px-6">
      <span className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-2xl">
        <ShieldAlert className="size-5" aria-hidden />
      </span>
      <div>
        <h1 className="font-heading text-4xl tracking-tight">Unauthorized</h1>
        <p className="text-muted-foreground mt-3">
          This area belongs to a different CivicFix role. Your account stays
          signed in, and the API still decides what you can change.
        </p>
      </div>
      <Button asChild>
        <Link href={destination}>
          {currentUser.data ? "Go to your workspace" : "Sign in"}
        </Link>
      </Button>
    </main>
  )
}
