import { RoleWorkspace } from "@/components/auth/role-workspace"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin workspace",
  description: "Signed-in administrator area for CivicFix.",
}

export default function AdminHomePage() {
  return <RoleWorkspace role="ADMIN" />
}
