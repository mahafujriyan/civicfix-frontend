import { WorkspaceFrame } from "@/components/layout/workspace-frame"
import type { ReactNode } from "react"

export const instant = false

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return <WorkspaceFrame role="CITIZEN">{children}</WorkspaceFrame>
}
