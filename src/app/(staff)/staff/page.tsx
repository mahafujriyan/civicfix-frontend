import { StaffOverview } from "@/components/complaints/staff-overview"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Staff",
}

export default function StaffHomePage() {
  return <StaffOverview />
}
