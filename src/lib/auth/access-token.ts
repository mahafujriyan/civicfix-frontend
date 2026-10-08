import type { UserRole } from "@/types/domain"

export const ACCESS_TOKEN_COOKIE = "civicfix_access_token"
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

type TokenClaims = {
  role: UserRole
  exp: number | null
}

function isUserRole(value: unknown): value is UserRole {
  return value === "CITIZEN" || value === "STAFF" || value === "ADMIN"
}

function decodeJwtPayload(segment: string): unknown {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  )

  if (typeof Buffer !== "undefined") {
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8"))
  }

  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes))
}

export function decodeAccessToken(token: string): TokenClaims | null {
  const parts = token.split(".")
  if (parts.length !== 3) {
    return null
  }

  try {
    const payload: unknown = decodeJwtPayload(parts[1])
    if (typeof payload !== "object" || payload === null) {
      return null
    }

    const record = payload as Record<string, unknown>
    if (!isUserRole(record.role)) {
      return null
    }

    const exp = typeof record.exp === "number" ? record.exp : null
    if (exp !== null && exp * 1000 <= Date.now()) {
      return null
    }

    return { role: record.role, exp }
  } catch {
    return null
  }
}
