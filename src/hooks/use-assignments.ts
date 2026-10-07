"use client"

import { listAssignableStaff } from "@/lib/api/assignments"
import { queryKeys } from "@/lib/api/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useAssignableStaff() {
  return useQuery({
    queryKey: queryKeys.assignableStaff,
    queryFn: listAssignableStaff,
  })
}
