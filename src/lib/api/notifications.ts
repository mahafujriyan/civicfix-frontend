import { apiRequest } from "@/lib/api/client"
import type { Notification } from "@/types/domain"

export async function listNotifications(): Promise<Notification[]> {
  const response = await apiRequest<Notification[]>("/notifications")
  return response.data
}

export async function markNotificationRead(id: string): Promise<null> {
  const response = await apiRequest<null>(`/notifications/${id}/read`, {
    method: "PATCH",
  })
  return response.data
}
