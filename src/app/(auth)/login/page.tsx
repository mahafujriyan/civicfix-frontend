import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to CivicFix as a citizen, staff member, or administrator.",
}

export default function LoginPage() {
  return <LoginForm />
}
