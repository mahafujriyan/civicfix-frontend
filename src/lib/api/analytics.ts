import { apiRequest } from "@/lib/api/client"
import type { AdminOverview, ComplaintAnalytics } from "@/types/domain"

export async function getAdminOverview(): Promise<AdminOverview> {
  const response = await apiRequest<AdminOverview>("/analytics/overview")
  return response.data
}

export async function getComplaintAnalytics(): Promise<ComplaintAnalytics> {
  const response = await apiRequest<ComplaintAnalytics>("/analytics/complaints")
  return response.data
}
