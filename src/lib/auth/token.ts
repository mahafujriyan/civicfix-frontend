const ACCESS_TOKEN_KEY = "civicfix.accessToken"

function canUseStorage(): boolean {
  return typeof window !== "undefined"
}

export function getAccessToken(): string | null {
  if (!canUseStorage()) {
    return null
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string): void {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken(): void {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function hasAccessToken(): boolean {
  return getAccessToken() !== null
}
