"use client"

import { getCurrentUser } from "@/lib/api/auth"
import { queryKeys } from "@/lib/api/query-keys"
import { hasAccessToken } from "@/lib/auth/token"
import { useQuery } from "@tanstack/react-query"

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: getCurrentUser,
    enabled: hasAccessToken(),
  })
}
