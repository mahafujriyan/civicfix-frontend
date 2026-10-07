import { CitizenOverview } from "@/components/complaints/citizen-overview"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function CitizenDashboardPage() {
  return <CitizenOverview />
}
