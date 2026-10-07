import { PublicShell } from "@/components/layout/public-shell"
import { PageHeader } from "@/components/shared/page-header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing",
}

export default function PricingPage() {
  return (
    <PublicShell>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16 sm:px-6">
        <PageHeader
          eyebrow="Pricing"
          title="Service fees go through Stripe"
          description="CivicFix does not keep a fixed public price list. A signed-in citizen starts checkout with an amount in the smallest currency unit."
        />
        <ol className="flex flex-col gap-4 text-sm leading-6">
          <li>
            The browser sends the amount, a 3-letter currency, and an optional
            complaint id to POST /payments/create-session.
          </li>
          <li>
            The API creates a pending payment and a Stripe Checkout session.
          </li>
          <li>
            Stripe collects the card. This site never marks the payment as paid.
          </li>
          <li>
            The backend webhook is what moves the payment to paid, failed, or
            cancelled.
          </li>
          <li>
            After checkout, the return pages load GET /payments/{"{id}"} and
            show that stored status.
          </li>
        </ol>
      </div>
    </PublicShell>
  )
}
