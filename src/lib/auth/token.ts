import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/auth/access-token"

const ACCESS_TOKEN_KEY = "civicfix.accessToken"

function canUseStorage(): boolean {
  return typeof window !== "undefined"
}

function readCookieToken(): string | null {
  const prefix = `${ACCESS_TOKEN_COOKIE}=`
  const parts = document.cookie.split("; ")
  const match = parts.find((part) => part.startsWith(prefix))
  if (!match) {
    return null
  }

  return decodeURIComponent(match.slice(prefix.length))
}

export function getAccessToken(): string | null {
  if (!canUseStorage()) {
    return null
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? readCookieToken()
}

export function setAccessToken(token: string): void {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${ACCESS_TOKEN_MAX_AGE_SECONDS}; SameSite=Lax${secure}`
}

export function clearAccessToken(): void {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function hasAccessToken(): boolean {
  return getAccessToken() !== null
}
