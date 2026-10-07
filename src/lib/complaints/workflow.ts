import type { ComplaintStatus, Priority, UserRole } from "@/types/domain"

export const COMPLAINT_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "REJECTED",
  "CANCELLED",
] as const satisfies readonly ComplaintStatus[]

export const PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const satisfies readonly Priority[]

export const COMPLAINT_TRANSITIONS: Record<
  ComplaintStatus,
  readonly ComplaintStatus[]
> = {
  SUBMITTED: ["UNDER_REVIEW", "REJECTED", "CANCELLED"],
  UNDER_REVIEW: ["ASSIGNED", "REJECTED", "CANCELLED"],
  ASSIGNED: ["IN_PROGRESS", "REJECTED", "CANCELLED"],
  IN_PROGRESS: ["RESOLVED", "CANCELLED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
  REJECTED: [],
  CANCELLED: [],
}

export function nextStatusesForRole(
  role: UserRole,
  from: ComplaintStatus,
): ComplaintStatus[] {
  const next = COMPLAINT_TRANSITIONS[from]

  if (role === "STAFF") {
    return next.filter(
      (status) => status === "IN_PROGRESS" || status === "RESOLVED",
    )
  }

  if (role === "CITIZEN") {
    if (from !== "SUBMITTED" && from !== "UNDER_REVIEW") {
      return []
    }

    return next.filter((status) => status === "CANCELLED")
  }

  return [...next]
}
