import { RoleWorkspace } from "@/components/auth/role-workspace"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Staff workspace",
  description: "Signed-in staff area for CivicFix.",
}

export default function StaffHomePage() {
  return <RoleWorkspace role="STAFF" />
}
