import { UserManager } from "@/components/admin/user-manager"
import { TableSkeleton } from "@/components/shared/loading-skeleton"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Users",
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <UserManager />
    </Suspense>
  )
}
