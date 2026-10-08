import { PublicShell } from "@/components/layout/public-shell"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Pricing",
}

const beats = [
  {
    title: "You name the amount",
    copy: "The amount is an integer in the smallest currency unit. 500 in usd is 5.00. There is no fixed city price table.",
  },
  {
    title: "The API opens Stripe",
    copy: "POST /payments/create-session creates a pending payment and returns the Checkout URL.",
  },
  {
    title: "Stripe takes the card",
    copy: "CivicFix never asks for the card number. The browser only redirects.",
  },
  {
    title: "The webhook writes the result",
    copy: "Paid, failed, or cancelled is stored by the backend. The return page reads that status.",
  },
]

export default function PricingPage() {
  return (
    <PublicShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-16 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-primary text-sm font-medium tracking-[0.16em] uppercase">
            Pricing
          </p>
          <h1 className="font-heading mt-3 text-5xl tracking-tight sm:text-6xl">
            Service fees go through Stripe, one checkout at a time.
          </h1>
          <p className="text-muted-foreground mt-5 text-lg leading-8">
            A signed-in citizen can attach a fee to their own complaint. The
            amount is chosen for that checkout, then confirmed by Stripe.
          </p>
        </div>
        <ol className="grid gap-4 md:grid-cols-2">
          {beats.map((beat, index) => (
            <li key={beat.title} className="bg-card ring-foreground/10 rounded-[1.6rem] p-6 ring-1">
              <p className="font-heading text-primary text-3xl">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="font-heading mt-3 text-2xl">{beat.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm leading-6">{beat.copy}</p>
            </li>
          ))}
        </ol>
        <section className="bg-sidebar text-sidebar-foreground grid gap-6 rounded-[2rem] p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-heading text-4xl">What you will not see here</h2>
            <p className="text-sidebar-foreground/75 mt-4 text-sm leading-6">
              No “mark as paid” button. No invented invoice history. If the API
              cannot list payments, this site will not draw a fake one.
            </p>
          </div>
          <div className="flex items-end">
            <Button variant="secondary" asChild>
              <Link href="/login">Sign in to start a checkout</Link>
            </Button>
          </div>
        </section>
      </div>
    </PublicShell>
  )
}
