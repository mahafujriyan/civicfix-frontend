import { apiRequest, type QueryValue } from "@/lib/api/client"
import type { Paginated } from "@/types/api"
import type { Category, SortOrder } from "@/types/domain"

export type CategoryListQuery = {
  page?: number
  limit?: number
  search?: string
  departmentId?: string
  sortBy?: "name" | "createdAt"
  sortOrder?: SortOrder
  isActive?: boolean
}

export type CategoryWriteRequest = {
  name: string
  description?: string
  departmentId?: string
  isActive?: boolean
}

export type CategoryUpdateRequest = {
  name?: string
  description?: string | null
  departmentId?: string | null
  isActive?: boolean
}

function toQuery(query: CategoryListQuery): Record<string, QueryValue> {
  return { ...query }
}

export async function listCategories(
  query: CategoryListQuery = {},
): Promise<Paginated<Category>> {
  const response = await apiRequest<Paginated<Category>>("/categories", {
    query: toQuery(query),
    auth: false,
  })
  return response.data
}

export async function getCategory(id: string): Promise<Category> {
  const response = await apiRequest<Category>(`/categories/${id}`, {
    auth: false,
  })
  return response.data
}

export async function createCategory(
  input: CategoryWriteRequest,
): Promise<Category> {
  const response = await apiRequest<Category>("/categories", {
    method: "POST",
    body: input,
  })
  return response.data
}

export async function updateCategory(
  id: string,
  input: CategoryUpdateRequest,
): Promise<Category> {
  const response = await apiRequest<Category>(`/categories/${id}`, {
    method: "PATCH",
    body: input,
  })
  return response.data
}

export async function deleteCategory(id: string): Promise<null> {
  const response = await apiRequest<null>(`/categories/${id}`, {
    method: "DELETE",
  })
  return response.data
}
