"use client"

import { FormField } from "@/components/shared/form-field"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreatePayment, usePayment } from "@/hooks/use-payments"
import { errorMessage, formatMoney, formatWhen } from "@/lib/format"
import {
  readRememberedPaymentId,
  rememberPaymentId,
} from "@/lib/payments/remembered-payment"
import {
  checkoutSchema,
  paymentLookupSchema,
  type CheckoutFormValues,
  type PaymentLookupValues,
} from "@/schemas/payment"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function PaymentDesk() {
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const payment = usePayment(paymentId ?? "")
  const createPayment = useCreatePayment()
  const lookup = useForm<PaymentLookupValues>({
    resolver: zodResolver(paymentLookupSchema),
    defaultValues: { paymentId: "" },
  })
  const checkout = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      amount: 500,
      currency: "usd",
      description: "CivicFix service fee",
      complaintId: "",
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Payments"
        title="Service payments"
        description="CivicFix can create a Stripe Checkout session and load one payment by id. It does not provide a payment list, so this page does not invent a history."
      />
      <form
        className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-2xl p-5 ring-1"
        onSubmit={checkout.handleSubmit(async (values) => {
          try {
            const session = await createPayment.mutateAsync({
              amount: values.amount,
              currency: values.currency.toLowerCase(),
              description: values.description.trim() || undefined,
              complaintId: values.complaintId.trim() || undefined,
            })
            rememberPaymentId(session.payment.id)
            setPaymentId(session.payment.id)
            if (!session.checkoutUrl) {
              toast.error("Stripe did not return a checkout URL")
              return
            }
            window.location.assign(session.checkoutUrl)
          } catch (error: unknown) {
            toast.error(errorMessage(error, "Checkout could not be started"))
          }
        })}
      >
        <h2 className="font-heading text-2xl">Start checkout</h2>
        <FormField
          label="Amount in cents"
          htmlFor="amount"
          required
          hint="500 is 5.00 in the selected currency. Stripe confirms the charge."
          error={checkout.formState.errors.amount?.message}
        >
          <Input
            id="amount"
            type="number"
            min={1}
            {...checkout.register("amount", { valueAsNumber: true })}
          />
        </FormField>
        <FormField label="Currency" htmlFor="currency" required error={checkout.formState.errors.currency?.message}>
          <Input id="currency" maxLength={3} {...checkout.register("currency")} />
        </FormField>
        <FormField label="Complaint id" htmlFor="complaintId" hint="Optional. Must be your own complaint.">
          <Input id="complaintId" {...checkout.register("complaintId")} />
        </FormField>
        <FormField label="Description" htmlFor="description">
          <Input id="description" {...checkout.register("description")} />
        </FormField>
        <Button type="submit" disabled={createPayment.isPending}>
          {createPayment.isPending ? "Starting checkout..." : "Continue to Stripe"}
        </Button>
      </form>
      <form
        className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-2xl p-5 ring-1"
        onSubmit={lookup.handleSubmit((values) => setPaymentId(values.paymentId))}
      >
        <h2 className="font-heading text-2xl">Look up a payment</h2>
        <FormField
          label="Payment id"
          htmlFor="paymentId"
          required
          error={lookup.formState.errors.paymentId?.message}
        >
          <Input id="paymentId" {...lookup.register("paymentId")} />
        </FormField>
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Load payment</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const remembered = readRememberedPaymentId()
              if (!remembered) {
                toast.error("This browser has no payment id from a checkout yet")
                return
              }
              setPaymentId(remembered)
            }}
          >
            Load last checkout
          </Button>
        </div>
      </form>
      {payment.isError ? (
        <p className="text-destructive text-sm">
          {errorMessage(payment.error, "Payment could not be loaded.")}
        </p>
      ) : null}
      {payment.data ? <PaymentCard id={payment.data.id} /> : null}
    </div>
  )
}

export function PaymentCard({ id }: { id: string }) {
  const payment = usePayment(id)
  if (!payment.data) {
    return null
  }

  return (
    <article className="bg-card ring-foreground/10 rounded-2xl p-5 ring-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-2xl">
          {formatMoney(payment.data.amount, payment.data.currency)}
        </h2>
        <StatusBadge status={payment.data.status} />
      </div>
      <p className="text-muted-foreground mt-2 text-sm">
        {payment.data.description ?? "CivicFix service fee"}
      </p>
      <dl className="mt-4 grid gap-2 text-sm">
        <div>
          <dt className="text-muted-foreground">Payment id</dt>
          <dd className="font-mono text-xs">{payment.data.id}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Created</dt>
          <dd>{formatWhen(payment.data.createdAt)}</dd>
        </div>
        {payment.data.paidAt ? (
          <div>
            <dt className="text-muted-foreground">Paid</dt>
            <dd>{formatWhen(payment.data.paidAt)}</dd>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Status stays pending until the Stripe webhook updates it. This page does not mark a payment as paid.
          </p>
        )}
      </dl>
    </article>
  )
}

export function PaymentResult({
  title,
  description,
}: {
  title: string
  description: string
}) {
  const [paymentId, setPaymentId] = useState("")
  const payment = usePayment(paymentId)

  useEffect(() => {
    const remembered = readRememberedPaymentId()
    if (remembered) {
      setPaymentId(remembered)
    }
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-16">
      <PageHeader title={title} description={description} />
      {payment.data ? <PaymentCard id={payment.data.id} /> : null}
      {payment.isError ? (
        <p className="text-destructive text-sm">
          {errorMessage(payment.error, "The payment status could not be loaded.")}
        </p>
      ) : null}
      {!paymentId ? (
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            const data = new FormData(event.currentTarget)
            const value = String(data.get("paymentId") ?? "")
            setPaymentId(value)
          }}
        >
          <FormField label="Payment id" htmlFor="result-payment-id" required>
            <Input id="result-payment-id" name="paymentId" />
          </FormField>
          <Button type="submit">Check status</Button>
        </form>
      ) : null}
    </div>
  )
}
