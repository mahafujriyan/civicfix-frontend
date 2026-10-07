import { ACCESS_TOKEN_COOKIE, decodeAccessToken } from "@/lib/auth/access-token"
import { safeNextPath } from "@/lib/auth/roles"
import type { UserRole } from "@/types/domain"
import { NextResponse, type NextRequest } from "next/server"

function isPathForRole(pathname: string, role: UserRole): boolean {
  if (role === "ADMIN") {
    return pathname === "/admin" || pathname.startsWith("/admin/")
  }

  if (role === "STAFF") {
    return pathname === "/staff" || pathname.startsWith("/staff/")
  }

  return pathname === "/dashboard" || pathname.startsWith("/dashboard/")
}

function isProtectedPath(pathname: string): boolean {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/staff" ||
    pathname.startsWith("/staff/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const claims = token ? decodeAccessToken(token) : null

  if (pathname === "/login" || pathname === "/register") {
    if (!claims) {
      return NextResponse.next()
    }

    const nextPath = request.nextUrl.searchParams.get("next")
    return NextResponse.redirect(
      new URL(safeNextPath(nextPath, claims.role), request.url),
    )
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  if (!claims) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!isPathForRole(pathname, claims.role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/staff",
    "/staff/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
  ],
}
