"use client"

import { AppShell } from "@/components/layout/app-shell"
import type { NavItem } from "@/components/layout/nav"
import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/shared/error-state"
import { LoadingSkeleton } from "@/components/shared/loading-skeleton"
import { useCurrentUser } from "@/hooks/use-current-user"
import { useLogout } from "@/hooks/use-auth"
import { homeForRole } from "@/lib/auth/roles"
import type { UserRole } from "@/types/domain"
import { LayoutDashboard, Shield, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const copy: Record<UserRole, { title: string; description: string }> = {
  CITIZEN: {
    title: "Citizen workspace",
    description:
      "This session is tied to your citizen account. Complaints, feedback, and payments will use this identity.",
  },
  STAFF: {
    title: "Staff workspace",
    description:
      "This session is tied to your staff account. Assigned complaints and status updates will use this identity.",
  },
  ADMIN: {
    title: "Admin workspace",
    description:
      "This session is tied to your administrator account. User, department, and complaint management will use this identity.",
  },
}

const navByRole: Record<UserRole, NavItem[]> = {
  CITIZEN: [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
  ],
  STAFF: [{ href: "/staff", label: "Overview", icon: Shield, exact: true }],
  ADMIN: [{ href: "/admin", label: "Overview", icon: Users, exact: true }],
}

type RoleWorkspaceProps = {
  role: UserRole
}

export function RoleWorkspace({ role }: RoleWorkspaceProps) {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const logout = useLogout()
  const page = copy[role]

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
    <AppShell items={navByRole[role]} user={userSlot}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div>
          <p className="text-primary text-sm font-medium tracking-wide uppercase">
            {role}
          </p>
          <h1 className="font-heading mt-2 text-4xl tracking-tight">
            {page.title}
          </h1>
          <p className="text-muted-foreground mt-3">{page.description}</p>
        </div>
        {currentUser.isLoading ? (
          <div className="space-y-3" aria-busy="true">
            <span className="sr-only">Loading account</span>
            <LoadingSkeleton className="h-6 w-48" />
            <LoadingSkeleton className="h-4 w-64" />
          </div>
        ) : null}
        {currentUser.isError ? (
          <ErrorState
            title="Account could not be loaded"
            description="The CivicFix API did not return the signed-in user."
            action={
              <Button type="button" onClick={() => void signOut()}>
                Back to sign in
              </Button>
            }
          />
        ) : null}
        {currentUser.data && currentUser.data.role !== role ? (
          <ErrorState
            title="This workspace is for another role"
            action={
              <Button asChild>
                <Link href={homeForRole(currentUser.data.role)}>
                  Go to your workspace
                </Link>
              </Button>
            }
          />
        ) : null}
        {currentUser.data && currentUser.data.role === role ? (
          <dl className="bg-card ring-foreground/10 grid gap-4 rounded-2xl p-5 ring-1 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-sm">Name</dt>
              <dd className="mt-1 font-medium">{currentUser.data.fullName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Email</dt>
              <dd className="mt-1 font-medium">{currentUser.data.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Role</dt>
              <dd className="mt-1 font-medium">{currentUser.data.role}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-sm">Phone</dt>
              <dd className="mt-1 font-medium">
                {currentUser.data.phone ?? "Not set"}
              </dd>
            </div>
          </dl>
        ) : null}
      </div>
    </AppShell>
  )
}
