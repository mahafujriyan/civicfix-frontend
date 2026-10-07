import { AdminReports } from "@/components/analytics/admin-reports"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reports",
}

export default function AdminReportsPage() {
  return (
    <AdminReports
      title="Reports"
      description="Status, priority, and category breakdowns from GET /analytics/complaints."
    />
  )
}
