import { apiRequest, type QueryValue } from "@/lib/api/client"
import type { Paginated } from "@/types/api"
import type { Department, SortOrder } from "@/types/domain"

export type DepartmentListQuery = {
  page?: number
  limit?: number
  search?: string
  sortBy?: "name" | "createdAt"
  sortOrder?: SortOrder
  isActive?: boolean
}

export type DepartmentWriteRequest = {
  name: string
  description?: string
  isActive?: boolean
}

export type DepartmentUpdateRequest = {
  name?: string
  description?: string | null
  isActive?: boolean
}

function toQuery(query: DepartmentListQuery): Record<string, QueryValue> {
  return { ...query }
}

export async function listDepartments(
  query: DepartmentListQuery = {},
): Promise<Paginated<Department>> {
  const response = await apiRequest<Paginated<Department>>("/departments", {
    query: toQuery(query),
    auth: false,
  })
  return response.data
}

export async function getDepartment(id: string): Promise<Department> {
  const response = await apiRequest<Department>(`/departments/${id}`, {
    auth: false,
  })
  return response.data
}

export async function createDepartment(
  input: DepartmentWriteRequest,
): Promise<Department> {
  const response = await apiRequest<Department>("/departments", {
    method: "POST",
    body: input,
  })
  return response.data
}

export async function updateDepartment(
  id: string,
  input: DepartmentUpdateRequest,
): Promise<Department> {
  const response = await apiRequest<Department>(`/departments/${id}`, {
    method: "PATCH",
    body: input,
  })
  return response.data
}

export async function deleteDepartment(id: string): Promise<null> {
  const response = await apiRequest<null>(`/departments/${id}`, {
    method: "DELETE",
  })
  return response.data
}
