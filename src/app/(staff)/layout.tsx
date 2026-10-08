import { WorkspaceFrame } from "@/components/layout/workspace-frame"
import type { ReactNode } from "react"

export const instant = false

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <WorkspaceFrame role="STAFF">{children}</WorkspaceFrame>
}
