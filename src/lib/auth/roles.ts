import type { UserRole } from "@/types/domain"

export function homeForRole(role: UserRole): string {
  if (role === "ADMIN") {
    return "/admin"
  }

  if (role === "STAFF") {
    return "/staff"
  }

  return "/dashboard"
}

export function safeNextPath(nextPath: string | null, role: UserRole): string {
  const home = homeForRole(role)
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return home
  }

  const allowed =
    role === "ADMIN"
      ? nextPath === "/admin" || nextPath.startsWith("/admin/")
      : role === "STAFF"
        ? nextPath === "/staff" || nextPath.startsWith("/staff/")
        : nextPath === "/dashboard" || nextPath.startsWith("/dashboard/")

  return allowed ? nextPath : home
}
