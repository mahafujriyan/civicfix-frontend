"use client"

import {
  login,
  loginWithGoogle,
  logout,
  register,
  type GoogleLoginRequest,
  type LoginRequest,
  type RegisterRequest,
} from "@/lib/api/auth"
import { queryKeys } from "@/lib/api/query-keys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: LoginRequest) => login(input),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.me, session.user)
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: RegisterRequest) => register(input),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.me, session.user)
    },
  })
}

export function useGoogleLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: GoogleLoginRequest) => loginWithGoogle(input),
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.me, session.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      logout()
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
