import { getPublicEnv } from "@/lib/env"
import { clearAccessToken, getAccessToken } from "@/lib/auth/token"
import type { ApiFieldError, ApiResponse } from "@/types/api"

export class ApiClientError extends Error {
  readonly status: number
  readonly errors: ApiFieldError[]

  constructor(status: number, message: string, errors: ApiFieldError[] = []) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.errors = errors
  }
}

export type QueryValue = string | number | boolean | undefined

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  query?: Record<string, QueryValue>
  auth?: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function readFieldErrors(value: unknown): ApiFieldError[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.message !== "string") {
      return []
    }

    return [
      {
        field: typeof item.field === "string" ? item.field : undefined,
        message: item.message,
      },
    ]
  })
}

function readError(status: number, payload: unknown): ApiClientError {
  if (!isRecord(payload)) {
    return new ApiClientError(status, "Something went wrong")
  }

  const message =
    typeof payload.message === "string"
      ? payload.message
      : "Something went wrong"

  return new ApiClientError(status, message, readFieldErrors(payload.errors))
}

function readSuccess<T>(payload: unknown): ApiResponse<T> {
  if (!isRecord(payload) || payload.success !== true) {
    throw new ApiClientError(500, "Unexpected API response")
  }

  return {
    success: true,
    message: typeof payload.message === "string" ? payload.message : "",
    data: payload.data as T,
  }
}

function toQuery(query: Record<string, QueryValue> | undefined): string {
  if (!query) {
    return ""
  }

  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") {
      continue
    }

    params.set(key, String(value))
  }

  const text = params.toString()
  return text ? `?${text}` : ""
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const { NEXT_PUBLIC_API_URL: apiUrl } = getPublicEnv()
  const headers = new Headers({ Accept: "application/json" })
  const useAuth = options.auth !== false
  const token = useAuth ? getAccessToken() : null

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  let response: Response

  try {
    response = await fetch(`${apiUrl}${path}${toQuery(options.query)}`, {
      method: options.method ?? "GET",
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiClientError(0, "Unable to reach the CivicFix API")
  }

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      clearAccessToken()
    }

    throw readError(response.status, payload)
  }

  return readSuccess<T>(payload)
}
