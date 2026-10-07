import { CatalogManager } from "@/components/admin/catalog-manager"
import { TableSkeleton } from "@/components/shared/loading-skeleton"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Departments",
}

export default function AdminDepartmentsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CatalogManager mode="department" />
    </Suspense>
  )
}
