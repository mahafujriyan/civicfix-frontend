import { WorkspaceFrame } from "@/components/layout/workspace-frame"
import type { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <WorkspaceFrame role="ADMIN">{children}</WorkspaceFrame>
}
