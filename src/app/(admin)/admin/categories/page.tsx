import { CatalogManager } from "@/components/admin/catalog-manager"
import { TableSkeleton } from "@/components/shared/loading-skeleton"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Categories",
}

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CatalogManager mode="category" />
    </Suspense>
  )
}
