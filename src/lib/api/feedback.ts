import { apiRequest } from "@/lib/api/client"
import type { Feedback } from "@/types/domain"

export type SubmitFeedbackRequest = {
  rating: number
  comment?: string
}

export async function getFeedback(complaintId: string): Promise<Feedback> {
  const response = await apiRequest<Feedback>(
    `/complaints/${complaintId}/feedback`,
  )
  return response.data
}

export async function submitFeedback(
  complaintId: string,
  input: SubmitFeedbackRequest,
): Promise<Feedback> {
  const response = await apiRequest<Feedback>(
    `/complaints/${complaintId}/feedback`,
    {
      method: "POST",
      body: input,
    },
  )
  return response.data
}
