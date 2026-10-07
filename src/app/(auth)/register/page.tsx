import { RegisterForm } from "@/components/auth/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a CivicFix citizen account to report and track city complaints.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
