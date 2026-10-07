"use client"

import { queryKeys } from "@/lib/api/query-keys"
import {
  getProfile,
  listUsers,
  updateProfile,
  updateUserStatus,
  type UpdateProfileRequest,
  type UpdateUserStatusRequest,
  type UserListQuery,
} from "@/lib/api/users"
import { hasAccessToken } from "@/lib/auth/token"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function useProfile() {
  return useQuery({
    queryKey: ["users", "me"] as const,
    queryFn: getProfile,
    enabled: hasAccessToken(),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateProfileRequest) => updateProfile(input),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.me, user)
      queryClient.setQueryData(["users", "me"], user)
    },
  })
}

export function useUsers(query: UserListQuery = {}) {
  return useQuery({
    queryKey: queryKeys.users(query),
    queryFn: () => listUsers(query),
  })
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateUserStatusRequest & { id: string }) =>
      updateUserStatus(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
