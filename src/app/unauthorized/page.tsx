import { UnauthorizedPanel } from "@/components/auth/unauthorized-panel"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Unauthorized",
  description: "This CivicFix area is not available for the current role.",
}

export default function UnauthorizedPage() {
  return <UnauthorizedPanel />
}
