"use client"

import {
  listNotifications,
  markNotificationRead,
} from "@/lib/api/notifications"
import { queryKeys } from "@/lib/api/query-keys"
import { hasAccessToken } from "@/lib/auth/token"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: listNotifications,
    enabled: hasAccessToken(),
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
    },
  })
}
