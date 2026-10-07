import { PublicShell } from "@/components/layout/public-shell"
import { PaymentResult } from "@/components/payments/payment-desk"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Payment received",
}

export default function PaymentSuccessPage() {
  return (
    <PublicShell>
      <PaymentResult
        title="Payment return"
        description="Stripe sent you back here. CivicFix marks a payment paid only after its webhook runs, so the status below is loaded from GET /payments/{id}."
      />
    </PublicShell>
  )
}
