"use client"

import {
  createPaymentSession,
  getPayment,
  type CreatePaymentRequest,
} from "@/lib/api/payments"
import { queryKeys } from "@/lib/api/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function usePayment(id: string) {
  return useQuery({
    queryKey: queryKeys.payment(id),
    queryFn: () => getPayment(id),
    enabled: id.length > 0,
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreatePaymentRequest) => createPaymentSession(input),
    onSuccess: (session) => {
      queryClient.setQueryData(
        queryKeys.payment(session.payment.id),
        session.payment,
      )
    },
  })
}
