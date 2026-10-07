import { StaffAnalytics } from "@/components/analytics/staff-analytics"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Staff workload",
}

export default function StaffAnalyticsPage() {
  return <StaffAnalytics />
}
