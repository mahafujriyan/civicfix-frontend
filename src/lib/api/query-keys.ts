import type { CategoryListQuery } from "@/lib/api/categories"
import type { ComplaintListQuery } from "@/lib/api/complaints"
import type { DepartmentListQuery } from "@/lib/api/departments"
import type { UserListQuery } from "@/lib/api/users"

export const queryKeys = {
  me: ["auth", "me"] as const,
  users: (query: UserListQuery) => ["users", query] as const,
  user: (id: string) => ["users", id] as const,
  complaints: (query: ComplaintListQuery) => ["complaints", query] as const,
  complaint: (id: string) => ["complaints", id] as const,
  complaintHistory: (id: string) => ["complaints", id, "history"] as const,
  complaintComments: (id: string) => ["complaints", id, "comments"] as const,
  complaintFeedback: (id: string) => ["complaints", id, "feedback"] as const,
  departments: (query: DepartmentListQuery) => ["departments", query] as const,
  department: (id: string) => ["departments", id] as const,
  categories: (query: CategoryListQuery) => ["categories", query] as const,
  category: (id: string) => ["categories", id] as const,
  payment: (id: string) => ["payments", id] as const,
  notifications: ["notifications"] as const,
  adminOverview: ["analytics", "overview"] as const,
  adminComplaints: ["analytics", "complaints"] as const,
  assignableStaff: ["assignments", "staff"] as const,
}
