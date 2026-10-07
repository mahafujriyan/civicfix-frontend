import { ComplaintBrowser } from "@/components/complaints/complaint-browser"
import { TableSkeleton } from "@/components/shared/loading-skeleton"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Staff queue",
}

export default function StaffComplaintsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ComplaintBrowser
        basePath="/staff/complaints"
        title="Assigned queue"
        description="Only complaints assigned to you are returned by the API."
      />
    </Suspense>
  )
}
