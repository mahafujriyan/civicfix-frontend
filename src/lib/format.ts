import { ApiClientError } from "@/lib/api/client"

export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiClientError ? error.message : fallback
}

export function formatWhen(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export function formatMoney(amount: number, currency: string): string {
  const code = currency.trim().toUpperCase()
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
    }).format(amount / 100)
  } catch {
    return `${amount} ${code}`
  }
}
