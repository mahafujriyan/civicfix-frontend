"use client"

import { AppShell } from "@/components/layout/app-shell"
import { roleNav } from "@/components/layout/role-nav"
import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/shared/error-state"
import { DashboardSkeleton } from "@/components/shared/loading-skeleton"
import { useLogout } from "@/hooks/use-auth"
import { useCurrentUser } from "@/hooks/use-current-user"
import { errorMessage } from "@/lib/format"
import type { UserRole } from "@/types/domain"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

const titles: Record<UserRole, string> = {
  CITIZEN: "Citizen",
  STAFF: "Staff",
  ADMIN: "Admin",
}

type WorkspaceFrameProps = {
  role: UserRole
  children: ReactNode
}

export function WorkspaceFrame({ role, children }: WorkspaceFrameProps) {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const logout = useLogout()

  async function signOut() {
    await logout.mutateAsync()
    router.push("/login")
    router.refresh()
  }

  const userSlot = currentUser.data ? (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-medium">{currentUser.data.fullName}</p>
        <p className="text-sidebar-foreground/70 text-xs">
          {currentUser.data.email}
        </p>
      </div>
      <Button type="button" variant="secondary" onClick={() => void signOut()}>
        {logout.isPending ? "Signing out..." : "Sign out"}
      </Button>
    </div>
  ) : null

  return (
    <AppShell
      items={roleNav[role]}
      title="CivicFix"
      subtitle={titles[role]}
      user={userSlot}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        {currentUser.isLoading ? <DashboardSkeleton /> : null}
        {currentUser.isError ? (
          <ErrorState
            description={errorMessage(
              currentUser.error,
              "Your session could not be confirmed.",
            )}
            action={
              <Button type="button" onClick={() => void currentUser.refetch()}>
                Try again
              </Button>
            }
          />
        ) : null}
        {currentUser.data && currentUser.data.role !== role ? (
          <ErrorState
            title="Wrong workspace"
            description="This area belongs to a different CivicFix role."
          />
        ) : null}
        {currentUser.data?.role === role ? children : null}
      </div>
    </AppShell>
  )
}
