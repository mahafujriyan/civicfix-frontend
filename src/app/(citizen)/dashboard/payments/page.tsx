import { PaymentDesk } from "@/components/payments/payment-desk"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Payments",
}

export default function CitizenPaymentsPage() {
  return <PaymentDesk />
}
