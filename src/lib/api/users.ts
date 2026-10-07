import { apiRequest, type QueryValue } from "@/lib/api/client"
import type { Paginated } from "@/types/api"
import type { SortOrder, User, UserRole } from "@/types/domain"

export type UserListQuery = {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  sortBy?: "createdAt" | "fullName" | "email"
  sortOrder?: SortOrder
}

export type UpdateProfileRequest = {
  fullName?: string
  phone?: string | null
}

export type UpdateUserStatusRequest = {
  isActive: boolean
}

function toQuery(query: UserListQuery): Record<string, QueryValue> {
  return { ...query }
}

export async function listUsers(
  query: UserListQuery = {},
): Promise<Paginated<User>> {
  const response = await apiRequest<Paginated<User>>("/users", {
    query: toQuery(query),
  })
  return response.data
}

export async function getUser(id: string): Promise<User> {
  const response = await apiRequest<User>(`/users/${id}`)
  return response.data
}

export async function getProfile(): Promise<User> {
  const response = await apiRequest<User>("/users/me")
  return response.data
}

export async function updateProfile(
  input: UpdateProfileRequest,
): Promise<User> {
  const response = await apiRequest<User>("/users/me", {
    method: "PATCH",
    body: input,
  })
  return response.data
}

export async function updateUserStatus(
  id: string,
  input: UpdateUserStatusRequest,
): Promise<User> {
  const response = await apiRequest<User>(`/users/${id}/status`, {
    method: "PATCH",
    body: input,
  })
  return response.data
}
