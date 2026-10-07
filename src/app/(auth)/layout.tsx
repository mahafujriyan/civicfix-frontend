import { AuthFrame } from "@/components/auth/auth-frame"
import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthFrame>{children}</AuthFrame>
}
