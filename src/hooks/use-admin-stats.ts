"use client"

import { getAdminOverview, getComplaintAnalytics } from "@/lib/api/analytics"
import { queryKeys } from "@/lib/api/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.adminOverview,
    queryFn: getAdminOverview,
  })
}

export function useAdminComplaintAnalytics() {
  return useQuery({
    queryKey: queryKeys.adminComplaints,
    queryFn: getComplaintAnalytics,
  })
}
