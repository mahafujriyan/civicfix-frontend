import { PublicShell } from "@/components/layout/public-shell"
import { PaymentResult } from "@/components/payments/payment-desk"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Payment cancelled",
}

export default function PaymentCancelPage() {
  return (
    <PublicShell>
      <PaymentResult
        title="Checkout cancelled"
        description="Leaving Stripe Checkout does not change the payment. The status below is whatever the API currently stores."
      />
    </PublicShell>
  )
}
