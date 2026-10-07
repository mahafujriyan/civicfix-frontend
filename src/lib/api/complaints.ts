import { apiRequest, type QueryValue } from "@/lib/api/client"
import type { Paginated } from "@/types/api"
import type {
  Comment,
  Complaint,
  ComplaintStatus,
  ComplaintStatusHistory,
  LocationInput,
  Priority,
  SortOrder,
} from "@/types/domain"

export type ComplaintListQuery = {
  page?: number
  limit?: number
  search?: string
  status?: ComplaintStatus
  priority?: Priority
  categoryId?: string
  departmentId?: string
  sortBy?: "createdAt" | "updatedAt" | "priority" | "status" | "title"
  sortOrder?: SortOrder
}

export type CreateComplaintRequest = {
  title: string
  description: string
  categoryId: string
  priority?: Priority
  location: LocationInput
}

export type UpdateComplaintRequest = {
  title?: string
  description?: string
  priority?: Priority
  categoryId?: string
  location?: LocationInput
}

export type UpdateComplaintStatusRequest = {
  status: ComplaintStatus
  note?: string
}

export type CreateCommentRequest = {
  content: string
  isInternal?: boolean
}

function toQuery(query: ComplaintListQuery): Record<string, QueryValue> {
  return { ...query }
}

export async function listComplaints(
  query: ComplaintListQuery = {},
): Promise<Paginated<Complaint>> {
  const response = await apiRequest<Paginated<Complaint>>("/complaints", {
    query: toQuery(query),
  })
  return response.data
}

export async function getComplaint(id: string): Promise<Complaint> {
  const response = await apiRequest<Complaint>(`/complaints/${id}`)
  return response.data
}

export async function createComplaint(
  input: CreateComplaintRequest,
): Promise<Complaint> {
  const response = await apiRequest<Complaint>("/complaints", {
    method: "POST",
    body: input,
  })
  return response.data
}

export async function updateComplaint(
  id: string,
  input: UpdateComplaintRequest,
): Promise<Complaint> {
  const response = await apiRequest<Complaint>(`/complaints/${id}`, {
    method: "PATCH",
    body: input,
  })
  return response.data
}

export async function deleteComplaint(id: string): Promise<null> {
  const response = await apiRequest<null>(`/complaints/${id}`, {
    method: "DELETE",
  })
  return response.data
}

export async function updateComplaintStatus(
  id: string,
  input: UpdateComplaintStatusRequest,
): Promise<Complaint> {
  const response = await apiRequest<Complaint>(`/complaints/${id}/status`, {
    method: "PATCH",
    body: input,
  })
  return response.data
}

export async function getComplaintHistory(
  id: string,
): Promise<ComplaintStatusHistory[]> {
  const response = await apiRequest<ComplaintStatusHistory[]>(
    `/complaints/${id}/history`,
  )
  return response.data
}

export async function listComments(id: string): Promise<Comment[]> {
  const response = await apiRequest<Comment[]>(`/complaints/${id}/comments`)
  return response.data
}

export async function createComment(
  id: string,
  input: CreateCommentRequest,
): Promise<Comment> {
  const response = await apiRequest<Comment>(`/complaints/${id}/comments`, {
    method: "POST",
    body: input,
  })
  return response.data
}
