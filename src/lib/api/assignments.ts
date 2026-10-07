import { apiRequest } from "@/lib/api/client"
import type { AssignableStaff, Complaint } from "@/types/domain"

export type AssignComplaintRequest = {
  staffId: string
  departmentId?: string
  notes?: string
}

export async function assignComplaint(
  id: string,
  input: AssignComplaintRequest,
): Promise<Complaint> {
  const response = await apiRequest<Complaint>(`/complaints/${id}/assign`, {
    method: "POST",
    body: input,
  })
  return response.data
}

export async function listAssignableStaff(): Promise<AssignableStaff[]> {
  const response = await apiRequest<AssignableStaff[]>("/assignments/staff")
  return response.data
}
