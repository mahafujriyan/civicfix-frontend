import { RoleWorkspace } from "@/components/auth/role-workspace"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Citizen workspace",
  description: "Signed-in citizen area for CivicFix.",
}

export default function CitizenDashboardPage() {
  return <RoleWorkspace role="CITIZEN" />
}
