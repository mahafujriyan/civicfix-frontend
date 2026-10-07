import { apiRequest } from "@/lib/api/client"
import type { CheckoutSession, Payment } from "@/types/domain"

export type CreatePaymentRequest = {
  amount: number
  currency?: string
  complaintId?: string
  description?: string
}

export async function createPaymentSession(
  input: CreatePaymentRequest,
): Promise<CheckoutSession> {
  const response = await apiRequest<CheckoutSession>(
    "/payments/create-session",
    {
      method: "POST",
      body: input,
    },
  )
  return response.data
}

export async function getPayment(id: string): Promise<Payment> {
  const response = await apiRequest<Payment>(`/payments/${id}`)
  return response.data
}
