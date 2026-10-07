"use client"

import {
  getFeedback,
  submitFeedback,
  type SubmitFeedbackRequest,
} from "@/lib/api/feedback"
import { queryKeys } from "@/lib/api/query-keys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useFeedback(complaintId: string) {
  return useQuery({
    queryKey: queryKeys.complaintFeedback(complaintId),
    queryFn: () => getFeedback(complaintId),
    enabled: complaintId.length > 0,
    retry: false,
  })
}

export function useSubmitFeedback(complaintId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SubmitFeedbackRequest) =>
      submitFeedback(complaintId, input),
    onSuccess: (feedback) => {
      queryClient.setQueryData(
        queryKeys.complaintFeedback(complaintId),
        feedback,
      )
      void queryClient.invalidateQueries({
        queryKey: queryKeys.complaint(complaintId),
      })
    },
  })
}
