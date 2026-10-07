import { ComplaintBrowser } from "@/components/complaints/complaint-browser"
import { TableSkeleton } from "@/components/shared/loading-skeleton"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Complaints",
}

export default function CitizenComplaintsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ComplaintBrowser
        basePath="/dashboard/complaints"
        title="Your complaints"
        description="Search, filters, sorting, and pages stay in the URL."
        createHref="/dashboard/complaints/new"
      />
    </Suspense>
  )
}
