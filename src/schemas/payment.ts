import { z } from "zod"

export const checkoutSchema = z.object({
  amount: z.number().int().positive("Enter the amount in cents").max(1_000_000),
  currency: z.string().trim().length(3, "Use a 3-letter currency code"),
  description: z.string().trim().max(255),
  complaintId: z.string(),
})

export const paymentLookupSchema = z.object({
  paymentId: z.uuid("Enter the payment id returned by CivicFix"),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
export type PaymentLookupValues = z.infer<typeof paymentLookupSchema>
