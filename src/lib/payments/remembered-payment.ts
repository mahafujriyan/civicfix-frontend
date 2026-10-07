const storageKey = "civicfix.lastPaymentId"

export function rememberPaymentId(id: string): void {
  sessionStorage.setItem(storageKey, id)
}

export function readRememberedPaymentId(): string | null {
  return sessionStorage.getItem(storageKey)
}
