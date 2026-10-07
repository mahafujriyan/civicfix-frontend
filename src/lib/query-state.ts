import type { ComplaintListQuery } from "@/lib/api/complaints"
import type { UserListQuery } from "@/lib/api/users"
import {
  COMPLAINT_STATUSES,
  PRIORITIES,
} from "@/lib/complaints/workflow"
import type {
  ComplaintStatus,
  Priority,
  SortOrder,
  UserRole,
} from "@/types/domain"

const complaintSorts = [
  "createdAt",
  "updatedAt",
  "priority",
  "status",
  "title",
] as const

const userSorts = ["createdAt", "fullName", "email"] as const
const roles = ["CITIZEN", "STAFF", "ADMIN"] as const

export function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) {
    return fallback
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback
  }

  return parsed
}

function oneOf<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T | undefined {
  if (!value) {
    return undefined
  }

  return allowed.includes(value as T) ? (value as T) : undefined
}

export function parseComplaintQuery(
  params: Pick<URLSearchParams, "get">,
): ComplaintListQuery {
  const sortBy = oneOf(params.get("sortBy"), complaintSorts) ?? "createdAt"
  const sortOrder = oneOf<SortOrder>(params.get("sortOrder"), ["asc", "desc"]) ?? "desc"

  return {
    page: parsePositiveInt(params.get("page"), 1),
    limit: Math.min(parsePositiveInt(params.get("limit"), 10), 100),
    search: params.get("search")?.trim() || undefined,
    status: oneOf<ComplaintStatus>(params.get("status"), COMPLAINT_STATUSES),
    priority: oneOf<Priority>(params.get("priority"), PRIORITIES),
    categoryId: params.get("categoryId")?.trim() || undefined,
    departmentId: params.get("departmentId")?.trim() || undefined,
    sortBy,
    sortOrder,
  }
}

export function parseUserQuery(
  params: Pick<URLSearchParams, "get">,
): UserListQuery {
  return {
    page: parsePositiveInt(params.get("page"), 1),
    limit: Math.min(parsePositiveInt(params.get("limit"), 10), 100),
    search: params.get("search")?.trim() || undefined,
    role: oneOf<UserRole>(params.get("role"), roles),
    sortBy: oneOf(params.get("sortBy"), userSorts) ?? "createdAt",
    sortOrder:
      oneOf<SortOrder>(params.get("sortOrder"), ["asc", "desc"]) ?? "desc",
  }
}

export function hrefWithParams(
  pathname: string,
  current: Pick<URLSearchParams, "entries">,
  patch: Record<string, string | null>,
): string {
  const next = new URLSearchParams()

  for (const [key, value] of current.entries()) {
    next.set(key, value)
  }

  for (const [key, value] of Object.entries(patch)) {
    if (!value) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
  }

  const text = next.toString()
  return text ? `${pathname}?${text}` : pathname
}
