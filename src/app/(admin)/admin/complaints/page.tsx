import { ComplaintBrowser } from "@/components/complaints/complaint-browser"
import { TableSkeleton } from "@/components/shared/loading-skeleton"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "All complaints",
}

export default function AdminComplaintsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ComplaintBrowser
        basePath="/admin/complaints"
        title="All complaints"
        description="Administrators see every complaint. Filters stay in the URL."
        showDepartment
      />
    </Suspense>
  )
}
